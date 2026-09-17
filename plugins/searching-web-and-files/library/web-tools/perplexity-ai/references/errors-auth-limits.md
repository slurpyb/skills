# Auth, tiers, rate limits, errors, cost

## Auth

One key for everything: `Authorization: Bearer pplx-…`. Generate it in the API Portal → **API Keys**
(you must create an API group first). Store as `PERPLEXITY_API_KEY`; never hardcode. The Search API
playground works keyless, but the API itself requires the key.

Auth-token endpoints (`POST /generate_auth_token`, `POST /revoke_auth_token`) mint/revoke short-lived
tokens for delegated access — most apps just use the long-lived `pplx-` key.

## Usage tiers

Tiers are based on **cumulative** credits purchased over the account lifetime (not balance) and never
downgrade. Higher tiers raise rate limits and unlock beta features.

| Tier | Cumulative spend |
| --- | --- |
| 0 | $0 |
| 1 | $50+ |
| 2 | $250+ |
| 3 | $500+ |
| 4 | $1,000+ |
| 5 | $5,000+ |

## Rate limits (per API, leaky-bucket)

**Sonar** — per model, RPM scales with tier (tier 0 → tier 5):

| Model | Tier 0 | Tier 5 |
| --- | --- | --- |
| `sonar`, `sonar-pro`, `sonar-reasoning-pro` | 50 | 4,000 |
| `sonar-deep-research` | 5 | 100 |
| `POST /v1/async/sonar` | 5 | 100 |
| `GET /v1/async/sonar` (list) | 3,000 | 3,000 |
| `GET /v1/async/sonar/{id}` (poll) | 6,000 | 6,000 |

**Agent API** — tier-based QPS / RPM: tier 0 = 1 QPS / 50 min; tier 2 = 8 QPS / 500 min;
tier 4–5 = 33 QPS / 2,000 min.

**Search API** — flat 50 requests/second (50 burst), independent of tier.

**Embeddings** — 85 QPS (tier 0) → 335 QPS (tier 4–5); contextualized embeddings 5× higher and
limited by total **chunks**, not request count.

Honor `429` with backoff. The leaky bucket allows short bursts up to capacity, then sustains the
average rate.

## Error codes

| HTTP | Meaning | Action |
| --- | --- | --- |
| 400 | Bad request (e.g. async with non-`sonar-deep-research` model; both allow+deny domains) | fix the payload |
| 401 | Missing/invalid key | check `PERPLEXITY_API_KEY` |
| 403 | Not allowed (feature/tier gated) | check tier / feature access |
| 429 | Rate limited | back off, retry |
| 5xx | Server error | retry with jitter |

Errors come back as `{ "error": { "message", "type", "code" } }`. With the official SDKs:
`APIConnectionError`, `RateLimitError`, `APIStatusError` (Python) / `Perplexity.APIError`,
`Perplexity.RateLimitError`, `Perplexity.APIConnectionError` (TS) — catch and branch on type.

## Cost

Every Sonar/Agent response carries `usage.cost` in USD:

- Sonar: `usage.cost = { input_tokens_cost, output_tokens_cost, request_cost, total_cost }`.
- Agent: `usage.cost = { input_cost, output_cost, total_cost, currency }`.
- Search API: **per-request** pricing, no token cost — predictable regardless of content pulled.

Pricing is direct first-party provider rates with no markup (Agent API), updated monthly. Watch
`sonar-deep-research` / `deep-research` — minutes and many tokens per call. Read `total_cost` per
response to budget; cap with `max_tokens` / `web_search_options.search_context_size`.
