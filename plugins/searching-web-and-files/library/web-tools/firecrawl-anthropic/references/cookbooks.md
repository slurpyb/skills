# Cookbooks

End-to-end recipes composing Firecrawl + Claude. Each assumes `firecrawl` and `anthropic` clients
from env keys, and `const MODEL = 'claude-haiku-4-5'`. See firecrawl-sdk.md for method options and
claude-patterns.md for the loop/caching details referenced here.

## Table of contents
- [1. Research agent (search → scrape → cited answer)](#1-research-agent)
- [2. Docs Q&A over a crawled site (with prompt caching)](#2-docs-qa-over-a-crawled-site)
- [3. Bulk structured extraction (batch → validated rows)](#3-bulk-structured-extraction)
- [4. Tool-use agent with scrape + search](#4-tool-use-agent-with-scrape--search)
- [5. Async crawl → webhook → Claude pipeline](#5-async-crawl--webhook--claude-pipeline)

## 1. Research agent

Search the web, scrape the strongest hits, have Claude synthesize a cited answer.

```ts
async function research(question: string): Promise<string> {
  const hits = await firecrawl.search(question, { limit: 4, scrapeOptions: { formats: ['markdown'] } });

  const sources = hits.web
    .map((h, i) => `[${i + 1}] ${h.title} — ${h.url}\n${(h.markdown ?? '').slice(0, 8000)}`)
    .join('\n\n---\n\n');

  const res = await anthropic.messages.create({
    model: MODEL,
    max_tokens: 1024,
    system: 'Answer using ONLY the sources. Cite claims with [n]. If unsupported, say so.',
    messages: [{ role: 'user', content: `Question: ${question}\n\nSources:\n${sources}` }],
  });
  const t = res.content.find((b) => b.type === 'text');
  return t?.type === 'text' ? t.text : '';
}
```

`scrapeOptions` in `search` returns page content inline, so this is a single Firecrawl call. Cap
each source's markdown so the combined prompt stays within budget.

## 2. Docs Q&A over a crawled site

Crawl a docs section once, then answer many questions cheaply by **prompt-caching** the corpus.

```ts
const crawl = await firecrawl.crawl('https://docs.firecrawl.dev', {
  limit: 30, scrapeOptions: { formats: ['markdown'], onlyMainContent: true },
});

const corpus = crawl.data
  .map((p) => `# ${p.metadata?.title ?? p.metadata?.url}\n${p.markdown}`)
  .join('\n\n').slice(0, 300_000); // keep within context; chunk + map-reduce if larger

async function ask(q: string): Promise<string> {
  const res = await anthropic.messages.create({
    model: MODEL,
    max_tokens: 1024,
    system: [
      { type: 'text', text: 'Answer strictly from the documentation below.' },
      { type: 'text', text: corpus, cache_control: { type: 'ephemeral' } }, // cached prefix, reused per question
    ],
    messages: [{ role: 'user', content: q }],
  });
  const t = res.content.find((b) => b.type === 'text');
  return t?.type === 'text' ? t.text : '';
}
```

First question pays to write the cache; subsequent questions within the TTL hit it. For big sites
use `map`/`search` to pick relevant pages instead of crawling everything, or chunk + summarize.

## 3. Bulk structured extraction

Scrape many URLs, extract the same schema from each via **forced tool use**, validate with zod.

```ts
import { z } from 'zod';

const Product = z.object({ name: z.string(), price: z.string().optional(), inStock: z.boolean().optional() });
const productJsonSchema = {
  type: 'object',
  properties: { name: { type: 'string' }, price: { type: 'string' }, inStock: { type: 'boolean' } },
  required: ['name'],
};

const batch = await firecrawl.batchScrape(urls, { options: { formats: ['markdown'], onlyMainContent: true } });

const rows = [];
for (const page of batch.data) {
  const res = await anthropic.messages.create({
    model: MODEL,
    max_tokens: 512,
    tools: [{ name: 'record_product', description: 'Record product fields', input_schema: productJsonSchema }],
    tool_choice: { type: 'tool', name: 'record_product' },
    messages: [{ role: 'user', content: `Extract product fields:\n\n${(page.markdown ?? '').slice(0, 40_000)}` }],
  });
  const call = res.content.find((b) => b.type === 'tool_use');
  if (call?.type === 'tool_use') rows.push({ url: page.metadata?.url, ...Product.parse(call.input) });
}
```

If the *whole* task is "fields from pages" with no extra reasoning, skip Claude and use Firecrawl's
`extract` (supports wildcards + `enableWebSearch`) — see firecrawl-sdk.md.

## 4. Tool-use agent with scrape + search

Let Claude choose between searching and scraping autonomously. This is the full multi-turn loop with
two tools — the complete runnable version is `assets/tool-use-agent.ts`. Skeleton:

```ts
const tools = [
  { name: 'search_web', description: 'Search the web for relevant pages',
    input_schema: { type: 'object', properties: { query: { type: 'string' } }, required: ['query'] } },
  { name: 'scrape_website', description: 'Scrape full markdown from a URL',
    input_schema: { type: 'object', properties: { url: { type: 'string' } }, required: ['url'] } },
];
// loop while stop_reason === 'tool_use':
//   search_web  → firecrawl.search(q, {limit:5}) → return compact [{title,url,snippet}] JSON
//   scrape_website → firecrawl.scrape(url,{formats:['markdown'],onlyMainContent:true}) → return capped markdown
// (see claude-patterns.md "multi-turn tool-use loop" for the exact loop code)
```

Return search results as a small JSON list (titles + URLs), not full pages — let Claude pick a URL
to scrape. This keeps each turn cheap.

## 5. Async crawl → webhook → Claude pipeline

For large sites: start an async crawl with a webhook, ack fast, and analyze pages with Claude in a
background worker. Receiver (HMAC-verified) lives in `assets/webhook-server.ts`.

```ts
// Kick off
await firecrawl.startCrawl('https://big-docs-site.com', {
  limit: 500,
  scrapeOptions: { formats: ['markdown'], onlyMainContent: true },
  webhook: { url: 'https://your-domain.com/webhook/firecrawl', events: ['page', 'completed'], metadata: { job: 'kb-sync' } },
});

// Receiver (per references/webhooks.md): verify signature → 200 immediately → enqueue
// Worker: for each crawl.page → Claude extract/summarize → upsert into your store keyed by event.id + page url
// On crawl.completed → finalize (e.g., build an index, notify)
```

Why this shape: webhooks must return 2xx within 10s, so never call Claude inline in the handler —
enqueue and process out of band. Make the worker idempotent (dedupe on job id + page url) because
delivery is at-least-once.
