# Search API (s.jina.ai)

Web search that returns SERP results **with page content already read** — one call instead of
search-then-scrape. `GET https://s.jina.ai/?q=<query>` or `POST https://s.jina.ai/` `{ q }`.
Requires `Authorization: Bearer jina_...` (keyless is disabled for search).

## Table of contents
- [Request](#request)
- [Search-specific options](#search-specific-options)
- [Shared CrawlerOptions](#shared-crawleroptions)
- [respondWith / content control](#respondwith--content-control)
- [Response](#response)

## Request

```ts
const H = { Authorization: `Bearer ${process.env.JINA_API_KEY}`, 'Content-Type': 'application/json' };

// POST (preferred — options as body fields)
const res = await fetch('https://s.jina.ai/', {
  method: 'POST',
  headers: { ...H, Accept: 'application/json' },
  body: JSON.stringify({ q: 'best vector databases 2026', type: 'web', num: 10, gl: 'US', hl: 'en' }),
}).then((r) => r.json());

// GET (quick — options as X-* headers; remember body field fooBar ⇄ header X-Foo-Bar)
await fetch('https://s.jina.ai/?q=' + encodeURIComponent('best vector databases 2026'), {
  headers: { ...H, Accept: 'application/json', 'X-Respond-With': 'no-content', 'X-Site': 'arxiv.org' },
});
```

`q` is the only required field. Default returns each result with its **full read content** (costs
tokens per page). For a cheap metadata-only SERP, set `X-Respond-With: no-content` (or `respondWith:
'no-content'`).

## Search-specific options

| Field (body) / `X-*` header | Values | Notes |
| --- | --- | --- |
| `q` | string | **Required.** Query (supports Google operators inline too). |
| `type` | `web` (default) · `images` · `news` | SERP vertical. |
| `num` / `count` | number | Number of results to return. |
| `page` | number | Pagination (page index). |
| `gl` | country code, e.g. `US` | Geolocation of the search. |
| `hl` | language code, e.g. `en` | UI/result language. |
| `location` | string | Fine-grained locale string. |
| `site` | domain | Restrict to a site (e.g. `docs.python.org`). |
| `ext` / `filetype` | e.g. `pdf` | File-type operator. |
| `intitle` | string | Require term in title. |
| `loc` | string | Location operator. |
| `provider` / `engine` | `google` (default) · `bing` · `reader` | SERP backend. |
| `fallback` | boolean | Fall back to another engine if primary returns nothing. |
| `nfpr` | boolean | Verbatim — disable auto-correction/synonyms. |

These map to `X-*` headers for GET requests: `X-Site`, `X-Gl`, `X-Hl`, `X-No-Cache`, etc.

## Shared CrawlerOptions

Because Search reads each result, **every Reader option also applies here** — selectors, JS-render
waits, image/link summaries, `respondWith`, caching, proxy, `instruction`+`jsonSchema` extraction.
See references/reader.md for the full set. Common ones for search: `X-Respond-With`,
`X-With-Links-Summary`, `X-Token-Budget` (cap per-result content), `X-No-Cache`, `X-Timeout`.

## respondWith / content control

`respondWith` (`X-Respond-With`) controls what each result's content looks like:
`content` (default, cleaned text) · `no-content` (metadata only, cheapest) · `markdown` · `html` ·
`text` · `screenshot` · `pageshot`. Pair with `X-Token-Budget` / `X-Max-Tokens` to bound size before
the results hit your LLM.

## Response

```jsonc
{
  "code": 200,
  "status": 20000,
  "data": [
    {
      "title": "...",
      "url": "https://...",
      "description": "...",        // SERP snippet
      "content": "...",            // full read content (omitted when respondWith=no-content)
      "usage": { "tokens": 1234 }
    }
    // ... num results
  ],
  "meta": { ... }
}
```

`data[].content` is the LLM-ready text — feed it straight to a reranker (references/rerank.md) or
Claude (references/claude-integration.md). Token usage is per result; the metadata-only mode avoids
paying to read pages you won't use.
