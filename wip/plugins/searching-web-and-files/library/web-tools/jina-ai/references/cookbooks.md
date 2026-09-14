# Cookbooks

Composed Jina + Claude recipes. Assume `const JH = { Authorization: \`Bearer ${process.env.JINA_API_KEY}\` }`,
an `anthropic` client, and `const MODEL = 'claude-haiku-4-5'`. See claude-integration.md for the loop
and caching details, and the per-API references for options.

## Table of contents
- [1. Research agent (Claude drives Jina tools)](#1-research-agent)
- [2. SERP → rerank → cited answer (you drive)](#2-serp--rerank--cited-answer)
- [3. Site-scoped fact lookup](#3-site-scoped-fact-lookup)
- [4. Structured extraction over search results](#4-structured-extraction-over-search-results)
- [5. Index a corpus for retrieval](#5-index-a-corpus-for-retrieval)
- [6. Fact-check a claim (grounding)](#6-fact-check-a-claim-grounding)

## 1. Research agent

Let Claude decide when to search vs read. Full runnable: assets/jina-claude-agent.ts. Use when the
question is open-ended and the right sources aren't known up front. Pattern = tool-use loop with
`search_web` + `read_url` (claude-integration.md).

## 2. SERP → rerank → cited answer

Deterministic RAG — best precision per token. Full runnable: assets/rag-pipeline.ts. Steps:
1. `s.jina.ai` search with `X-Respond-With: no-content`, `num: 10` (cheap SERP).
2. Read the top ~5 URLs via `r.jina.ai` with `X-Token-Budget` to cap size.
3. `/v1/rerank` (`jina-reranker-v3`) the read passages against the question, `top_n: 3`.
4. One Claude call: "answer using ONLY the sources, cite with [n]".

## 3. Site-scoped fact lookup

Restrict search to a domain (docs, a vendor) and answer from it.

```ts
const hits = await fetch('https://s.jina.ai/', { method: 'POST',
  headers: { ...JH, 'Content-Type': 'application/json' },               // default: content included
  body: JSON.stringify({ q: 'rate limit headers', site: 'docs.stripe.com', num: 5 }),
}).then((r) => r.json());

const ctx = hits.data.map((d: any, i: number) => `[${i + 1}] ${d.url}\n${(d.content ?? '').slice(0, 6000)}`).join('\n\n');
const ans = await anthropic.messages.create({ model: MODEL, max_tokens: 800,
  system: 'Answer only from these docs; cite [n]. If absent, say not found.',
  messages: [{ role: 'user', content: `Q: How do I read rate-limit headers?\n\n${ctx}` }] });
```

`site` + `content` (default respondWith) means one call gives you searchable, readable, citable docs.

## 4. Structured extraction over search results

Search, then extract the same schema from each hit with forced tool use (claude-integration.md).
For per-page extraction with no reasoning, prefer Reader `instruction`+`jsonSchema` (reader.md).

```ts
import { z } from 'zod';
const Row = z.object({ company: z.string(), pricing: z.string().optional() });
const schema = { type: 'object', properties: { company: { type: 'string' }, pricing: { type: 'string' } }, required: ['company'] };

const hits = await fetch('https://s.jina.ai/', { method: 'POST', headers: { ...JH, 'Content-Type': 'application/json' },
  body: JSON.stringify({ q: 'vector database pricing', num: 8 }) }).then((r) => r.json());

const rows = [];
for (const h of hits.data) {
  const res = await anthropic.messages.create({ model: MODEL, max_tokens: 400,
    tools: [{ name: 'record', description: 'Record fields', input_schema: schema }],
    tool_choice: { type: 'tool', name: 'record' },
    messages: [{ role: 'user', content: `Extract from:\n${(h.content ?? h.description ?? '').slice(0, 20000)}` }] });
  const call = res.content.find((b) => b.type === 'tool_use');
  if (call?.type === 'tool_use') rows.push({ url: h.url, ...Row.parse(call.input) });
}
```

## 5. Index a corpus for retrieval

Embed documents for a vector store; query asymmetrically; rerank before the LLM.

```ts
// Index (passages)
const emb = await fetch('https://api.jina.ai/v1/embeddings', { method: 'POST', headers: { ...JH, 'Content-Type': 'application/json' },
  body: JSON.stringify({ model: 'jina-embeddings-v5-text-small', task: 'retrieval.passage', input: passages }),
}).then((r) => r.json());
// store emb.data[i].embedding ↔ passages[i] in your vector DB

// Query
const q = await fetch('https://api.jina.ai/v1/embeddings', { method: 'POST', headers: { ...JH, 'Content-Type': 'application/json' },
  body: JSON.stringify({ model: 'jina-embeddings-v5-text-small', task: 'retrieval.query', input: question }),
}).then((r) => r.json());
// vector-search with q.data[0].embedding → candidates → rerank (rerank.md) → Claude (claude-integration.md)
```

For >a few thousand passages, embed via async Batch (batch.md). Split long docs with the Segmenter
(other-endpoints.md) before embedding.

## 6. Fact-check a claim (grounding)

Verify a statement against the live web and get a structured verdict. Grounding now runs through
DeepSearch with a JSON schema (deepsearch.md). Use it to gate LLM output or check human-written
claims — send only checkable facts (not opinions/future events).

```ts
function parseVerdict(content: string) {
  const clean = content.replace(/<think>[\s\S]*?<\/think>/g, '').trim(); // strip reasoning block
  return JSON.parse(clean);
}

async function factCheck(statement: string) {
  const res = await fetch('https://deepsearch.jina.ai/v1/chat/completions', {
    method: 'POST', headers: { ...JH, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model: 'jina-deepsearch-v1', stream: true, reasoning_effort: 'low',
      messages: [{ role: 'user', content: `Fact-check this statement: ${statement}` }],
      response_format: { type: 'json_schema', json_schema: {   // schema DIRECTLY here — nesting under `schema` returns {}
        type: 'object',
        properties: { statement: { type: 'string' }, validity: { type: 'string', enum: ['true', 'false', 'unknown'] }, explanation: { type: 'string' } },
        required: ['statement', 'validity', 'explanation'] } },
    }),
  });
  let content = '';
  for (const line of (await res.text()).split('\n')) {
    if (!line.startsWith('data:')) continue;
    const p = line.slice(5).trim();
    if (p === '[DONE]') break;
    try { content += JSON.parse(p).choices?.[0]?.delta?.content ?? ''; } catch {}
  }
  return parseVerdict(content); // → { statement, validity: 'true'|'false'|'unknown', explanation }
}
// await factCheck('The Eiffel Tower is in Berlin.') → { validity: 'false', explanation: 'It is in Paris, France.' }
```

Stream (as above) — grounding can run ~30s and hundreds of thousands of tokens for contested claims
(trivial facts answer in seconds). Want sourced quotes too? Add a `references: [{url, quote,
supportive}]` array to the schema. Use a real streaming parser (assets/jina-claude-agent.ts pattern)
in production rather than buffering the whole response.
