# Claude-side patterns

How to feed Firecrawl output to Claude well. Package: `@anthropic-ai/sdk` (`import Anthropic from '@anthropic-ai/sdk'`).

## Table of contents
- [The multi-turn tool-use loop](#the-multi-turn-tool-use-loop)
- [Registering multiple Firecrawl tools](#registering-multiple-firecrawl-tools)
- [Structured output: forced tool use vs prefill](#structured-output-forced-tool-use-vs-prefill)
- [Prompt caching large scraped docs](#prompt-caching-large-scraped-docs)
- [Token & context budgeting](#token--context-budgeting)
- [Model selection](#model-selection)

## The multi-turn tool-use loop

The Anthropic guide shows only the *first* turn (detect a `tool_use` block). Real apps must run a
loop: execute the requested tool(s), append the assistant turn **and** a `user` turn carrying the
`tool_result`, then call again — repeating while `stop_reason === 'tool_use'`.

```ts
import Anthropic from '@anthropic-ai/sdk';
import { Firecrawl } from 'firecrawl';

const anthropic = new Anthropic();
const firecrawl = new Firecrawl();

const tools: Anthropic.Tool[] = [{
  name: 'scrape_website',
  description: 'Scrape and return markdown content from a website URL',
  input_schema: { type: 'object', properties: { url: { type: 'string' } }, required: ['url'] },
}];

async function runTool(name: string, input: any): Promise<string> {
  if (name === 'scrape_website') {
    const doc = await firecrawl.scrape(input.url, { formats: ['markdown'], onlyMainContent: true });
    return (doc.markdown ?? '').slice(0, 50_000); // cap tool output — see budgeting below
  }
  throw new Error(`Unknown tool: ${name}`);
}

const messages: Anthropic.MessageParam[] = [
  { role: 'user', content: 'What is Firecrawl? Check firecrawl.dev' },
];

while (true) {
  const res = await anthropic.messages.create({
    model: 'claude-haiku-4-5',
    max_tokens: 1024,
    tools,
    messages,
  });

  messages.push({ role: 'assistant', content: res.content }); // keep the full assistant turn

  if (res.stop_reason !== 'tool_use') {
    const text = res.content.find((b) => b.type === 'text');
    console.log(text?.type === 'text' ? text.text : '');
    break;
  }

  // Execute every tool_use block in this turn, collect tool_result blocks
  const toolResults: Anthropic.ToolResultBlockParam[] = [];
  for (const block of res.content) {
    if (block.type !== 'tool_use') continue;
    try {
      const out = await runTool(block.name, block.input);
      toolResults.push({ type: 'tool_result', tool_use_id: block.id, content: out });
    } catch (e) {
      toolResults.push({
        type: 'tool_result', tool_use_id: block.id,
        content: `Error: ${(e as Error).message}`, is_error: true, // let Claude recover/retry
      });
    }
  }
  messages.push({ role: 'user', content: toolResults });
}
```

Key rules:
- Append the assistant message with its **original `content` blocks** (not just text) — the
  `tool_use_id`s must round-trip.
- Each `tool_result` must reference the matching `tool_use_id`.
- Return errors as `tool_result` with `is_error: true` so Claude can adjust instead of the call throwing.
- Always cap a turn count or token budget in production to avoid runaway loops.

## Registering multiple Firecrawl tools

Add `search_web` alongside `scrape_website` so Claude can find pages then read them.

```ts
const tools: Anthropic.Tool[] = [
  { name: 'search_web',
    description: 'Search the web; returns titles, URLs, and snippets',
    input_schema: { type: 'object', properties: { query: { type: 'string' }, limit: { type: 'number' } }, required: ['query'] } },
  { name: 'scrape_website',
    description: 'Scrape full markdown content from one URL',
    input_schema: { type: 'object', properties: { url: { type: 'string' } }, required: ['url'] } },
];
```

In `runTool`: `search_web` → `firecrawl.search(input.query, { limit: input.limit ?? 5 })`, return a
compact JSON list of `{title, url, snippet}` (don't dump full pages — let Claude pick a URL to
`scrape_website`). Generate schemas from zod with `zodToJsonSchema(schema, 'Name')` if you prefer a
single source of truth. Full runnable version: `assets/tool-use-agent.ts`.

## Structured output: forced tool use vs prefill

Two ways to get reliable JSON from scraped content.

**Prefill** (simple, in SKILL.md Pattern 3): seed `{ role: 'assistant', content: '{' }`, then
`JSON.parse('{' + text)`. Lightweight, but the model can still drift; validate with zod.

**Forced tool use** (robust): define a tool whose `input_schema` *is* your output schema and force
Claude to call it. The arguments come back already shaped — no JSON-in-prose parsing.

```ts
const schema = { type: 'object',
  properties: { name: { type: 'string' }, industry: { type: 'string' }, description: { type: 'string' } },
  required: ['name'] };

const res = await anthropic.messages.create({
  model: 'claude-haiku-4-5',
  max_tokens: 1024,
  tools: [{ name: 'record_company', description: 'Record extracted company info', input_schema: schema }],
  tool_choice: { type: 'tool', name: 'record_company' }, // force this exact tool
  messages: [{ role: 'user', content: `Extract company info:\n\n${doc.markdown}` }],
});

const call = res.content.find((b) => b.type === 'tool_use');
const data = call?.type === 'tool_use' ? call.input : null; // already an object
```

Prefer forced tool use when the shape must be exact (downstream code depends on it). Still validate
with zod at the boundary — the model fills values, your schema guards types.

## Prompt caching large scraped docs

Scraped markdown is big and often reused across turns/requests (same doc, many questions). Mark it
with `cache_control` so Anthropic caches that prefix — large discount on cache hits, ~5-min TTL.

```ts
const res = await anthropic.messages.create({
  model: 'claude-haiku-4-5',
  max_tokens: 1024,
  system: [
    { type: 'text', text: 'You answer questions strictly from the provided document.' },
    { type: 'text', text: doc.markdown, cache_control: { type: 'ephemeral' } }, // cache the big block
  ],
  messages: [{ role: 'user', content: question }],
});
```

Put the **stable, large** content (the scraped doc) behind the cache breakpoint and keep the varying
part (the user's question) after it. Ideal for docs-Q&A where one crawl answers many questions.

## Token & context budgeting

- A single scraped page can be tens of thousands of tokens. Always `onlyMainContent: true`, and
  `.slice()` tool outputs to a sane cap (e.g. 50k chars) before returning them to Claude.
- For whole crawls, don't concatenate every page — `map`/`search` to select relevant pages, scrape
  those, or chunk and summarize per page then combine (map-reduce).
- Set `max_tokens` to the output you actually need; it doesn't affect input cost but bounds latency.

## Model selection

| Model | Use for |
| --- | --- |
| `claude-haiku-4-5` | Summarize, tool routing, simple extraction, high-volume cheap calls (doc default) |
| `claude-sonnet-4-6` | Multi-step reasoning over scraped data, harder extraction, agent loops |
| `claude-opus-4-x` | Deepest analysis where quality dominates cost |

Start with Haiku for scrape→summarize and tool dispatch; escalate the synthesis step to Sonnet if
answers are shallow. Keep a single `MODEL` constant so you can switch in one place.
