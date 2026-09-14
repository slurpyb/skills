# Claude integration

Two genuinely different ways to combine Perplexity with Claude. Pick by who's in control.

## Table of contents
- [Which angle?](#which-angle)
- [Angle A — Claude calls Perplexity (tool use)](#angle-a--claude-calls-perplexity-tool-use)
- [Multi-turn tool-use loop](#multi-turn-tool-use-loop)
- [Structured output from grounded data](#structured-output-from-grounded-data)
- [Prompt caching](#prompt-caching)
- [Angle B — Perplexity routes to Claude](#angle-b--perplexity-routes-to-claude)
- [Model selection](#model-selection)

## Which angle?

| | Angle A: Claude → Perplexity | Angle B: Perplexity Agent → Claude |
| --- | --- | --- |
| Control | Your Claude app orchestrates; Perplexity is a tool | Perplexity orchestrates the model + web tools |
| Keys | Anthropic key **and** Perplexity key | Perplexity key only |
| Use when | You already build on the Anthropic SDK and want web grounding as one capability among many (alongside your own tools) | You want web-grounded Claude with zero tool-loop code, or to A/B Claude vs GPT vs Gemini behind one interface |
| Tradeoff | Full control of the loop, your prompt-caching, your tools | Less code; web search is built in; billed at provider rates via Perplexity |

Runnable: angle A → assets/perplexity-claude-agent.ts · angle B → assets/agent-to-claude.ts.

## Angle A — Claude calls Perplexity (tool use)

Give Claude two tools and let it decide:

- **`perplexity_search`** → Search API (`/search`): raw ranked results when Claude wants links it can
  read/cite itself.
- **`perplexity_ask`** → Sonar (`/chat/completions`): a synthesized, cited answer when Claude wants a
  quick grounded summary rather than raw results.

```ts
const tools = [
  { name: 'perplexity_search',
    description: 'Search the live web; returns ranked results with title, url, snippet, date.',
    input_schema: { type: 'object',
      properties: { query: { type: 'string' }, max_results: { type: 'integer' },
        recency: { type: 'string', enum: ['day', 'week', 'month', 'year'] } },
      required: ['query'] } },
  { name: 'perplexity_ask',
    description: 'Ask Perplexity Sonar for a cited, web-grounded answer to a question.',
    input_schema: { type: 'object',
      properties: { question: { type: 'string' } }, required: ['question'] } },
];
```

Execute a call against Perplexity and return compact JSON to Claude:

```ts
const PH = { Authorization: `Bearer ${process.env.PERPLEXITY_API_KEY}`, 'Content-Type': 'application/json' };

async function runTool(name: string, input: any): Promise<string> {
  if (name === 'perplexity_search') {
    const r = await fetch('https://api.perplexity.ai/search', { method: 'POST', headers: PH,
      body: JSON.stringify({ query: input.query, max_results: input.max_results ?? 5,
        ...(input.recency ? { search_recency_filter: input.recency } : {}) }) }).then((r) => r.json());
    return JSON.stringify((r.results ?? []).map((d: any) => ({ title: d.title, url: d.url, snippet: d.snippet })));
  }
  if (name === 'perplexity_ask') {
    const r = await fetch('https://api.perplexity.ai/chat/completions', { method: 'POST', headers: PH,
      body: JSON.stringify({ model: 'sonar', messages: [{ role: 'user', content: input.question }] }) }).then((r) => r.json());
    return JSON.stringify({ answer: r.choices[0].message.content, sources: r.search_results });
  }
  throw new Error(`unknown tool ${name}`);
}
```

Return compact result JSON (titles + urls, not full pages) and let Claude decide what to pull deeper —
keeps tokens down.

## Multi-turn tool-use loop

The loop the quickstarts omit: keep going while Claude wants tools.

```ts
import Anthropic from '@anthropic-ai/sdk';
const anthropic = new Anthropic();
const MODEL = 'claude-haiku-4-5';                 // surface the choice; escalate for hard synthesis
const MAX_TURNS = 6;

const messages: Anthropic.MessageParam[] = [{ role: 'user', content: userQuestion }];
for (let turn = 0; turn < MAX_TURNS; turn++) {
  const res = await anthropic.messages.create({ model: MODEL, max_tokens: 1024, tools, messages });
  messages.push({ role: 'assistant', content: res.content });   // push assistant turn WITH blocks
  if (res.stop_reason !== 'tool_use') { console.log(text(res)); break; }

  const results: Anthropic.ToolResultBlockParam[] = [];
  for (const block of res.content) {
    if (block.type !== 'tool_use') continue;
    try {
      results.push({ type: 'tool_result', tool_use_id: block.id, content: await runTool(block.name, block.input) });
    } catch (e) {
      results.push({ type: 'tool_result', tool_use_id: block.id, content: String(e), is_error: true });
    }
  }
  messages.push({ role: 'user', content: results });             // return matching tool_results
}
const text = (r: Anthropic.Message) => r.content.filter((b) => b.type === 'text').map((b: any) => b.text).join('');
```

Rules: push the assistant turn with its original `content` blocks; every `tool_use` needs a matching
`tool_result` with the same `tool_use_id`; on failure set `is_error: true` so Claude can recover;
bound the loop with `MAX_TURNS`.

## Structured output from grounded data

When you want typed data out, do the search yourself, then a single forced-tool Claude call:

```ts
const search = await fetch('https://api.perplexity.ai/search', { method: 'POST', headers: PH,
  body: JSON.stringify({ query, max_results: 6 }) }).then((r) => r.json());
const ctx = search.results.map((d: any, i: number) => `[${i + 1}] ${d.url}\n${d.snippet}`).join('\n\n');

const schema = { type: 'object', properties: { answer: { type: 'string' }, sources: { type: 'array', items: { type: 'string' } } }, required: ['answer', 'sources'] };
const res = await anthropic.messages.create({ model: MODEL, max_tokens: 800,
  tools: [{ name: 'record', description: 'Record the cited answer', input_schema: schema }],
  tool_choice: { type: 'tool', name: 'record' },
  messages: [{ role: 'user', content: `Answer using ONLY these sources, cite urls.\n\n${ctx}\n\nQ: ${query}` }] });
const out = (res.content.find((b) => b.type === 'tool_use') as any).input;   // { answer, sources }
```

Forced tool use (`tool_choice`) is more robust than JSON prefill for guaranteed shape.

## Prompt caching

When you fetch a large page (Search `max_tokens_per_page` high, or `fetch_url_content`) and ask
several questions about it, cache it so you pay for the tokens once:

```ts
messages: [{ role: 'user', content: [
  { type: 'text', text: bigFetchedPage, cache_control: { type: 'ephemeral' } },
  { type: 'text', text: question },
] }]
```

## Angle B — Perplexity routes to Claude

No tool loop, no Anthropic SDK — Perplexity runs Claude with web search built in:

```ts
const r = await fetch('https://api.perplexity.ai/v1/agent', { method: 'POST', headers: PH,
  body: JSON.stringify({
    model: 'anthropic/claude-sonnet-4-6',
    input: 'What shipped in the latest Claude model? Cite sources.',
    tools: [{ type: 'web_search', search_context_size: 'medium' }],
  }) }).then((r) => r.json());
console.log(r.output_text);                       // grounded Claude answer; r.usage.cost.total_cost in USD
```

Swap `model` to compare `openai/gpt-5.5`, `google/gemini-3.1-pro-preview`, etc. with identical code —
ideal for model bake-offs (references/cookbooks.md). Use `models: [...]` for automatic fallback.

## Model selection

Surface the choice; don't hardcode silently.

- **Perplexity side:** `sonar` (cheap facts) → `sonar-pro` (substance) → `sonar-reasoning-pro`
  (show reasoning) → `sonar-deep-research` (reports). Or, on the Agent API, any `provider/model`.
- **Claude side (angle A):** `claude-haiku-4-5` for routing / light synthesis; escalate to
  `claude-sonnet-4-6` / `claude-opus-4-8` for hard reasoning over many sources.
- **Angle B:** name the Claude model directly (`anthropic/claude-*`) — `GET /v1/models` for the live list.
