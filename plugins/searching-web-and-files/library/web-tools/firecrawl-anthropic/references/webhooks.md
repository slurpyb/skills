# Async jobs & webhooks

Crawl, batch scrape, and extract are **async** — they can run far longer than an HTTP request. Two
ways to get results: poll a job id, or have Firecrawl POST events to your endpoint (webhook). For
anything feeding Claude in the background, webhooks beat polling.

## Table of contents
- [Async job pattern (poll)](#async-job-pattern-poll)
- [Webhook configuration](#webhook-configuration)
- [Event taxonomy](#event-taxonomy)
- [Payload structure](#payload-structure)
- [HMAC signature verification](#hmac-signature-verification-required)
- [Delivery, timeouts & retries](#delivery-timeouts--retries)
- [Wiring webhook results into Claude](#wiring-webhook-results-into-claude)

## Async job pattern (poll)

```ts
const { id } = await firecrawl.startCrawl('https://docs.firecrawl.dev', { limit: 100 });
let status = await firecrawl.getCrawlStatus(id);
while (status.status === 'scraping') {
  await new Promise((r) => setTimeout(r, 2000));
  status = await firecrawl.getCrawlStatus(id);
}
// status.status: 'completed' | 'failed'; status.data = pages
```

Same shape for batch (`startBatchScrape`/`getBatchScrapeStatus`) and extract
(`startExtract`/`getExtractStatus`, states `processing|completed|failed|cancelled`). Job results are
retrievable via API for **24h** after completion.

## Webhook configuration

Attach a `webhook` object to a crawl/batch/extract request. (Webhooks are set in the request
payload; the cURL form is shown because it maps 1:1 to the SDK options object.)

```json
{
  "url": "https://docs.firecrawl.dev",
  "limit": 100,
  "webhook": {
    "url": "https://your-domain.com/webhook/firecrawl",
    "events": ["started", "page", "completed"],
    "headers": { "x-internal-token": "..." },
    "metadata": { "tenantId": "abc" }
  }
}
```

| Field | Type | Required | Description |
| --- | --- | --- | --- |
| `url` | string | yes | Your HTTPS endpoint |
| `events` | array | no | Subset to receive (default: all). Filter values: `started`, `page`, `completed`, `failed` |
| `headers` | object | no | Custom headers Firecrawl includes on each POST |
| `metadata` | object | no | Echoed back in every payload's `metadata` — use for tenant/job correlation |

## Event taxonomy

| Operation | Events |
| --- | --- |
| Crawl | `crawl.started`, `crawl.page`, `crawl.completed` |
| Batch Scrape | `batch_scrape.started`, `batch_scrape.page`, `batch_scrape.completed` |
| Extract | `extract.started`, `extract.completed`, `extract.failed` |
| Agent | `agent.started`, `agent.action`, `agent.completed`, `agent.failed`, `agent.cancelled` |
| Monitor | `monitor.page`, `monitor.check.completed` |

The `.page` events carry content incrementally (one page per event); `.completed` signals the job is
done (its `data` is typically empty — fetch full results via the status API, or accumulate `.page`
events as they arrive).

## Payload structure

Every event shares this envelope:

```json
{
  "success": true,
  "type": "crawl.page",
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "data": [ { "markdown": "# Page...", "metadata": { "url": "https://example.com/page", "statusCode": 200 } } ],
  "metadata": { "tenantId": "abc" },
  "error": "present only when success is false"
}
```

| Field | Description |
| --- | --- |
| `success` | `false` on failure events; check before processing |
| `type` | event name (e.g. `crawl.page`) |
| `id` | job id (correlate with the `startCrawl`/`startExtract` return) |
| `data` | array (page events) or object (extract/agent) — event-specific |
| `metadata` | your custom metadata echoed back |
| `error` | failure reason when `success` is `false` |

`extract.completed.data[]` includes `{ data, llmUsage, totalUrlsScraped, sources }`.
`agent.action.data[].creditsUsed` is an **estimate**; the accurate total is only in the terminal
`completed`/`failed`/`cancelled` event.

## HMAC signature verification (required)

Firecrawl signs every webhook with HMAC-SHA256 in the `X-Firecrawl-Signature: sha256=<hex>` header.
**Verify it before trusting the payload** — otherwise anyone who learns your URL can spoof jobs.
The secret is in your account settings → Advanced tab; store it as `FIRECRAWL_WEBHOOK_SECRET`.

Verification steps:
1. Read the `X-Firecrawl-Signature` header; split on `=` → expect algorithm `sha256`.
2. Compute HMAC-SHA256 over the **raw request body** (before JSON parsing) with your secret.
3. Compare with `crypto.timingSafeEqual` (never `===` — timing leak).
4. Reject missing/invalid signatures with `401`.

```ts
import crypto from 'crypto';

function verify(rawBody: Buffer, header: string | undefined, secret: string): boolean {
  if (!header) return false;
  const [algo, hash] = header.split('=');
  if (algo !== 'sha256' || !hash) return false;
  const expected = crypto.createHmac('sha256', secret).update(rawBody).digest('hex');
  const a = Buffer.from(hash, 'hex');
  const b = Buffer.from(expected, 'hex');
  return a.length === b.length && crypto.timingSafeEqual(a, b);
}
```

In Express you **must** capture the raw body for the webhook route, since signing is over raw bytes:
`app.use('/webhook/firecrawl', express.raw({ type: 'application/json' }))`. Full server in
`assets/webhook-server.ts`.

## Delivery, timeouts & retries

- Your endpoint must return a **2xx within 10 seconds**. Do heavy work (Claude calls, DB writes)
  **after** responding — enqueue and ack fast, or you'll trip the timeout.
- On timeout / non-2xx / network error, Firecrawl retries: **1 min → 5 min → 15 min**, then marks
  the webhook failed (no further attempts).
- Make handlers **idempotent** — retries and at-least-once delivery mean you may see an event twice.
  Dedupe on `id` + `type` (+ page url for `.page`).

## Wiring webhook results into Claude

Pattern: respond `200` immediately, push the event onto a queue, and a worker runs the Claude step.

```ts
// inside the verified webhook handler, AFTER res.status(200).send('ok'):
if (event.type === 'crawl.page') {
  for (const page of event.data) await queue.add('analyze', { jobId: event.id, markdown: page.markdown });
}
// worker: Claude summarizes/extracts each page, writes results keyed by event.id
```

This keeps you under the 10s budget and lets long Claude analysis run independently of delivery.
