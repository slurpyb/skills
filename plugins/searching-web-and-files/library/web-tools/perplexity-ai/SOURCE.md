---
name: perplexity-ai
description: |
  Integrates Perplexity's API platform (one `Bearer pplx-` key) into TypeScript/Node and Claude apps
  for web-grounded answers, raw web search, multi-provider agents, and embeddings. Use when a task
  needs: Sonar (POST /chat/completions — grounded chat returning citations + search_results, with
  recency/domain/academic filters, JSON-schema output, streaming; sonar / sonar-pro /
  sonar-reasoning-pro / sonar-deep-research); the Search API (POST /search — ranked results[] with
  snippets, multi-query, domain/language/region filters); the Agent API (POST /v1/agent — access to
  OpenAI/Anthropic/Google/xAI models with web_search, fetch_url, finance/people search, presets,
  fallback); Embeddings for RAG; or async deep research. Also when wiring Perplexity into Claude —
  giving Claude perplexity_search/perplexity_ask tools, or routing the Agent API to anthropic/claude-*
  with built-in search. Triggers: "perplexity", "sonar", pplx api, web-grounded answer with
  citations, perplexity search/agent/embeddings.
---

# Perplexity AI

One API key (`pplx-...`) unlocks four APIs on `https://api.perplexity.ai`. Best fit: getting
*web-grounded, cited* answers or *raw ranked* web results into an LLM app. This skill covers each
API and two ways to combine it with Claude.

## Auth & endpoints

```
Authorization: Bearer pplx-YOUR_KEY     # one key for every API; get it in the API Portal → API Keys
```

| API | Endpoint | Returns |
| --- | --- | --- |
| **Sonar** (grounded chat) | `POST /chat/completions` (OpenAI-compat) · also `POST /v1/sonar` | prose answer + `citations[]` + `search_results[]` |
| **Search** (raw web) | `POST /search` | `{ id, results[] }` — `title,url,snippet,date,last_updated` |
| **Agent** (multi-provider) | `POST /v1/agent` (alias `/v1/responses`) | OpenAI Responses object: `output[]` / `output_text` |
| **Embeddings** | `POST /v1/embeddings` · `POST /v1/contextualizedembeddings` | base64 vectors (`pplx-embed-v1-4b`) |
| **Async Sonar** | `POST /v1/async/sonar` → `GET /v1/async/sonar/{id}` | job submit / poll for long jobs |
| Models | `GET /v1/models` | the live Agent-API model list |

Store the key as `PERPLEXITY_API_KEY`. Sonar & Agent are OpenAI-compatible — point any OpenAI SDK at
`baseURL: https://api.perplexity.ai`. Official SDKs exist (`npm i @perplexity-ai/perplexity_ai`,
`pip install perplexityai`); assets here use zero-dep `fetch` for portability — see the SDK note below.

## Pick the API first (the key decision)

Don't reach for Sonar by reflex — match the API to the job:

| You need | Use | Why |
| --- | --- | --- |
| A cited answer in **one call** | **Sonar** | model + web search + citations bundled |
| **Raw ranked links + page text** you'll synthesize yourself | **Search** | cheaper, deterministic, per-request pricing (no token cost) |
| A **specific frontier model** (GPT-5.x / Claude / Gemini / Grok) with web tools | **Agent** | one endpoint, many providers, direct provider pricing |
| An **exhaustive multi-source report** | Sonar `sonar-deep-research` or Agent `preset:"deep-research"` | follows source chains; minutes-long |
| **RAG over your own docs** | Embeddings + your vector store | `pplx-embed-v1-4b` / contextualized variant |

## Pick the model (surface the choice — don't hardcode)

| Need | Model |
| --- | --- |
| Fast grounded Q&A, cheap | `sonar` |
| Deeper multi-step answers, 2× sources | `sonar-pro` |
| Visible chain-of-thought / complex reasoning | `sonar-reasoning-pro` (or `sonar-reasoning`) |
| Deep, exhaustive research (slow, costly) | `sonar-deep-research` |
| A non-Perplexity frontier model (Agent API) | `anthropic/claude-*`, `openai/gpt-5.x`, `google/gemini-3.x`, `xai/grok-4.x` — live list via `GET /v1/models` |
| Claude side (synthesis/routing) | `claude-haiku-4-5`; escalate to `claude-sonnet-4-6` / `claude-opus-4-8` |

