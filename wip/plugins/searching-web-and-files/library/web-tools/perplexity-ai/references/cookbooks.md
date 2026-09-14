# Cookbooks

Composed Perplexity + Claude recipes. Assume
`const PH = { Authorization: \`Bearer ${process.env.PERPLEXITY_API_KEY}\`, 'Content-Type': 'application/json' }`,
an `anthropic` client, and `const MODEL = 'claude-haiku-4-5'`. See claude-integration.md for the loop
and the per-API references for options.

## Table of contents
- [1. Research agent (Claude drives Perplexity)](#1-research-agent)
- [2. SERP → cited answer (you drive)](#2-serp--cited-answer)
- [3. One-call grounded answer (Sonar)](#3-one-call-grounded-answer)
- [4. Deep research report](#4-deep-research-report)
- [5. Structured extraction over search results](#5-structured-extraction-over-search-results)
- [6. Fact-check a claim](#6-fact-check-a-claim)
- [7. Multi-model bake-off (Agent API)](#7-multi-model-bake-off)
- [8. RAG over your own corpus (embeddings)](#8-rag-over-your-own-corpus)

## 1. Research agent

Let Claude decide when to search vs ask. Full runnable: assets/perplexity-claude-agent.ts. Use when
the question is open-ended and the right sources aren't known up front. Pattern = tool-use loop with
`perplexity_search` + `perplexity_ask` (claude-integration.md).

## 2. SERP → cited answer

Deterministic RAG, best precision per token. Full runnable: assets/sonar-rag.ts. Steps:
1. `POST /search`, `max_results: 8`, optional domain/recency filters (cheap, per-request pricing).
2. Build a numbered context block from `results[].snippet` (cap with `max_tokens_per_page`).
3. One Claude call: "answer using ONLY the sources, cite urls with [n]".

## 3. One-call grounded answer

When you don't need to control synthesis, Sonar does it in a single call:

```ts
const r = await fetch('https://api.perplexity.ai/chat/completions', { method: 'POST', headers: PH,
  body: JSON.stringify({ model: 'sonar-pro', search_recency_filter: 'week',
    messages: [{ role: 'user', content: 'What changed in EU AI Act enforcement this week? Cite.' }] }) }).then((r) => r.json());
console.log(r.choices[0].message.content, r.search_results);
```

## 4. Deep research report

For exhaustive multi-source reports, use the Agent `deep-research` preset (sync) or async Sonar (batch):

```ts
const r = await fetch('https://api.perplexity.ai/v1/agent', { method: 'POST', headers: PH,
  body: JSON.stringify({ preset: 'deep-research',
    input: 'State of solid-state batteries: companies, technical blockers, EV mass-production timeline.' }) }).then((r) => r.json());
console.log(r.output_text);   // minutes-long; check r.usage.cost. For many topics, batch via async.md
```

## 5. Structured extraction over search results

Search, then extract the same schema from each hit with forced tool use (claude-integration.md):

```ts
const schema = { type: 'object', properties: { company: { type: 'string' }, pricing: { type: 'string' } }, required: ['company'] };
const hits = await fetch('https://api.perplexity.ai/search', { method: 'POST', headers: PH,
  body: JSON.stringify({ query: 'vector database pricing', max_results: 8 }) }).then((r) => r.json());

const rows = [];
for (const h of hits.results) {
  const res = await anthropic.messages.create({ model: MODEL, max_tokens: 400,
    tools: [{ name: 'record', description: 'Record fields', input_schema: schema }],
    tool_choice: { type: 'tool', name: 'record' },
    messages: [{ role: 'user', content: `Extract from:\n${h.title}\n${h.snippet}` }] });
  const call = res.content.find((b) => b.type === 'tool_use');
  if (call?.type === 'tool_use') rows.push({ url: h.url, ...(call as any).input });
}
```

Prefer Sonar's `response_format` (sonar.md) when one grounded call can answer the whole thing instead
of per-row extraction.

## 6. Fact-check a claim

Sonar with `search_mode: 'academic'` (or domain-filtered) + structured output gives a verdict with
sources. Send only checkable facts.

```ts
async function factCheck(statement: string) {
  const r = await fetch('https://api.perplexity.ai/chat/completions', { method: 'POST', headers: PH,
    body: JSON.stringify({ model: 'sonar', search_mode: 'academic',
      messages: [{ role: 'user', content: `Fact-check: ${statement}. Verify against sources.` }],
      response_format: { type: 'json_schema', json_schema: { schema: {   // schema nested under .schema
        type: 'object',
        properties: { verdict: { type: 'string', enum: ['true', 'false', 'unknown'] }, explanation: { type: 'string' } },
        required: ['verdict', 'explanation'] } } } }) }).then((r) => r.json());
  return { ...JSON.parse(r.choices[0].message.content), sources: r.search_results };
}
// factCheck('The Eiffel Tower is in Berlin.') → { verdict:'false', explanation:'…Paris…', sources:[…] }
```

## 7. Multi-model bake-off

Compare frontier models on the same prompt with identical code via the Agent API:

```ts
const models = ['anthropic/claude-sonnet-4-6', 'openai/gpt-5.5', 'google/gemini-3.1-pro-preview', 'perplexity/sonar'];
const out = await Promise.all(models.map(async (model) => {
  const r = await fetch('https://api.perplexity.ai/v1/agent', { method: 'POST', headers: PH,
    body: JSON.stringify({ model, input: prompt, tools: [{ type: 'web_search', search_context_size: 'low' }] }) }).then((r) => r.json());
  return { model, answer: r.output_text, cost: r.usage?.cost?.total_cost };
}));
```

## 8. RAG over your own corpus

Embed your documents, retrieve top-k, then ground a Claude (or Agent) answer. Embeddings return
base64 int8 — decode first (embeddings.md):
1. Chunk + `POST /v1/embeddings` (`pplx-embed-v1-4b`) → store vector ↔ text.
2. Embed the question, cosine-rank, take top-k.
3. Pass retrieved chunks to Claude with a "cite the provided context" instruction.

Use contextualized embeddings (`pplx-embed-context-v1-4b`) for long multi-chunk documents; batch large
corpora and mind the chunk-based rate limits.
