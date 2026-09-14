# Embeddings API

Two endpoints for vector embeddings (semantic search, clustering, RAG):

- `POST /v1/embeddings` — standard, each text embedded independently. Model `pplx-embed-v1-4b`.
- `POST /v1/contextualizedembeddings` — chunks from the **same document share context**, improving
  retrieval over long docs. Model `pplx-embed-context-v1-4b`.

## Decoding (non-obvious)

Embeddings are returned **base64-encoded int8** values — decode and cast to float before use:

```ts
function decodeEmbedding(b64: string): Float32Array {
  const bytes = Buffer.from(b64, 'base64');           // int8 bytes
  const out = new Float32Array(bytes.length);
  for (let i = 0; i < bytes.length; i++) out[i] = bytes.readInt8(i);
  return out;
}
```

(Python: `np.frombuffer(base64.b64decode(b64), dtype=np.int8).astype(np.float32)`.)

## Standard embeddings

```ts
const H = { Authorization: `Bearer ${process.env.PERPLEXITY_API_KEY}`, 'Content-Type': 'application/json' };

const r = await fetch('https://api.perplexity.ai/v1/embeddings', {
  method: 'POST', headers: H,
  body: JSON.stringify({ model: 'pplx-embed-v1-4b', input: chunks }),   // input: string[]
}).then((r) => r.json());

const vectors = r.data.map((d: any) => decodeEmbedding(d.embedding));   // r.data[i].embedding ↔ chunks[i]
```

Embed both your passages (at index time) and the query (at search time) with the **same model**, then
rank by cosine similarity in your vector store.

## Contextualized embeddings

`input` is a **nested** array — one inner array of chunks per document. The response mirrors the
nesting: `data[docIndex].data[chunkIndex].embedding`.

```ts
const r = await fetch('https://api.perplexity.ai/v1/contextualizedembeddings', {
  method: 'POST', headers: H,
  body: JSON.stringify({
    model: 'pplx-embed-context-v1-4b',
    input: [doc1Chunks, doc2Chunks],          // string[][]
  }),
}).then((r) => r.json());

const doc1 = r.data[0].data.map((c: any) => decodeEmbedding(c.embedding));
// Query side — wrap as a single-doc, single-chunk nested input:
const q = await fetch('https://api.perplexity.ai/v1/contextualizedembeddings', {
  method: 'POST', headers: H,
  body: JSON.stringify({ model: 'pplx-embed-context-v1-4b', input: [[question]] }),
}).then((r) => r.json());
const qVec = decodeEmbedding(q.data[0].data[0].embedding);
```

Use contextualized embeddings when retrieval quality over multi-chunk documents matters; rate limits
are ~5× higher than standard (limited by total chunks, not request count — see
references/errors-auth-limits.md).

## RAG flow

1. **Chunk** documents (≈300–500 chars, 50–100 overlap).
2. **Embed** chunks (`pplx-embed-v1-4b` or contextualized) and store vector ↔ text.
3. **Embed** the user question with the same model.
4. **Retrieve** top-k by cosine similarity.
5. **Generate** a grounded answer — pass the retrieved chunks to the Agent API
   (`anthropic/claude-*`) or to Claude directly (references/claude-integration.md).

Full end-to-end pipeline (Search → context → Claude) in assets/sonar-rag.ts; embeddings-based
retrieval recipe in references/cookbooks.md.
