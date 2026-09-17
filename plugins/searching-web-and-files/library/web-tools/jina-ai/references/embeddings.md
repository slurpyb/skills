# Embeddings API (/v1/embeddings)

Dense vectors for semantic search, RAG retrieval, clustering, and classification.
`POST https://api.jina.ai/v1/embeddings`. OpenAI-compatible shape.

## Models

| Model | Context | Dim | Notes |
| --- | --- | --- | --- |
| `jina-embeddings-v5-text-small` | 32K | 1024 | Multilingual text, current default pick |
| `jina-embeddings-v5-text-nano` | 8K | 768 | Smaller/cheaper text |
| `jina-embeddings-v5-omni-small` | 32K | 1024 | Multimodal (text/image/…) |
| `jina-embeddings-v5-omni-nano` | 8K | 768 | Smaller multimodal |
| `jina-embeddings-v3` | 8K | up to 1024 | Multilingual, supports `late_chunking` |
| `jina-embeddings-v4` | 32K | — | Multimodal |
| `jina-clip-v2` | — | — | Text↔image, 89 languages |

## Request

```ts
const res = await fetch('https://api.jina.ai/v1/embeddings', {
  method: 'POST',
  headers: { Authorization: `Bearer ${process.env.JINA_API_KEY}`, 'Content-Type': 'application/json' },
  body: JSON.stringify({
    model: 'jina-embeddings-v5-text-small',
    task: 'retrieval.passage',   // see task table — pick per use
    input: ['First document text', 'Second document text'],
    dimensions: 1024,            // optional truncation (1–1024), MRL
  }),
}).then((r) => r.json());
```

| Field | Notes |
| --- | --- |
| `model` | **Required.** See table. |
| `input` | **Required.** string · `TextDoc` · `ImageDoc`/`VideoDoc`/`AudioDoc`/`PDFDoc` (multimodal models) · array of these. |
| `task` | `retrieval.query` · `retrieval.passage` · `text-matching` · `clustering` · `classification` (v5 default `text-matching`). |
| `dimensions` | Truncate to N dims (1–1024). Matryoshka — smaller = cheaper storage, slight quality loss. |
| `embedding_type` | `float` (default) · `base64` · `binary` · `ubinary`, or an array of these. Binary cuts storage ~32×. |
| `normalized` | default `true` — L2-normalized unit vectors (use dot-product = cosine). |
| `truncate` | default `false` — `true` truncates over-length input instead of erroring. |
| `late_chunking` (v3) | Concatenate inputs, embed as one sequence, then split — better context for chunked docs. |

## Task selection (important)

Embeddings are asymmetric: **embed queries and documents with different tasks**.
- Index your corpus with `task: 'retrieval.passage'`.
- Embed the user query with `task: 'retrieval.query'`.
- For dedup/similarity (no query/doc asymmetry) use `text-matching`.
- For k-means/topic grouping use `clustering`; for zero-shot label vectors use `classification`.

Mismatched tasks silently degrade retrieval quality.

## Response

```jsonc
{
  "model": "jina-embeddings-v5-text-small",
  "object": "list",
  "usage": { "total_tokens": 18, "prompt_tokens": 18 },
  "data": [
    { "object": "embedding", "index": 0, "embedding": [0.01, -0.02, ...] },
    { "object": "embedding", "index": 1, "embedding": [...] }
  ]
}
```

`data[].embedding` aligns with `input` order. Store passage vectors in your vector DB; at query time
embed the query (`retrieval.query`), retrieve candidates, then **rerank** (references/rerank.md)
before sending to the LLM. For >a few thousand inputs, use async Batch embeddings
(references/batch.md).
