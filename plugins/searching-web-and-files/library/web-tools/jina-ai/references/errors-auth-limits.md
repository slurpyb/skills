# Auth, rate limits & error codes

Shared operational reference for every Jina endpoint.

## Authentication

One key works across all services (Reader, Search, Embeddings, Reranker, Classifier, Segmenter,
DeepSearch, Batch):

```
Authorization: Bearer jina_YOUR_KEY
```

- Get/manage keys: jina.ai/api-dashboard/key-manager. New accounts get **10M free tokens**.
- Store as `JINA_API_KEY`; never hardcode.
- Reader (`r.jina.ai`) and Segmenter have a keyless free tier (lower limits); **Search (`s.jina.ai`)
  requires the key**.
- Billing is token-based and shared across products; one balance funds everything.

## Rate limits (by tier)

| Tier | RPM | TPM | Concurrency |
| --- | --- | --- | --- |
| Free | 500 | 1M | 5 |
| Tier 1 | 500 | 10M | 50 |
| Tier 2 | 5,000 | 100M | 500 |

Responses include `X-RateLimit-Remaining-Requests` and `X-RateLimit-Remaining-Tokens` — read them and
back off before you hit `429`. Reader/Search keyed vs keyless limits differ; per-endpoint limits are
listed on each product's page.

## Error codes

All endpoints can return these (endpoint-specific errors are documented per operation):

| Code | HTTP | Meaning |
| --- | --- | --- |
| `INPUT_MODEL_NOT_FOUND` | 400 | Model not found — check the `model` value / `GET /v1/models` |
| `INPUT_INVALID_LABELS` | 400 | Invalid training labels (classify) |
| `INPUT_LABEL_LIMIT_EXCEEDED` | 400 | Too many labels for your plan |
| `INPUT_TOKEN_LIMIT_EXCEEDED` | 400 | Input exceeds the model's max tokens — truncate/segment |
| `AUTH_MISSING_API_KEY` | 401 | No key sent |
| `AUTH_INVALID_API_KEY` | 401 | Bad key |
| `AUTH_INVALID_FORMAT` | 401 | Malformed `Authorization` header (must be `Bearer jina_...`) |
| `AUTHZ_INSUFFICIENT_BALANCE` | 403 | Out of tokens/credit |
| `AUTHZ_RESOURCE_LIMIT_EXCEEDED` | 403 | Plan resource limit hit |
| `RESOURCE_NOT_FOUND` | 404 | Resource missing or access denied |
| `CONFLICT_RESOURCE_BUSY` | 409 | Resource is being modified |
| `RATE_REQUEST_LIMIT_EXCEEDED` | 429 | RPM exceeded |
| `RATE_TOKEN_LIMIT_EXCEEDED` | 429 | TPM exceeded |
| `RATE_CONCURRENCY_LIMIT_EXCEEDED` | 429 | Too many concurrent requests |
| `RATE_IP_LIMIT_EXCEEDED` | 429 | Per-IP limit (often keyless) — add a key |
| `INTERNAL_ERROR` | 500 | Server error — retry with backoff |
| `SERVICE_UNAVAILABLE` | 503 | Temporary — retry with backoff |
| `SERVICE_TIMEOUT` | 504 | Request timed out — lower `X-Timeout`/scope, retry |

## Handling guidance

- **401 family** → fix the header/key before retrying (no backoff helps).
- **403 balance** → top up; retrying won't help.
- **429** → exponential backoff; honor `X-RateLimit-Remaining-*`; raise concurrency only within tier.
- **500/503/504** → retry with jittered backoff; for Reader, also try a higher `X-Timeout` or
  `X-Engine` switch / `X-Respond-With: readerlm-v2`.
- **400 token limit** → segment (other-endpoints.md) or set `truncate`/`X-Token-Budget`.

Wrap every call in try/catch and surface the `code` — it tells you whether to retry, fix input, or
re-auth.