Reasoning models (`sonar-reasoning*`) prepend a `<think>…</think>` block to the answer — strip it
before parsing. Model lists + per-model behavior in references/sonar.md and references/agent-api.md.

## Core pattern: one-call grounded answer

Sonar's whole pitch — model + web search + citations in a single request:

```ts
const H = { Authorization: `Bearer ${process.env.PERPLEXITY_API_KEY}`, 'Content-Type': 'application/json' };

const r = await fetch('https://api.perplexity.ai/chat/completions', {
  method: 'POST', headers: H,
  body: JSON.stringify({
    model: 'sonar',                                  // pick per task — see model table
    messages: [{ role: 'user', content: 'What shipped in the latest Claude model? Cite sources.' }],
    search_recency_filter: 'month',                  // day | week | month | year
    return_related_questions: true,
  }),
}).then((r) => r.json());

const answer = r.choices[0].message.content;         // prose, with inline [1][2] markers
const sources = r.search_results;                    // [{ title, url, date, last_updated }]
const cost = r.usage.cost.total_cost;                // USD, per response
```

When you'd rather control synthesis yourself, use the **Search API** for raw results then hand them
to Claude — see references/search.md and assets/sonar-rag.ts.

## Wire into Claude (two real angles)

1. **Claude calls Perplexity** — give Claude `perplexity_search` (raw results) + `perplexity_ask`
   (cited answer) tools and loop until it answers. Runnable: **assets/perplexity-claude-agent.ts**.
2. **Perplexity routes to Claude** — the Agent API calls `anthropic/claude-*` with `web_search`
   built in, one endpoint, no separate Anthropic key. Runnable: **assets/agent-to-claude.ts**.

When to use which, the full tool-use loop, structured output, and prompt caching →
references/claude-integration.md.

## Gotchas

| Issue | Fix |
| --- | --- |
| Reasoning model output won't `JSON.parse` | `sonar-reasoning*` emit `<think>…</think>` first — strip it (`s.replace(/<think>[\s\S]*?<\/think>/g,'')`) before parsing. |
| Structured-output schema returns nothing useful | Sonar nests the schema under `response_format.json_schema.schema` (NOT directly under `json_schema`). First call with a new schema warms up 10–30s. |
| Want links inside JSON output | Unreliable — read links from `citations` / `search_results`, not from generated JSON. |
| Search vs Sonar confusion | Search → `results[]` array (you synthesize); Sonar → prose answer with citations. Different shapes. |
| `search_domain_filter` ignored | Allowlist (`"example.com"`) OR denylist (`"-reddit.com"`), never both in one request; max 20 domains. |
| Surprise cost on deep research | `sonar-deep-research` / `deep-research` preset run minutes & many tokens. Check `usage.cost`; for long jobs use async Sonar (references/async.md). |
| 429 rate limited | Per-API, tier-based (leaky bucket). Honor it, back off. Tiers in references/errors-auth-limits.md. |
| Empty/blocked SERP | Search returns nothing for some queries — widen `max_results`, drop filters, or fall back to Sonar. |

## Reference map

- **Sonar** (chat: models, filters, structured output, streaming, response shape) → references/sonar.md
- **Search** (raw web: multi-query, domain/language/region filters, token budgets) → references/search.md
- **Agent API** (multi-provider, tools, presets, fallback, OpenAI-compat) → references/agent-api.md
- **Embeddings** (standard + contextualized, base64 decode, RAG) → references/embeddings.md
- **Async Sonar** (submit → poll for long deep-research jobs) → references/async.md
- **Claude integration** (both angles, tool-use loop, structured output, caching) → references/claude-integration.md
- **Cookbooks** (composed end-to-end recipes) → references/cookbooks.md
- **Auth, tiers, rate limits, error codes, cost** → references/errors-auth-limits.md
