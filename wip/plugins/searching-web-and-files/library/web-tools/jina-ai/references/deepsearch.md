# DeepSearch (deepsearch.jina.ai)

Agentic search: iteratively searches, reads, and reasons until it can answer — for complex questions
needing multi-hop research or up-to-date facts. **OpenAI chat-completions compatible**, so any OpenAI
SDK works by swapping the base URL. `POST https://deepsearch.jina.ai/v1/chat/completions`,
model `jina-deepsearch-v1`. Also the official home of **grounding / fact-checking** (see below).

## Table of contents
- [Request (raw fetch)](#request-raw-fetch)
- [Via the OpenAI SDK](#via-the-openai-sdk-drop-in)
- [Grounding / fact-checking](#grounding--fact-checking)
- [Notes](#notes)
- [DeepSearch vs build-your-own](#deepsearch-vs-build-your-own)

## Request (raw fetch)

```ts
const res = await fetch('https://deepsearch.jina.ai/v1/chat/completions', {
  method: 'POST',
  headers: { Authorization: `Bearer ${process.env.JINA_API_KEY}`, 'Content-Type': 'application/json' },
  body: JSON.stringify({
    model: 'jina-deepsearch-v1',
    messages: [{ role: 'user', content: 'What changed between jina-reranker-v2 and v3? Cite sources.' }],
    stream: true,            // recommended — jobs can run long; streaming avoids timeouts
    reasoning_effort: 'medium', // low | medium | high — trades latency/cost for depth
  }),
});
```

## Via the OpenAI SDK (drop-in)

```ts
import OpenAI from 'openai';
const client = new OpenAI({ apiKey: process.env.JINA_API_KEY, baseURL: 'https://deepsearch.jina.ai/v1' });

const stream = await client.chat.completions.create({
  model: 'jina-deepsearch-v1',
  messages: [{ role: 'user', content: 'Compare the top 3 open vector DBs in 2026 with sources.' }],
  stream: true,
});
for await (const chunk of stream) process.stdout.write(chunk.choices[0]?.delta?.content ?? '');
```

## Grounding / fact-checking

Grounding (verify a **statement** against the live web, with sourced quotes) used to be a standalone
`g.jina.ai` endpoint. **It has moved into DeepSearch** — drive it with a JSON-schema response format.
(`g.jina.ai` still responds but is impractically slow — a verified call ran >90s; use DeepSearch.)

Send the claim and force a `{statement, validity, explanation}` schema:

```ts
const res = await fetch('https://deepsearch.jina.ai/v1/chat/completions', {
  method: 'POST',
  headers: { Authorization: `Bearer ${process.env.JINA_API_KEY}`, 'Content-Type': 'application/json' },
  body: JSON.stringify({
    model: 'jina-deepsearch-v1',
    stream: true,                 // grounding visits pages → can be slow; stream to avoid timeouts
    reasoning_effort: 'low',      // bump to medium/high for contested claims
    messages: [{ role: 'user', content: 'Fact-check this statement: The Eiffel Tower is in Berlin, Germany.' }],
    response_format: {
      type: 'json_schema',
      // GOTCHA: the schema object goes DIRECTLY here. Nesting it under a `schema` key returns `{}`.
      json_schema: {
        type: 'object',
        properties: {
          statement: { type: 'string' },
          validity: { type: 'string', enum: ['true', 'false', 'unknown'] },
          explanation: { type: 'string' },
        },
        required: ['statement', 'validity', 'explanation'],
      },
    },
  }),
});
```

The streamed `delta.content` may include a `<think>...</think>` block before the JSON — strip it, then
`JSON.parse` the trailing object. Verified output:

```json
{ "statement": "The Eiffel Tower is located in Berlin, Germany",
  "validity": "false",
  "explanation": "The Eiffel Tower is located in Paris, France." }
```

How it works: DeepSearch generates queries → searches (s.jina.ai) → reads pages (r.jina.ai) →
extracts references `{url, keyQuote, isSupportive}` (up to 30) → returns a verdict using those plus
internal knowledge. For a well-known fact it may answer from internal knowledge alone (`visitedURLs`
can be 0, ~5s); for uncertain/fresh claims it actually searches and runs much longer.

Caveats specific to grounding:
- **Only checkable claims.** Opinions ("I feel lazy"), future/hypothetical statements are rejected.
- **No instruction needed** beyond the statement, but `"Fact-check this statement: ..."` framing helps.
- **Latency/cost:** a real grounding pass can take ~30s and hundreds of thousands of tokens; trivial
  facts are fast. Stream, and prefer `reasoning_effort: low` unless the claim is contested.
- Want a richer payload (per-source supporting/contradicting quotes)? Ask for them in the schema
  (e.g. a `references: [{url, quote, supportive}]` array) — DeepSearch fills what it found.

## Notes

- Returns a synthesized answer plus the URLs it visited (citations) — good for research reports.
- Long-running by design. **Always stream**; non-streamed calls can exceed client timeouts.
- `reasoning_effort` bounds how hard it digs. Start `medium` (or `low` for simple fact-checks).
- Consumes far more tokens than a single search+read — use it for genuinely hard questions; for
  simple "find + summarize" prefer search.md + Claude (claude-integration.md), which is cheaper and
  you control the loop.

## DeepSearch vs build-your-own

| Want | Use |
| --- | --- |
| One call, it figures out the research plan | DeepSearch |
| Verify a claim with sourced quotes | DeepSearch + json_schema (grounding, above) |
| Control over which sources, reranking, prompt, cost | search.md → reader.md → rerank.md → Claude |
| Tool-use agent where Claude drives | claude-integration.md + assets/jina-claude-agent.ts |
