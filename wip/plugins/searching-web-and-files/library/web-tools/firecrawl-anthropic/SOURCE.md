---
name: firecrawl-anthropic
description: |
  Integrate Firecrawl web scraping/crawling/search with the Anthropic Claude API
  (TypeScript/Node) to build web-powered AI apps. Use when wiring Firecrawl into Claude
  workflows: (1) scrape a page then summarize/analyze with Claude, (2) give Claude tool use so
  it decides when to scrape/search/crawl the web, (3) extract structured JSON from scraped
  pages with Claude, (4) run async crawl/batch/extract jobs and receive results via webhooks,
  or (5) build research / Q&A agents over web data. Triggers: "firecrawl + claude/anthropic",
  "@anthropic-ai/sdk with firecrawl", scraping web data for Claude, Claude tool use that
  scrapes the web, structured extraction from websites, firecrawl webhooks.
---

# Firecrawl × Anthropic (Claude)

Firecrawl turns URLs into clean LLM-ready markdown; Claude reasons over it. This skill wires the
two together in TypeScript/Node.

## Setup

```bash
npm install firecrawl @anthropic-ai/sdk zod zod-to-json-schema
```

`.env`:

```
FIRECRAWL_API_KEY=fc-your_firecrawl_key
ANTHROPIC_API_KEY=your_anthropic_key
```

Both SDKs read their key from env automatically (`new Firecrawl()`, `new Anthropic()`) — passing
`apiKey` explicitly is optional. On **Node < 20**, `npm i dotenv` and add `import 'dotenv/config'`
at the top of the entry file (Node 20+ supports `--env-file=.env`).

Default model below is `claude-haiku-4-5` (cheap/fast, fine for summarize + tool routing). Use
`claude-sonnet-4-6` for harder reasoning. See [references/claude-patterns.md](references/claude-patterns.md)
for model/token guidance.

## Pattern 1 — Scrape + Summarize

Scrape one page, hand the markdown to Claude.

```ts
import { Firecrawl } from 'firecrawl';
import Anthropic from '@anthropic-ai/sdk';

const firecrawl = new Firecrawl();
const anthropic = new Anthropic();

const doc = await firecrawl.scrape('https://firecrawl.dev', {
  formats: ['markdown'],
  onlyMainContent: true, // drop nav/footer chrome — fewer tokens, better signal
});

const msg = await anthropic.messages.create({
  model: 'claude-haiku-4-5',
  max_tokens: 1024,
  messages: [{ role: 'user', content: `Summarize in 100 words:\n\n${doc.markdown}` }],
});

console.log(msg.content[0].type === 'text' ? msg.content[0].text : '');
```

## Pattern 2 — Tool Use (Claude decides when to scrape)

Give Claude a `scrape_website` tool. Build the JSON Schema from a zod schema with
`zodToJsonSchema`. **The doc's example stops after detecting one tool call — that is incomplete.**
A real integration must return a `tool_result` and loop until Claude stops requesting tools.

Minimal single turn (detect + execute):

```ts
import { z } from 'zod';
import { zodToJsonSchema } from 'zod-to-json-schema';

const ScrapeArgs = z.object({ url: z.string() });

const res = await anthropic.messages.create({
  model: 'claude-haiku-4-5',
  max_tokens: 1024,
  tools: [{
    name: 'scrape_website',
    description: 'Scrape and extract markdown content from a website URL',
    input_schema: zodToJsonSchema(ScrapeArgs, 'ScrapeArgs') as any,
  }],
  messages: [{ role: 'user', content: 'What is Firecrawl? Check firecrawl.dev' }],
});

const toolUse = res.content.find((b) => b.type === 'tool_use');
if (toolUse?.type === 'tool_use') {
  const { url } = toolUse.input as { url: string };
  const scraped = await firecrawl.scrape(url, { formats: ['markdown'] });
  // ...now feed `scraped.markdown` back to Claude as a tool_result (see full loop)
}
```

**Use the complete multi-turn loop in [assets/tool-use-agent.ts](assets/tool-use-agent.ts)** — it
registers both `scrape_website` and `search_web`, loops while `stop_reason === 'tool_use'`, and
returns Claude's final answer. Loop anatomy and multi-tool setup: [references/claude-patterns.md](references/claude-patterns.md).

## Pattern 3 — Structured Extraction

Scrape, then have Claude emit JSON validated by zod. The **prefill trick** — seed the assistant
turn with `'{'` — forces Claude to continue valid JSON instead of prose:

```ts
const CompanyInfo = z.object({
  name: z.string(),
  industry: z.string().optional(),
  description: z.string().optional(),
});

const doc = await firecrawl.scrape('https://stripe.com', { formats: ['markdown'], onlyMainContent: true });

const msg = await anthropic.messages.create({
  model: 'claude-haiku-4-5',
  max_tokens: 1024,
  messages: [
    { role: 'user', content: `Extract company info as JSON {name, industry, description}.\n\n${doc.markdown}` },
    { role: 'assistant', content: '{' }, // prefill: response continues from here
  ],
});

const text = msg.content.find((b) => b.type === 'text');
if (text?.type === 'text') {
  const info = CompanyInfo.parse(JSON.parse('{' + text.text)); // re-attach the prefilled '{'
  console.log(info);
}
```

For schema-guaranteed output, prefer **forced tool use** (`tool_choice`) over prefill — see
[references/claude-patterns.md](references/claude-patterns.md). For extraction across **many URLs
or whole domains**, use Firecrawl's own `/extract` (LLM-side, no Claude call needed) — see
[references/firecrawl-sdk.md](references/firecrawl-sdk.md).

## Gotchas

| Issue | Fix |
| --- | --- |
| Scraped markdown is large; blows the context window or runs up cost | `onlyMainContent: true`, truncate, or **prompt-cache** the doc with `cache_control` (reused-content discount). See claude-patterns.md. |
| `JSON.parse` fails on Claude's prose preamble | Use the `'{'` prefill (Pattern 3) or forced tool use — never trust free-form JSON. |
| Tool-use conversation never finishes | Loop while `stop_reason === 'tool_use'`; append the assistant turn **and** a `tool_result` each round (assets/tool-use-agent.ts). |
| `content[0]` isn't text | Claude returns content blocks; always `.find(b => b.type === 'text' \| 'tool_use')` and narrow the type. |
| Crawl/extract of big sites times out inline | They're async — `startCrawl`/`startExtract` + poll, or attach a **webhook**. See references/webhooks.md. |
| SDK throws on bad URL / quota | Wrap Firecrawl + Anthropic calls in `try/catch`; both throw descriptive errors. |

## Reference map

- **Firecrawl method/options reference** (scrape formats, search, crawl, map, batch, extract, interact) → [references/firecrawl-sdk.md](references/firecrawl-sdk.md)
- **Claude-side patterns** (multi-turn loop, multiple tools, forced-tool JSON, prompt caching, models) → [references/claude-patterns.md](references/claude-patterns.md)
- **Async jobs + webhooks** (events, payloads, HMAC verification, retries) → [references/webhooks.md](references/webhooks.md)
- **End-to-end recipes** (research agent, docs Q&A, bulk extract, crawl→webhook→Claude) → [references/cookbooks.md](references/cookbooks.md)
- **Runnable scaffolds** → [assets/tool-use-agent.ts](assets/tool-use-agent.ts), [assets/webhook-server.ts](assets/webhook-server.ts)
