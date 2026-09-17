# Batch Embeddings (async)

Embed large corpora asynchronously — up to 50,000 inputs via a GCS file URL, or up to 10,000 inline.
Submit a job, poll until done, download JSONL. Cheaper/higher-throughput than looping `/v1/embeddings`.

## Table of contents
- [Workflow](#workflow)
- [Submit](#submit)
- [Poll status](#poll-status)
- [Download output / errors](#download-output--errors)
- [Webhook notification](#webhook-notification)
- [Manage jobs](#manage-jobs)

## Workflow

1. `POST /v1/batch/embeddings` → returns `batch_id`.
2. `GET /v1/batch/{batch_id}` → poll until `status: completed`.
3. `GET /v1/batch/{batch_id}/output` → download results as JSONL.

Supported models: `jina-embeddings-v5-text-small` (1024-dim, 32K) and `-nano` (768-dim, 8K). All task
types. **Output files expire after 24 hours** — download promptly.

## Submit

OpenAI-compatible JSONL: each line has a `custom_id` and a `body.input`.

```ts
const H = { Authorization: `Bearer ${process.env.JINA_API_KEY}`, 'Content-Type': 'application/json' };

const job = await fetch('https://api.jina.ai/v1/batch/embeddings', {
  method: 'POST', headers: H,
  body: JSON.stringify({
    model: 'jina-embeddings-v5-text-small',
    task: 'retrieval.passage',
    // inline (≤10k):
    input: [
      { custom_id: 'doc-1', body: { input: 'First passage' } },
      { custom_id: 'doc-2', body: { input: 'Second passage' } },
    ],
    // OR for ≤50k, host a JSONL file and pass its URL instead of `input`:
    // input_file_url: 'gs://your-bucket/inputs.jsonl',
    // webhook: { url: 'https://your-domain.com/webhook/jina' },
  }),
}).then((r) => r.json()); // → { batch_id, status: 'validating'|'in_progress', ... }
```

## Poll status

```ts
const s = await fetch(`https://api.jina.ai/v1/batch/${job.batch_id}`, { headers: H }).then((r) => r.json());
// s.status: validating | in_progress | completed | failed | cancelled ; s.stats: counts
```

## Download output / errors

```ts
const out = await fetch(`https://api.jina.ai/v1/batch/${job.batch_id}/output`, { headers: H }).then((r) => r.text());
for (const line of out.trim().split('\n')) {
  const row = JSON.parse(line); // { custom_id, response: { body: { data: [{ embedding }] } } }
}
// failures, if any:
await fetch(`https://api.jina.ai/v1/batch/${job.batch_id}/errors`, { headers: H });
```

Match results back to inputs by `custom_id` — output order is not guaranteed.

## Webhook notification

Pass `webhook: { url }` in the submit body to be POSTed when the job finishes instead of polling.
Respond `2xx` fast and process out of band; verify the request if Jina provides a signing secret for
your account. (For the Claude side of "job done → analyze", enqueue and let a worker call Claude —
see references/claude-integration.md.)

## Manage jobs

```ts
await fetch('https://api.jina.ai/v1/batches', { headers: H });                       // list
await fetch(`https://api.jina.ai/v1/batch/${id}`, { method: 'DELETE', headers: H }); // cancel
```
