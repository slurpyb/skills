# Async Sonar (long deep-research jobs)

`sonar-deep-research` can run for minutes — too long to hold a synchronous HTTP connection open.
The async endpoints submit a job, return immediately, and let you poll for the result.

**Async is `sonar-deep-research` only.** Submitting any other model (`sonar`, `sonar-pro`, …) returns
`400 invalid_model: "Async processing is only available for sonar-deep-research"` (verified live). For
all other models just call `/chat/completions` synchronously.

| Step | Endpoint | RPM (tier 0) |
| --- | --- | --- |
| Submit | `POST /v1/async/sonar` | 5 |
| Poll one | `GET /v1/async/sonar/{request_id}` | 6000 |
| List all | `GET /v1/async/sonar` | 3000 |

## Submit

The chat-completion payload is wrapped in a `request` object (verified live):

```ts
const H = { Authorization: `Bearer ${process.env.PERPLEXITY_API_KEY}`, 'Content-Type': 'application/json' };

const job = await fetch('https://api.perplexity.ai/v1/async/sonar', {
  method: 'POST', headers: H,
  body: JSON.stringify({
    request: {
      model: 'sonar-deep-research',
      messages: [{ role: 'user', content: 'Comprehensive analysis of nuclear fusion progress, last 2 years.' }],
      // any Sonar params (search_recency_filter, response_format, …) go inside `request`
    },
  }),
}).then((r) => r.json());

const id = job.id;            // submit returns: id, model, created_at, status
```

## Poll

Poll `GET /v1/async/sonar/{id}` until `status` is terminal. The finished chat completion lands under
`response` (same shape as a synchronous Sonar reply — `choices`, `citations`, `search_results`, `usage`).

```ts
async function awaitJob(id: string): Promise<any> {
  for (;;) {
    const j = await fetch(`https://api.perplexity.ai/v1/async/sonar/${id}`, { headers: H }).then((r) => r.json());
    if (j.status === 'COMPLETED') return j.response;
    if (j.status === 'FAILED') throw new Error(`async job failed: ${JSON.stringify(j.error ?? j)}`);
    await new Promise((r) => setTimeout(r, 5000));   // status climbs CREATED → PROCESSING → COMPLETED
  }
}
```

Use a sane ceiling (deep research can take several minutes) and back off — don't tight-loop. Poll RPM
is high (6000), but 5s intervals are plenty.

## List

`GET /v1/async/sonar` returns your recent async requests (id, status, model, timestamps) — useful for
dashboards or resuming after a restart instead of holding the id in memory.

## When to prefer this

- Batch deep-research over many topics — submit all, poll concurrently, collect as they finish.
- Serverless / request-timeout-bound environments where a multi-minute sync call would die.
- Anything user-facing where you'd rather show "researching…" and fetch later.

For a single, interactive deep answer where a long wait is acceptable, the Agent API
`preset: "deep-research"` (references/agent-api.md) is simpler — one synchronous call, no polling.
