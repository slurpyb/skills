# Reranker API (/v1/rerank)

Score query↔document relevance and reorder. The cheapest, highest-leverage step in RAG: over-fetch
candidates (search/embeddings), then rerank and keep `top_n`. `POST https://api.jina.ai/v1/rerank`.

## Models

| Model | Notes |
| --- | --- |
| `jina-reranker-v3` | Best. 0.6B, 131K context, listwise reranking. |
| `jina-reranker-m0` | Multimodal (text+image), 29 languages. |
| `jina-reranker-v2-base-multilingual` | 100+ languages, function-calling support. |
| `jina-colbert-v2` | Late-interaction (ColBERT) for high precision. |

## Request

```ts
const res = await fetch('https://api.jina.ai/v1/rerank', {
  method: 'POST',
  headers: { Authorization: `Bearer ${process.env.JINA_API_KEY}`, 'Content-Type': 'application/json' },
  body: JSON.stringify({
    model: 'jina-reranker-v3',
    query: 'how do I cap reader output size?',
    documents: [
      'X-Token-Budget caps total output tokens...',
      'jina-embeddings-v5 supports 32K context...',
      'Use X-Max-Tokens to limit content length...',
    ],
    top_n: 2,                 // omit → returns all, reordered
    return_documents: true,   // default true; false → indices+scores only (lighter)
  }),
}).then((r) => r.json());
```

| Field | Type | Notes |
| --- | --- | --- |
| `model` | string | **Required.** See table. |
| `query` | string | **Required.** |
| `documents` | string[] or `TextDoc[]` | **Required.** Candidate docs. |
| `top_n` | int | Return only the N best. Omit to reorder all. |
| `return_documents` | bool (default `true`) | Include doc text in results. Set `false` to save bandwidth. |
| `truncation` | bool | Truncate docs over the model's token limit instead of erroring. |
| `max_doc_length` | int (v3, default 2048) | Max tokens per doc (1–8192). |
| `return_embeddings` | bool (v3) | Also return each doc's embedding. |

## Response

```jsonc
{
  "model": "jina-reranker-v3",
  "object": "list",
  "usage": { "total_tokens": 137 },
  "results": [
    { "index": 0, "relevance_score": 0.92, "document": "X-Token-Budget caps..." },
    { "index": 2, "relevance_score": 0.81, "document": "Use X-Max-Tokens..." }
  ]
}
```

`results` is sorted by `relevance_score` descending. `index` maps back to the original `documents`
position. Take the top few and pass them to Claude as context (references/claude-integration.md).

## Why it matters

Embedding/vector search optimizes recall; rerankers optimize precision. Standard RAG shape:
1. Retrieve 20–100 candidates cheaply (search.md or embeddings.md + a vector store).
2. Rerank against the exact query, keep `top_n` (3–8).
3. Send only those to the LLM — fewer tokens, better grounding.

For long docs, segment first (references/other-endpoints.md) so each passage is rerankable, then
rerank the passages.
