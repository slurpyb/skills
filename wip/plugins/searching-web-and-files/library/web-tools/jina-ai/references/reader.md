# Reader API (r.jina.ai)

Turn any URL into clean, LLM-ready content. `GET https://r.jina.ai/<URL>` or `POST https://r.jina.ai/`
`{ url }`. Keyless free tier exists; pass `Authorization: Bearer jina_...` for production limits.

## Table of contents
- [Request & response](#request--response)
- [respondWith — output format](#respondwith--output-format)
- [Page targeting & JS rendering](#page-targeting--js-rendering)
- [Content shaping](#content-shaping)
- [LLM extraction (instruction + jsonSchema)](#llm-extraction-instruction--jsonschema)
- [Caching, proxy, fetch engine](#caching-proxy-fetch-engine)
- [Header ⇄ body field map](#header--body-field-map)

## Request & response

```ts
const H = { Authorization: `Bearer ${process.env.JINA_API_KEY}` };

// GET, JSON response
const out = await fetch('https://r.jina.ai/https://example.com', {
  headers: { ...H, Accept: 'application/json', 'X-Respond-With': 'content' },
}).then((r) => r.json());

// POST equivalent
await fetch('https://r.jina.ai/', {
  method: 'POST',
  headers: { ...H, 'Content-Type': 'application/json', Accept: 'application/json' },
  body: JSON.stringify({ url: 'https://example.com', respondWith: 'content' }),
});
```

Response with `Accept: application/json` (without it you get raw markdown text):

```jsonc
{
  "code": 200,
  "status": 20000,
  "data": {
    "title": "Example Domain",
    "description": "...",
    "url": "https://example.com/",
    "content": "This domain is for use in documentation examples...",
    "publishedTime": "...",
    "links": { "Learn more": "https://www.iana.org/..." },  // when withLinksSummary
    "images": { "img1": "https://..." },                     // when withImagesSummary
    "usage": { "tokens": 42 }
  },
  "meta": { ... }
}
```

## respondWith — output format

`respondWith` / `X-Respond-With` (default `content`):

| Value | Output |
| --- | --- |
| `content` | Cleaned main content (default) |
| `markdown` | Full markdown conversion |
| `html` | Cleaned HTML |
| `text` | Plain text |
| `screenshot` | First-screen PNG URL |
| `pageshot` | Full-page PNG URL |
| `readerlm-v2` | HTML→markdown via the ReaderLM-v2 SLM (best for messy/complex pages) |
| `frontmatter` | Metadata only |

## Page targeting & JS rendering

| Field / header | Purpose |
| --- | --- |
| `targetSelector` / `X-Target-Selector` | CSS selector(s) to extract only that region |
| `waitForSelector` / `X-Wait-For-Selector` | Wait until a selector appears (SPA render) |
| `removeSelector` / `X-Remove-Selector` | Strip elements (nav, ads, cookie banners) before conversion |
| `removeOverlay` / `X-Remove-Overlay` | Auto-dismiss popups/overlays |
| `timeout` / `X-Timeout` | Max seconds to wait for the page |
| `withIframe` / `withShadowDom` | Include iframe / shadow-DOM content |
| `engine` / `X-Engine` | Switch the fetch/render engine when the default returns empty |

For pages that won't render, escalate: `X-Wait-For-Selector` → `X-Timeout` higher → `X-Respond-With:
readerlm-v2` → switch `X-Engine`.

## Content shaping

| Field / header | Default | Values |
| --- | --- | --- |
| `withLinksSummary` / `X-With-Links-Summary` | off | `true` → collect all links into `data.links` (`all`/`true`) |
| `withImagesSummary` / `X-With-Images-Summary` | off | `true` → collect images into `data.images` |
| `withGeneratedAlt` / `X-With-Generated-Alt` | off | caption images that lack alt text |
| `retainImages` / `X-Retain-Images` | `all` | `none` · `all` · `alt` · `all_p` · `alt_p` |
| `retainLinks` / `X-Retain-Links` | `all` | `none` · `all` · `text` |
| `retainMedia` / `X-Retain-Media` | `link` | `none` · `text` · `link` · `image` · `html` |
| `tokenBudget` / `X-Token-Budget` | — | hard cap on output tokens |
| `maxTokens` / `X-Max-Tokens` | — | cap content length |
| `markdownChunking` / `X-Markdown-Chunking` | — | split output into chunks |
| `base` / `X-Base` | `initial` | `initial` (raw HTML) · `final` (post-JS DOM) |

Reader also exposes markdown formatting controls (`X-Md-Heading-Style`, `X-Md-Bullet-List-Marker`,
`X-Md-Link-Style`, `X-Md-Em-Delimiter`, etc.) — rarely needed; reach for them only to match a target
markdown dialect.

## LLM extraction (instruction + jsonSchema)

Reader can extract structured data during the read — no separate LLM call:

```ts
await fetch('https://r.jina.ai/', {
  method: 'POST',
  headers: { ...H, 'Content-Type': 'application/json', Accept: 'application/json' },
  body: JSON.stringify({
    url: 'https://news.ycombinator.com',
    instruction: 'Extract the top 5 story titles and their points',
    jsonSchema: {
      type: 'object',
      properties: { stories: { type: 'array', items: {
        type: 'object', properties: { title: { type: 'string' }, points: { type: 'number' } } } } },
    },
  }),
});
```

Use this when the whole task is "pull fields from a page." For extraction inside a Claude
conversation (or transformation/judgement), read to markdown and let Claude extract
(references/claude-integration.md).

## Caching, proxy, fetch engine

| Field / header | Purpose |
| --- | --- |
| `noCache` / `X-No-Cache` | `true` bypasses cache (force fresh fetch) |
| `cacheTolerance` / `X-Cache-Tolerance` | max cache age in seconds |
| `proxy` / `X-Proxy` | `auto` and friends — route through a proxy for geo/blocked sites |
| `proxyUrl` / `X-Proxy-Url` | use your own proxy |
| `setCookies` / `X-Set-Cookies` | send cookies (auth'd pages) |
| `userAgent` / `X-User-Agent`, `referer` / `X-Referer` | spoof UA / referer |
| `robotsTxt` / `X-Robots-Txt` | obey a named robots policy |
| `locale` / `X-Locale` | browser locale |

Caching is **on by default** — repeated reads of the same URL are cheap; only set `X-No-Cache` when
freshness matters.

## Header ⇄ body field map

Every POST body field has a GET header twin: camelCase `fooBar` ⇄ `X-Foo-Bar`. Examples:
`respondWith`→`X-Respond-With`, `targetSelector`→`X-Target-Selector`, `withLinksSummary`→
`X-With-Links-Summary`, `tokenBudget`→`X-Token-Budget`, `noCache`→`X-No-Cache`. Prefer POST when the
URL or values contain characters awkward to put in a prefixed URL or header.
