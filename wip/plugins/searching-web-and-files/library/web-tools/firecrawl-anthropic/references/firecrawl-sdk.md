# Firecrawl Node SDK reference

The method surface you wire into Claude tools. Package: `firecrawl` (`import { Firecrawl } from 'firecrawl'`).
Construct with `new Firecrawl({ apiKey })` or set `FIRECRAWL_API_KEY` and call `new Firecrawl()`.
All methods are async and **throw** descriptive errors on failure — wrap in `try/catch`.

## Table of contents
- [scrape](#scrape) — single page → markdown/html/json/links/screenshot
- [search](#search) — web search, optionally with page content
- [crawl / startCrawl / status](#crawl) — whole site, async with polling
- [map](#map) — discover all URLs on a site
- [batchScrape](#batchscrape) — many known URLs in parallel
- [extract](#extract) — LLM structured extraction (no Claude call needed)
- [parse](#parse) — upload a local file instead of a URL
- [interact / browser](#interact--browser) — live browser actions
- [Pagination](#pagination)
- [Which method for which Claude task](#which-method-for-which-claude-task)

## scrape

```ts
const doc = await firecrawl.scrape(url, {
  formats: ['markdown'],     // 'markdown' | 'html' | 'rawHtml' | 'links' | 'screenshot' | 'json' | 'summary'
  onlyMainContent: true,      // strip nav/footer/ads — do this for LLM input
  waitFor: 3000,              // ms to wait for JS render (SPAs)
  actions: [{ type: 'click', selector: "a[href='/pricing']" }], // pre-scrape browser steps
  proxy: 'auto',             // 'basic' | 'stealth' | 'enhanced' | 'auto' — escalate for blocked sites
});

doc.markdown;                 // the LLM-ready text
doc.metadata.title;
doc.metadata.sourceURL;
doc.metadata.scrapeId;        // needed for interact()
```

`json` format extracts structured data during the scrape (pass a schema/prompt) — useful when you
want one page's fields without a separate Claude round-trip.

Example response shape:
```json
{ "markdown": "# Example Domain\n...", "metadata": { "title": "Example Domain", "sourceURL": "https://example.com" } }
```

## search

Web search; returns results, optionally with scraped page content per result.

```ts
const results = await firecrawl.search('firecrawl web scraping', {
  limit: 5,
  scrapeOptions: { formats: ['markdown'] }, // include full page content in each hit (optional)
});

for (const r of results.web) {
  console.log(r.title, r.url, r.markdown /* present when scrapeOptions given */);
}
```

This is the entry point for **research agents**: search → read top hits → reason. Wire it as a
`search_web` Claude tool (see assets/tool-use-agent.ts).

## crawl

Crawl an entire site from a start URL. Inline `crawl` blocks until done (with auto-pagination);
`startCrawl` returns immediately with a job id to poll or webhook.

```ts
// Blocking — simplest
const job = await firecrawl.crawl('https://docs.firecrawl.dev', {
  limit: 25,
  scrapeOptions: { formats: ['markdown'], onlyMainContent: true },
  pollInterval: 1,         // seconds
  timeout: 120,            // seconds
  // sitemap: 'only',      // crawl sitemap URLs only, skip link discovery
  // excludePaths: ['blog/*'],
});
console.log(job.status, job.data.length);
for (const page of job.data) console.log(page.metadata?.url, page.markdown?.length);

// Async — start, then poll / webhook
const { id } = await firecrawl.startCrawl('https://docs.firecrawl.dev', { limit: 100 });
const status = await firecrawl.getCrawlStatus(id);   // status.status, status.data, status.next
await firecrawl.cancelCrawl(id);
```

Stream results live with the watcher (WebSocket, HTTP fallback):
```ts
const watcher = firecrawl.watcher(id, { kind: 'crawl', pollInterval: 2, timeout: 120 });
watcher.on('document', (doc) => { /* each page as it lands */ });
watcher.on('done', (state) => console.log(state.status));
await watcher.start();
```

For large crawls feeding Claude, prefer **async + webhook** over blocking — see references/webhooks.md.

## map

Discover URLs without scraping content — cheap way to find the right pages before scraping.

```ts
const res = await firecrawl.map('https://firecrawl.dev', { limit: 100 /* search: 'pricing' */ });
console.log(res.links); // [{ url, title, description }]
```

## batchScrape

Scrape a known list of URLs in parallel (more efficient than looping `scrape`). Async like crawl.

```ts
const job = await firecrawl.batchScrape(
  ['https://a.com', 'https://b.com'],
  { options: { formats: ['markdown'], onlyMainContent: true } },
);
for (const page of job.data) console.log(page.metadata?.url);

// Async variant
const { id } = await firecrawl.startBatchScrape(urls, { options: { formats: ['markdown'] } });
const s = await firecrawl.getBatchScrapeStatus(id);
```

Use this for **bulk structured extract**: batchScrape N URLs, then one Claude call per page (or a
batched prompt) → validated rows. Recipe in references/cookbooks.md.

## extract

Firecrawl's own LLM extraction across one or many URLs (incl. wildcards) — returns structured JSON
**without a separate Claude call**. Billed in credits (1 credit = 15 tokens).

```ts
const res = await firecrawl.extract({
  urls: ['https://docs.firecrawl.dev', 'https://firecrawl.dev/*'], // /* = crawl + extract domain
  prompt: 'Extract the company mission and whether it is open source',
  schema: { type: 'object', properties: { mission: { type: 'string' }, isOpenSource: { type: 'boolean' } }, required: ['mission'] },
  enableWebSearch: true, // follow links beyond the given domain to enrich results
});
console.log(res.data);

// Async: startExtract → getExtractStatus (states: processing | completed | failed | cancelled)
```

Choose `extract` when the *whole job* is "get fields from page(s)". Choose Claude (Pattern 3) when
extraction is one step inside a larger reasoning conversation, or you want Claude to transform/judge
the result. Results available via API for 24h.

## parse

Convert an uploaded local file (`html`, `pdf`, `docx`, `xlsx`, …) to markdown — no URL.
Does **not** support `screenshot`, `actions`, `waitFor`, `location`, `mobile`, `changeTracking`.

```ts
const parsed = await firecrawl.parse(
  { data: '<html><body><h1>Hi</h1></body></html>', filename: 'upload.html', contentType: 'text/html' },
  { formats: ['markdown'] },
);
console.log(parsed.markdown);
```

## interact / browser

Drive a live browser session bound to a scrape, or spin up a standalone cloud browser.

```ts
// Scrape-bound: keep acting on the replayed page
const doc = await firecrawl.scrape('https://www.amazon.com', { formats: ['markdown'] });
const id = doc.metadata?.scrapeId!;
await firecrawl.interact(id, { prompt: 'Search for iPhone 16 Pro Max' });
const out = await firecrawl.interact(id, { prompt: 'Click the first result and tell me the price' });
console.log(out.output);
await firecrawl.stopInteraction(id);

// Standalone cloud browser (CDP / Playwright)
const session = await firecrawl.browser({ ttl: 600 });
session.cdpUrl;       // connect Playwright via chromium.connectOverCDP(session.cdpUrl)
await firecrawl.deleteBrowser(session.id);
```

## Pagination

`crawl` and `batchScrape` status endpoints return a `next` URL when more data is available. The
Node SDK **auto-paginates by default** and aggregates all docs (`next` becomes `null`). Control it
on the status call:

```ts
// One page at a time
const single = await firecrawl.getCrawlStatus(id, { autoPaginate: false });
// Auto-paginate but stop early
const limited = await firecrawl.getCrawlStatus(id, { autoPaginate: true, maxPages: 2, maxResults: 50, maxWaitTime: 15 });
```

## Which method for which Claude task

| Goal | Method |
| --- | --- |
| Summarize / analyze one known page | `scrape` |
| Answer a question needing fresh web info | `search` (+ `scrapeOptions`) |
| Q&A / RAG over a whole docs site or section | `crawl` (async + webhook for big sites) |
| Find the right page before scraping | `map` |
| Process a fixed list of URLs | `batchScrape` |
| Pull fields from page(s) / a domain, JSON out | `extract` |
| Read a user-uploaded PDF/docx | `parse` |
| Site needs clicks / login / dynamic content | `scrape` with `actions`, or `interact` |
