---
name: jina-ai
description: |
  Use Jina AI's search-foundation APIs (one `Authorization: Bearer jina_` key) for web data + RAG,
  and wire them into Claude/Anthropic apps (TypeScript/Node). Covers: Search (s.jina.ai — web/news/
  image SERPs with page content, site/gl/hl/num operators), Reader (r.jina.ai — URL→LLM-ready
  markdown, JS render, CSS selectors, LLM extraction), Reranker, Embeddings (multilingual/multimodal,
  task-tuned), Classifier (zero/few-shot + train), Segmenter, DeepSearch (agentic, OpenAI-compatible),
  async Batch embeddings + webhooks, and grounding / fact-checking (verify a claim against the web
  with sourced quotes, via DeepSearch). Plus Claude tool-use agents and search→read→rerank→answer
  RAG pipelines. Triggers: "jina", "r.jina.ai / s.jina.ai", jina embeddings/reranker, URL→markdown
  for an LLM, web search for RAG, rerank results, fact-check / ground a statement, wire Jina into Claude.
---

# Jina AI

One API key (`jina_...`) unlocks every Jina service across several hosts. Best fit: turning the web
into LLM-ready data and powering RAG. This skill covers each API and how to wire them into Claude.

## Auth & hosts

Every endpoint takes the same header:

```
Authorization: Bearer jina_YOUR_KEY     # get one at jina.ai/api-dashboard/key-manager (10M free tokens)
```

| Service | Host | Style |
| --- | --- | --- |
| Reader | `r.jina.ai` | `GET https://r.jina.ai/<URL>` or `POST https://r.jina.ai/` `{url}` |
| Search | `s.jina.ai` | `GET https://s.jina.ai/?q=<query>` or `POST https://s.jina.ai/` `{q}` (key required) |
| Embeddings / Rerank / Classify / Segment / Batch | `api.jina.ai/v1/*` | `POST` JSON |
| DeepSearch | `deepsearch.jina.ai/v1/chat/completions` | `POST` JSON (OpenAI-compatible) |

Store the key as `JINA_API_KEY`. Reader/Search have a keyless free tier with lower limits, but pass
the key for production rate limits.

**The two request styles for Reader/Search:** prefix-URL `GET` (quick, options go in `X-*` headers)
or `POST` JSON (options as camelCase body fields). **Rule: any body field `fooBar` ⇄ header
`X-Foo-Bar`.** e.g. `respondWith` ⇄ `X-Respond-With`, `targetSelector` ⇄ `X-Target-Selector`,
`noCache` ⇄ `X-No-Cache`. Use POST when a URL/query contains characters that break a prefixed URL.

## Pick the model first

Endpoints take a `model` param — don't default silently. Confirm the choice with the user/task:

| Need | Model |
| --- | --- |
| Text embeddings, multilingual, cheap | `jina-embeddings-v5-text-small` (1024-dim) / `-nano` (768-dim) |
| Multimodal embeddings (text+image+pdf) | `jina-embeddings-v5-omni-small` / `jina-clip-v2` / `jina-embeddings-v4` |
| Rerank (best) | `jina-reranker-v3` (listwise, 131K ctx) |
| Rerank multimodal / multilingual | `jina-reranker-m0` / `jina-reranker-v2-base-multilingual` |
| Agentic deep research | `jina-deepsearch-v1` |
| Claude side (summarize/route) | `claude-haiku-4-5`; escalate synthesis to `claude-sonnet-4-6` |

Full lists + dims/context in references/embeddings.md and references/rerank.md. Live list: `GET /v1/models`.

## The core pipeline: search → read → rerank → answer

The RAG flow this project (SERP work) revolves around. Minimal shape:

