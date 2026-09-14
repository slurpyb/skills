# Sonar API (web-grounded chat)

`POST https://api.perplexity.ai/chat/completions` (OpenAI-compatible) — also reachable at
`POST /v1/sonar`. Returns an OpenAI-shaped chat completion PLUS `citations`, `search_results`, and
`related_questions`. Header: `Authorization: Bearer pplx-…`, `Content-Type: application/json`.

## Table of contents
- [Models](#models)
- [Request parameters](#request-parameters)
- [Response shape](#response-shape)
- [Structured output (JSON Schema)](#structured-output-json-schema)
- [Streaming](#streaming)
- [Reasoning models & the think block](#reasoning-models--the-think-block)
- [OpenAI SDK compatibility](#openai-sdk-compatibility)

## Models

| Model | Profile |
| --- | --- |
| `sonar` | Fast, cheap, web-grounded Q&A. Default for simple lookups. |
| `sonar-pro` | Multi-step Q&A, ~2× more search results, 200K context. |
| `sonar-reasoning` | Reasoning + web search; emits a `<think>` block. |
| `sonar-reasoning-pro` | Stronger reasoning + search; emits a `<think>` block. |
| `sonar-deep-research` | Exhaustive multi-source research; minutes-long, costly. Prefer async (references/async.md) or the Agent `deep-research` preset. |

Surface the choice — don't silently default. `sonar` for cheap facts, `sonar-pro` for substance,
`sonar-reasoning-pro` when you want the chain of thought, `sonar-deep-research` only for reports.

## Request parameters

Standard OpenAI chat fields (`model`, `messages`, `max_tokens`, `temperature`, `top_p`,
`stream`, `response_format`) plus Perplexity search controls:

| Param | Type | Notes |
| --- | --- | --- |
| `search_recency_filter` | string | `day` \| `week` \| `month` \| `year` — bound source freshness |
| `search_domain_filter` | string[] | allowlist (`"nature.com"`) OR denylist (`"-reddit.com"`); max 20; not both modes at once |
| `search_mode` | string | `academic` to bias toward scholarly sources (default web) |
| `search_after_date_filter` / `search_before_date_filter` | string | `MM/DD/YYYY` absolute date bounds |
| `return_related_questions` | bool | populate `related_questions[]` |
| `return_images` | bool | include images in `search_results` (tier-gated) |
| `web_search_options` | object | `{ search_context_size: "low"\|"medium"\|"high" }` — how much page text to pull |
| `disable_search` | bool | turn off web search (pure model answer) |

```ts
const r = await fetch('https://api.perplexity.ai/chat/completions', {
  method: 'POST',
  headers: { Authorization: `Bearer ${process.env.PERPLEXITY_API_KEY}`, 'Content-Type': 'application/json' },
  body: JSON.stringify({
    model: 'sonar-pro',
    messages: [
      { role: 'system', content: 'Be concise and cite sources.' },
      { role: 'user', content: 'Summarize this week’s major AI infra announcements.' },
    ],
    search_recency_filter: 'week',
    search_domain_filter: ['-reddit.com', '-pinterest.com'],
    web_search_options: { search_context_size: 'high' },
  }),
}).then((r) => r.json());
```

## Response shape

Verified live. OpenAI envelope + Perplexity fields:

```jsonc
{
  "id": "…",
  "model": "sonar",
  "created": 1771891464,
  "object": "chat.completion",
  "choices": [{ "index": 0, "finish_reason": "stop",
    "message": { "role": "assistant", "content": "Argentina won the 2022 World Cup.[3][5]" } }],
  "citations": ["https://…", "https://…"],          // ordered; [n] markers in content map to these
  "search_results": [{ "title": "…", "url": "…", "date": "2026-05-28", "last_updated": "2026-06-02" }],
  "related_questions": ["…", "…"],                    // only when return_related_questions:true
  "usage": {
    "prompt_tokens": 14, "completion_tokens": 16, "total_tokens": 30,
    "search_context_size": "low",
    "cost": { "input_tokens_cost": 0.00001, "output_tokens_cost": 0.00002,
              "request_cost": 0.005, "total_cost": 0.00503 }   // USD, per response
  }
}
```

Inline `[n]` markers in `content` are 1-indexed into `citations`. `search_results` carries the rich
metadata (title/url/date); `citations` is just the URL list.

## Structured output (JSON Schema)

Add `response_format`. **The schema goes under `json_schema.schema`** — this differs from some other
providers; putting the schema directly under `json_schema` does not work.

```ts
const r = await fetch('https://api.perplexity.ai/chat/completions', {
  method: 'POST', headers: H,
  body: JSON.stringify({
    model: 'sonar',
    messages: [{ role: 'user', content: 'Capital of Japan and its population. Return JSON.' }],
    response_format: {
      type: 'json_schema',
      json_schema: { schema: {                       // <- schema nested HERE
        type: 'object',
        properties: { capital: { type: 'string' }, population: { type: 'number' } },
        required: ['capital', 'population'],
      } },
    },
  }),
}).then((r) => r.json());
const data = JSON.parse(r.choices[0].message.content);   // { capital: "Tokyo", population: 14000000 }
```

Notes: the **first** request with a brand-new schema incurs a 10–30s warmup (schema compile);
later calls are fast. Hint the shape in your prompt ("Return a JSON object with fields …") to improve
compliance. Don't ask for links inside the JSON — read them from `citations`/`search_results`.

## Streaming

`stream: true` yields OpenAI-style SSE chunks. Content arrives progressively; `citations`,
`search_results`, and `usage` land in the **final** chunk(s), not during the stream.

```ts
const res = await fetch('https://api.perplexity.ai/chat/completions', {
  method: 'POST', headers: H,
  body: JSON.stringify({ model: 'sonar', messages, stream: true }),
});
const reader = res.body!.getReader();
const dec = new TextDecoder();
let buf = '';
for (;;) {
  const { value, done } = await reader.read();
  if (done) break;
  buf += dec.decode(value, { stream: true });
  for (const line of buf.split('\n')) {
    if (!line.startsWith('data:')) continue;
    const p = line.slice(5).trim();
    if (p === '[DONE]') continue;
    try { process.stdout.write(JSON.parse(p).choices?.[0]?.delta?.content ?? ''); } catch {}
  }
  buf = buf.slice(buf.lastIndexOf('\n') + 1);
}
```

## Reasoning models & the think block

`sonar-reasoning` and `sonar-reasoning-pro` prepend a `<think>…</think>` block before the answer.
Strip it before display or parsing:

```ts
const clean = (s: string) => s.replace(/<think>[\s\S]*?<\/think>/g, '').trim();
```

## OpenAI SDK compatibility

Point any OpenAI client at Perplexity — no code changes beyond `baseURL`:

```ts
import OpenAI from 'openai';
const client = new OpenAI({ apiKey: process.env.PERPLEXITY_API_KEY, baseURL: 'https://api.perplexity.ai' });
const resp = await client.chat.completions.create({ model: 'sonar-pro', messages });
// resp.citations / resp.search_results are present as extra fields on the response
```

Or the native SDK: `client.chat.completions.create({ model, messages, stream })` from
`@perplexity-ai/perplexity_ai`.
