# Wiring Jina into Claude (Anthropic)

Patterns for using Jina (search/read/rerank/embed) with `@anthropic-ai/sdk` in TypeScript/Node.
Install: `npm install @anthropic-ai/sdk`. Both keys via env: `JINA_API_KEY`, `ANTHROPIC_API_KEY`.

## Table of contents
- [Two integration shapes](#two-integration-shapes)
- [Tool use: search_web + read_url](#tool-use-search_web--read_url)
- [The multi-turn loop](#the-multi-turn-loop)
- [RAG: search → read → rerank → answer](#rag-search--read--rerank--answer)
- [Structured output](#structured-output)
- [Prompt caching read pages](#prompt-caching-read-pages)
- [Model selection](#model-selection)

## Two integration shapes

- **Pipeline (you drive):** fixed steps — search, read, rerank, then one Claude call to synthesize.
  Predictable cost, best for RAG/Q&A. See [RAG](#rag-search--read--rerank--answer) and
  assets/rag-pipeline.ts.
- **Agent (Claude drives):** give Claude Jina tools and let it decide when to search/read. Flexible,
  best for open-ended research. See [tool use](#tool-use-search_web--read_url) and
  assets/jina-claude-agent.ts.

## Tool use: search_web + read_url

```ts
import Anthropic from '@anthropic-ai/sdk';

const tools: Anthropic.Tool[] = [
  { name: 'search_web',
    description: 'Search the web; returns titles, URLs, and snippets. Use to find pages.',
    input_schema: { type: 'object', properties: { query: { type: 'string' }, num: { type: 'number' } }, required: ['query'] } },
  { name: 'read_url',
    description: 'Read a URL and return clean markdown. Use after finding a promising URL.',
    input_schema: { type: 'object', properties: { url: { type: 'string' } }, required: ['url'] } },
];

const JH = { Authorization: `Bearer ${process.env.JINA_API_KEY}` };

async function runTool(name: string, input: any): Promise<string> {
  if (name === 'search_web') {
    const r = await fetch('https://s.jina.ai/', {
      method: 'POST',
      headers: { ...JH, 'Content-Type': 'application/json', 'X-Respond-With': 'no-content' }, // metadata only — cheap
      body: JSON.stringify({ q: input.query, num: input.num ?? 5 }),
    }).then((x) => x.json());
    return JSON.stringify((r.data ?? []).map((d: any) => ({ title: d.title, url: d.url, snippet: d.description })));
  }
  if (name === 'read_url') {
    const r = await fetch(`https://r.jina.ai/${input.url}`, {
      headers: { ...JH, Accept: 'application/json', 'X-Token-Budget': '50000' },
    }).then((x) => x.json());
    return (r.data?.content ?? '').slice(0, 50_000);
  }
  throw new Error(`Unknown tool: ${name}`);
}
```

Return search results as a small JSON list (titles + URLs), not full pages — let Claude pick a URL to
`read_url`. That keeps each turn cheap.

## The multi-turn loop

Loop while `stop_reason === 'tool_use'`; append the assistant turn **and** a `tool_result` each round.

```ts
const anthropic = new Anthropic();
const messages: Anthropic.MessageParam[] = [{ role: 'user', content: prompt }];

for (let turn = 0; turn < 8; turn++) {
  const res = await anthropic.messages.create({ model: MODEL, max_tokens: 1024, tools, messages });
  messages.push({ role: 'assistant', content: res.content }); // preserve tool_use ids

  if (res.stop_reason !== 'tool_use') {
    const t = res.content.find((b) => b.type === 'text');
    return t?.type === 'text' ? t.text : '';
  }

  const toolResults: Anthropic.ToolResultBlockParam[] = [];
  for (const block of res.content) {
    if (block.type !== 'tool_use') continue;
    try {
      toolResults.push({ type: 'tool_result', tool_use_id: block.id, content: await runTool(block.name, block.input) });
    } catch (e) {
      toolResults.push({ type: 'tool_result', tool_use_id: block.id, content: `Error: ${(e as Error).message}`, is_error: true });
    }
  }
  messages.push({ role: 'user', content: toolResults });
}
```

Rules: append the assistant message with its original content blocks (ids must round-trip); each
`tool_result` references the matching `tool_use_id`; return errors with `is_error: true` so Claude can
recover; always bound the turn count. Full runnable version: assets/jina-claude-agent.ts.

## RAG: search → read → rerank → answer

You control the steps; one Claude call at the end. Best precision per token.

```ts
// 1. search (metadata) → 2. read top URLs → 3. rerank passages → 4. Claude answers from top_n
const hits = await fetch('https://s.jina.ai/', { method: 'POST',
  headers: { ...JH, 'Content-Type': 'application/json', 'X-Respond-With': 'no-content' },
  body: JSON.stringify({ q: question, num: 10 }) }).then((r) => r.json());

const docs = (await Promise.all(hits.data.slice(0, 5).map((h: any) =>
  fetch(`https://r.jina.ai/${h.url}`, { headers: { ...JH, Accept: 'application/json', 'X-Token-Budget': '8000' } })
    .then((r) => r.json()).then((d) => ({ url: h.url, text: d.data?.content ?? '' }))
))).filter((d) => d.text);

const rr = await fetch('https://api.jina.ai/v1/rerank', { method: 'POST',
  headers: { ...JH, 'Content-Type': 'application/json' },
  body: JSON.stringify({ model: 'jina-reranker-v3', query: question, documents: docs.map((d) => d.text), top_n: 3 }),
}).then((r) => r.json());

const context = rr.results.map((x: any) => `[${x.index + 1}] ${docs[x.index].url}\n${docs[x.index].text}`).join('\n\n---\n\n');
const ans = await anthropic.messages.create({ model: MODEL, max_tokens: 1024,
  system: 'Answer using ONLY the sources. Cite with [n].',
  messages: [{ role: 'user', content: `Q: ${question}\n\nSources:\n${context}` }] });
```

Full version: assets/rag-pipeline.ts.

## Structured output

Force a tool whose `input_schema` is your output shape so Claude returns shaped args (no JSON-in-prose
parsing). Validate with zod at the boundary.

```ts
const res = await anthropic.messages.create({ model: MODEL, max_tokens: 512,
  tools: [{ name: 'record', description: 'Record extracted fields', input_schema: schema }],
  tool_choice: { type: 'tool', name: 'record' },
  messages: [{ role: 'user', content: `Extract fields:\n\n${doc}` }] });
const call = res.content.find((b) => b.type === 'tool_use');
const data = call?.type === 'tool_use' ? call.input : null;
```

Alternatively, skip Claude entirely and use **Reader's `instruction` + `jsonSchema`** to extract
during the read (references/reader.md) — one call, no second model.

## Prompt caching read pages

Reader output is large and often reused across turns/questions. Cache it with `cache_control` so the
big block is billed at a discount on reuse (~5-min TTL).

```ts
await anthropic.messages.create({ model: MODEL, max_tokens: 1024,
  system: [
    { type: 'text', text: 'Answer strictly from the document.' },
    { type: 'text', text: readContent, cache_control: { type: 'ephemeral' } }, // cache the page
  ],
  messages: [{ role: 'user', content: question }] });
```

Also cap Reader output up front (`X-Token-Budget` / `X-Max-Tokens`) and rerank to `top_n` before it
reaches Claude.

## Model selection

Don't hardcode silently — confirm with the task. Keep one `const MODEL` so it's a one-line switch.

| Step | Default | Escalate to |
| --- | --- | --- |
| Tool routing / search dispatch | `claude-haiku-4-5` | — |
| Summarize a single page | `claude-haiku-4-5` | `claude-sonnet-4-6` if shallow |
| Synthesize a cited answer from many sources | `claude-sonnet-4-6` | `claude-opus-4-x` for hardest |

Jina-side model choice (which embedding/reranker) is separate — see references/embeddings.md and
references/rerank.md.