```ts
const H = { Authorization: `Bearer ${process.env.JINA_API_KEY}`, 'Content-Type': 'application/json' };

// 1. SEARCH the web (returns top results WITH page content already read)
const sr = await fetch('https://s.jina.ai/', {
  method: 'POST', headers: { ...H, 'X-Respond-With': 'no-content' }, // metadata-only is cheaper; omit to get content
  body: JSON.stringify({ q: 'jina reranker v3 release', num: 8, gl: 'US', hl: 'en' }),
}).then((r) => r.json());

// 2. READ specific URLs to clean markdown (when you need full content)
const doc = await fetch(`https://r.jina.ai/${sr.data[0].url}`, {
  headers: { ...H, 'X-Respond-With': 'content', Accept: 'application/json' },
}).then((r) => r.json());

// 3. RERANK passages against the query, keep the best
const rr = await fetch('https://api.jina.ai/v1/rerank', {
  method: 'POST', headers: H,
  body: JSON.stringify({ model: 'jina-reranker-v3', query: 'jina reranker v3 release',
    documents: sr.data.map((d: any) => d.content ?? d.description), top_n: 3 }),
}).then((r) => r.json());
// rr.results: [{ index, relevance_score, document }]  → feed top docs to Claude (references/claude-integration.md)
```

Both `s.jina.ai` and `r.jina.ai` accept the same `CrawlerOptions` (selectors, JS-render wait, image/
link summaries, LLM extraction). Search-only knobs (`site`, `type`, `gl/hl`, `num`, `page`) →
references/search.md. Reader knobs (`respondWith`, selectors, `instruction`+`jsonSchema`) →
references/reader.md.

## Wire into Claude (tool use)

Give Claude `search_web` + `read_url` tools and loop until it answers. Full runnable agent in
**assets/jina-claude-agent.ts**; full RAG pipeline in **assets/rag-pipeline.ts**. Loop anatomy,
structured output, and prompt-caching of read pages → references/claude-integration.md.

## Gotchas

| Issue | Fix |
| --- | --- |
| Reader returns markdown text, not JSON | Send `Accept: application/json` to get `{code,status,data:{title,content,links,...}}`; default body is raw markdown. |
| JS-heavy page returns empty/partial | `X-Wait-For-Selector` / `X-Timeout`, or `X-Respond-With: readerlm-v2` (HTML→MD via SLM); `X-Engine` to switch fetch engine. |
| Read pages are huge → context/cost blow-up | Cap with `X-Token-Budget` / `X-Max-Tokens`, segment (references/other-endpoints.md), or rerank then keep top_n. Prompt-cache the page on the Claude side. |
| `s.jina.ai` 401/empty | Search needs the API key (keyless disabled). Set `Authorization`. |
| Paying to re-read unchanged pages | Caching is on by default; use `X-No-Cache: true` only to force-refresh, `X-Cache-Tolerance` to bound age. |
| Pulled fields from a page by hand | Use Reader `instruction` + `jsonSchema` to extract structured JSON in one call (references/reader.md). |
| Slow/blocked sites | `X-Proxy: auto` or `X-Proxy-Url`, `X-Set-Cookies` for auth'd pages. |
| Rate limited (429) | Honor `X-RateLimit-Remaining-*` headers; back off. Tiers in references/errors-auth-limits.md. |

## Reference map

- **Search** (s.jina.ai: q, type, gl/hl, site, num/page, engines) → references/search.md
- **Reader** (r.jina.ai: respondWith, selectors, JS render, LLM extraction, headers) → references/reader.md
- **Reranker** (/v1/rerank models + params) → references/rerank.md
- **Embeddings** (/v1/embeddings: tasks, dims, multimodal, late chunking) → references/embeddings.md
- **DeepSearch + grounding/fact-checking** (agentic, OpenAI-compatible; verify claims with sources) → references/deepsearch.md
- **Classify / Segment / Models** → references/other-endpoints.md
- **Batch embeddings** (async + webhook) → references/batch.md
- **Claude integration** (tool use, RAG, structured output, caching) → references/claude-integration.md
- **Cookbooks** (composed end-to-end recipes) → references/cookbooks.md
- **Auth, rate limits, error codes** → references/errors-auth-limits.md
