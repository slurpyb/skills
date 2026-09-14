# Search API (raw ranked web results)

`POST https://api.perplexity.ai/search` — ranked web results with extracted page content. Unlike
Sonar, this returns a structured `results[]` array (no LLM synthesis). Use it when you want to
control synthesis yourself (feed results to Claude) or just need links + snippets.

## Table of contents
- [Request parameters](#request-parameters)
- [Response shape](#response-shape)
- [Multi-query](#multi-query)
- [Filters](#filters)
- [Content / token budgets](#content--token-budgets)
- [Pricing note](#pricing-note)

## Request parameters

| Param | Type | Notes |
| --- | --- | --- |
| `query` | string \| string[] | one query, or up to **5** for multi-query batch |
| `max_results` | int | 1–20, default 10 |
| `country` | string | ISO 3166-1 alpha-2 (`"US"`, `"GB"`, `"DE"`) — region-biased results |
| `search_domain_filter` | string[] | allowlist (`"science.org"`) OR denylist (`"-reddit.com"`); max 20; not both |
| `search_language_filter` | string[] | ISO 639-1 codes (`"en"`, `"fr"`); max 10 |
| `search_recency_filter` | string | `day` \| `week` \| `month` \| `year` |
| `search_context_size` | string | `low` \| `medium` \| `high` (default `high`) — how much page text per result |
| `max_tokens` | int | total page-content budget across all results (up to 1,000,000) |
| `max_tokens_per_page` | int | per-result content cap |

`search_context_size` and explicit token budgets are mutually exclusive in one request. If you set
only one of `max_tokens` / `max_tokens_per_page`, the other falls back to the default size.

```ts
const r = await fetch('https://api.perplexity.ai/search', {
  method: 'POST',
  headers: { Authorization: `Bearer ${process.env.PERPLEXITY_API_KEY}`, 'Content-Type': 'application/json' },
  body: JSON.stringify({
    query: 'anthropic claude opus release notes',
    max_results: 5,
    search_domain_filter: ['anthropic.com'],
    search_recency_filter: 'month',
    max_tokens_per_page: 1024,
  }),
}).then((r) => r.json());
```

## Response shape

Verified live:

```jsonc
{
  "id": "e38104d5-…",
  "results": [
    {
      "title": "Claude Opus 4.8",
      "url": "https://www.anthropic.com/claude/opus",
      "snippet": "Claude Opus 4.8 … Stronger across coding, agentic tasks…",  // length scales with context size / budget
      "date": "2026-05-28",            // published date (may be null)
      "last_updated": "2026-06-02"     // last-modified (may be null)
    }
  ]
}
```

`snippet` is extracted page content, not a one-liner — its length tracks `search_context_size` /
token budgets. For a single query `results` is flat; for multi-query it's grouped per query in input
order.

## Multi-query

Pass an array (≤5) to research several angles in one request:

```ts
body: JSON.stringify({
  query: ['quantum error correction 2025', 'topological qubits progress', 'fault tolerant timeline'],
  max_results: 5,
})
```

## Filters

- **Domain** — allowlist by bare domain, denylist by `-` prefix; never mix modes; ≤20 entries. Use a
  TLD directly (`".gov"`); wildcards are not supported. An empty array is undefined behavior — omit
  the param to search all domains.
- **Language** — ISO 639-1 two-letter codes, ≤10.
- **Region** — `country` with an ISO alpha-2 code; useful for local news/regulations.
- **Recency** — `search_recency_filter` for relative windows.

## Content / token budgets

`search_context_size: "low"` for cheap previews / minimal downstream tokens; `"high"` (default) for
source-heavy work. For exact control, use `max_tokens` (total) + `max_tokens_per_page` (per result)
instead — keep these tight to protect your LLM's context window.

## Pricing note

The Search API charges **per request**, with no token-based pricing — predictable cost regardless of
how much content you pull. (Sonar and Agent charge by tokens; see references/errors-auth-limits.md.)
That makes Search the cheap, deterministic choice when you'll synthesize with your own model.
