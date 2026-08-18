# Platform cache

An on-demand route runs on every request unless the host caches it, so "regenerate this page every N minutes" is an adapter or CDN feature and nothing below ports between platforms.

## Vercel

`isr` on the adapter caches on-demand pages the way prerendered pages are cached.

- `isr: true` caches for the lifetime of the deployment, using Vercel's cache shielding. In this mode your own `Cache-Control` headers are ignored.
- `isr: { expiration: <seconds> }` sets a TTL and re-enables respect for `Cache-Control`.
- `isr: { bypassToken: '<secret>' }` enables on-demand invalidation: send a GET or HEAD to the page with the `x-prerender-revalidate` header set to the token. The same token drives draft mode through a `__prerender_bypass` cookie.
- `isr: { exclude: [...] }` keeps listed paths always fresh. Accepts route strings and regular expressions.

The trap: ISR function requests **do not carry search params**, the same as requests in static mode. A route that branches on `?query=` cannot be cached this way.

## Netlify

`cacheOnDemandPages: true` caches every on-demand page for up to a year. Override per page by setting a header during render:

```astro
---
Astro.response.headers.set('CDN-Cache-Control', 'public, max-age=45, must-revalidate');
---
```

Netlify honours fine-grained cache headers (`CDN-Cache-Control`, `Vary`), so TTL and stale-while-revalidate are expressed there rather than in adapter config.

## Cloudflare

No adapter cache option. Build it: the Workers `caches` API for whole responses keyed by request, or KV with an explicit key and `expirationTtl` for data. Both mean you own invalidation. KV reads are fast globally but writes are eventually consistent.

## Node

No platform cache at all. Put a CDN or reverse proxy in front and set `Cache-Control` on the response.

## Choosing

Reach for adapter-level caching (`isr`, `cacheOnDemandPages`) when the whole page is cacheable and the only variable is time. Reach for a manual cache (KV, Workers `caches`) when invalidation is event-driven — a CMS webhook, a write to your own data. When content changes rarely and predictably, prerendering plus a rebuild hook beats every cache above.

Any cached page is served to whoever asks next: keep cookie, session, and auth-dependent routes out of these caches.
