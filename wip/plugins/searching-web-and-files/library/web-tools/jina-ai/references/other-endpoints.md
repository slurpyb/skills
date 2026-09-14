# Classify · Segment · Models

Smaller foundation endpoints on `api.jina.ai`. All use `Authorization: Bearer jina_...` (Segmenter
also works keyless).

## Table of contents
- [Classify (zero-shot)](#classify-zero-shot)
- [Classify (few-shot) + train](#classify-few-shot--train)
- [Segmenter](#segmenter)
- [Models list](#models-list)

## Classify (zero-shot)

Categorize text/images into labels with no training data. `POST https://api.jina.ai/v1/classify`.

```ts
const res = await fetch('https://api.jina.ai/v1/classify', {
  method: 'POST',
  headers: { Authorization: `Bearer ${process.env.JINA_API_KEY}`, 'Content-Type': 'application/json' },
  body: JSON.stringify({
    model: 'jina-embeddings-v3',     // or v5-text-small/-nano; jina-clip-v2 / v4 for images
    input: ['Refund never arrived', 'Love the new dashboard'],
    labels: ['complaint', 'praise', 'question'],  // up to 256 labels (or a dict of up to 8 groups × 64)
  }),
}).then((r) => r.json());
// → data: [{ index, prediction, score, predictions: [{label, score}] }]
```

Multilingual via `jina-embeddings-v3` / `v5-text-*`; multimodal via `jina-clip-v2` / `jina-embeddings-v4`.

## Classify (few-shot) + train

Train a custom classifier from labeled examples (200–400 samples recommended), then classify by id.
Limits: 16 classes and 16 classifiers per key; supports incremental updates.

```ts
// 1. Train → returns classifier_id
const trained = await fetch('https://api.jina.ai/v1/train', {
  method: 'POST', headers: H,
  body: JSON.stringify({
    model: 'jina-embeddings-v3',
    input: [
      { text: 'where is my order', label: 'shipping' },
      { text: 'reset my password', label: 'account' },
      // ...200-400 items
    ],
  }),
}).then((r) => r.json()); // → { classifier_id, ... }

// 2. Classify with the trained classifier
await fetch('https://api.jina.ai/v1/classify', {
  method: 'POST', headers: H,
  body: JSON.stringify({ classifier_id: trained.classifier_id, input: ['my package is late'] }),
});
```

Manage: `GET /v1/classifiers` (list), `POST /v1/classifiers` (update training), `DELETE
/v1/classifiers/{classifier_id}`.

## Segmenter

Tokenize and chunk text — count tokens and split long content before embedding/reranking/LLM input.
`POST https://api.jina.ai/v1/segment` (also `https://segment.jina.ai/`). Works **without an API key**.

```ts
const seg = await fetch('https://api.jina.ai/v1/segment', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' }, // Authorization optional
  body: JSON.stringify({
    content: longText,
    return_chunks: true,
    max_chunk_length: 1000,   // chars per chunk
    return_tokens: false,
    // tokenizer: 'cl100k_base' (default)
  }),
}).then((r) => r.json());
// → { num_tokens, tokenizer, num_chunks, chunk_positions: [[start,end],...], chunks: [...] }
```

Use it to: count tokens before a paid call, split a long Reader result into rerankable passages, or
fit content into a model's context window. `chunk_positions` are char offsets back into `content`.

## Models list

Discover available models, modalities, context lengths, and pricing (OpenRouter-compatible format).

```ts
await fetch('https://api.jina.ai/v1/models', { headers: H }).then((r) => r.json()); // → { data: [ModelInfo] }
await fetch('https://api.jina.ai/v1/models/jina-reranker-v3', { headers: H });       // single model
```

Prefer this over hardcoding when you need current pricing/dims/context at runtime.
