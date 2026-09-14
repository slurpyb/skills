# Agent API (multi-provider, OpenAI-Responses style)

`POST https://api.perplexity.ai/v1/agent` (alias `POST /v1/responses` for OpenAI SDK routing). One
endpoint, every frontier model (OpenAI / Anthropic / Google / xAI / NVIDIA / Perplexity Sonar), with
Perplexity's web tools built in and per-request `usage.cost`. Shape mirrors OpenAI's **Responses**
API (`input` / `output` / `output_text`), not Chat Completions.

## Table of contents
- [Basic request](#basic-request)
- [Models & fallback](#models--fallback)
- [Presets](#presets)
- [Tools](#tools)
- [Response shape & output_text](#response-shape--output_text)
- [Structured output](#structured-output)
- [Streaming](#streaming)
- [Background mode](#background-mode)
- [OpenAI SDK compatibility](#openai-sdk-compatibility)

## Basic request

```ts
const H = { Authorization: `Bearer ${process.env.PERPLEXITY_API_KEY}`, 'Content-Type': 'application/json' };

const r = await fetch('https://api.perplexity.ai/v1/agent', {
  method: 'POST', headers: H,
  body: JSON.stringify({
    model: 'anthropic/claude-sonnet-4-6',          // any id from GET /v1/models
    input: 'Explain supervised vs unsupervised learning.',
    instructions: 'Be concise.',                    // optional system-style guidance
  }),
}).then((r) => r.json());

console.log(r.output_text);                          // aggregated assistant text
console.log(r.usage.cost.total_cost);               // USD
```

`input` accepts a plain string or an OpenAI Responses message array (for multi-part / image content,
see references/embeddings.md cross-links and the media docs).

## Models & fallback

Models are namespaced `provider/model`. Fetch the live list with `GET /v1/models` (26 at last check),
including `anthropic/claude-opus-4-8`, `anthropic/claude-sonnet-4-6`, `anthropic/claude-haiku-4-5`,
`openai/gpt-5.5`, `openai/gpt-5-mini`, `google/gemini-3.1-pro-preview`, `xai/grok-4.3`,
`perplexity/sonar`. Pricing is direct provider rates, no markup; every response reports exact tokens
+ cost.

**Fallback** — pass `models` (array, max 5) instead of `model`; tried in order until one succeeds:

```ts
body: JSON.stringify({
  models: ['openai/gpt-5.5', 'anthropic/claude-sonnet-4-6', 'google/gemini-3.1-flash-lite'],
  input: 'What is the capital of France?',
})
```

Don't hardcode a model silently — surface the choice (capability vs cost vs latency). `response.model`
tells you which one actually answered.

## Presets

Presets bundle a tuned model + tools + config for a use case — pass `preset` instead of `model`/`tools`:

| Preset | For |
| --- | --- |
| `fast-search` | quick web-grounded answers, low latency |
| `pro-search` | multi-step search with reasoning, real-time thoughts |
| `deep-research` | exhaustive multi-source reports (minutes-long; auto-selects model + tools) |

```ts
body: JSON.stringify({ preset: 'deep-research', input: 'State of solid-state battery tech: companies, challenges, timeline.' })
```

## Tools

Add tools to the `tools` array; the model decides when to call them.

| Tool `type` | Does |
| --- | --- |
| `web_search` | live web search; config `search_context_size: low\|medium\|high` (→ token budgets), or explicit `max_tokens` + `max_tokens_per_page`, plus `filters: { search_domain_filter, search_recency_filter }` |
| `fetch_url_content` | fetch + extract a specific URL the model names |
| `finance_search` | structured finance/markets data (tickers, filings) |
| `people_search` | find people / professional profiles |
| `sandbox` | run code in an isolated sandbox (compute, data work); pairs with `background: true` for long runs |

```ts
body: JSON.stringify({
  model: 'openai/gpt-5.5',
  input: 'Find recent .gov guidance on AI procurement.',
  tools: [{
    type: 'web_search',
    max_tokens: 6000, max_tokens_per_page: 1200,
    filters: { search_domain_filter: ['.gov'], search_recency_filter: 'month' },
  }],
  instructions: 'Search for current, source-grounded info before answering.',
})
```

`search_context_size` named sizes map to recommended `max_tokens`/`max_tokens_per_page` pairs
(low≈300, medium≈1,000, high≈4,000) and resolve to current defaults. Explicit budgets override the
named size and you're billed for tokens actually consumed.

## Response shape & output_text

```jsonc
{
  "id": "resp_…", "object": "response", "status": "completed",
  "model": "perplexity/sonar",
  "output": [
    { "type": "search_results", "results": [ … ] },          // tool output blocks appear here
    { "type": "message", "role": "assistant", "status": "completed",
      "content": [{ "type": "output_text", "text": "…", "annotations": [], "logprobs": [] }] }
  ],
  "usage": {
    "input_tokens": 20, "output_tokens": 222, "total_tokens": 242,
    "input_tokens_details": { "cached_tokens": 0 },
    "cost": { "input_cost": 0.00004, "output_cost": 0.00311, "total_cost": 0.00315, "currency": "USD" }
  }
}
```

`output` is an ordered list of typed blocks (tool calls/results + the final `message`). The SDKs
expose `response.output_text` to aggregate all text — replicate it by concatenating
`output[].content[]` where `type === "output_text"`.

## Structured output

`response_format` with a named JSON schema (schema under `json_schema.schema`):

```ts
response_format: {
  type: 'json_schema',
  json_schema: {
    name: 'financial_metrics',
    schema: { type: 'object',
      properties: { company: { type: 'string' }, revenue: { type: 'number' } },
      required: ['company', 'revenue'] },
  },
}
```

## Streaming

`stream: true` emits typed Responses events — handle by `event.type`:

- `response.output_text.delta` → `event.delta` is the next text chunk
- `response.completed` → `event.response.usage` final metadata

Parse the SSE `data:` lines and dispatch on `type` (see references/sonar.md for the SSE loop shape).

## Background mode

For long tools (`sandbox`, `deep-research`), set `background: true`, then poll the returned response
`id` until `status` leaves `queued`/`in_progress`. For long *Sonar* jobs use the dedicated async
endpoints instead — references/async.md.

## OpenAI SDK compatibility

`/v1/responses` is an alias, so the OpenAI SDK's `client.responses.create()` works against
`baseURL: https://api.perplexity.ai` unchanged. The native SDK uses `client.responses.create({ model
| models | preset, input, tools, instructions, stream })`.
