# Server islands

This file is the gotchas, not the API.

## An adapter, or the build fails

`server:defer` without an adapter fails the build with `NoAdapterInstalledServerIslands`. Adding one is `astro-deployment` territory. The page holding the island can stay prerendered — only the island renders on demand.

## The island does not know the page

A server island runs in its own request, outside the page's. `Astro.url` and `Astro.request.url` resolve to `/_server-islands/<Name>`, never the browser URL, and a prerendered host page has no query params to hand down. Read the `Referer` header:

```astro
---
const referer = Astro.request.headers.get('Referer');
if (!referer) throw new Error('Referer header is missing');
const productId = new URL(referer).searchParams.get('product');
---
```

## Props ride in the URL, encrypted

Props go out as an encrypted query string on a `GET`, which is what lets you cache an island with `Cache-Control`. Past the browser's ~2048-byte URL limit Astro switches to `POST`, and browsers never cache `POST` — the caching silently disappears. Pass ids, not whole objects or arrays.

Props serialize as they do for a client island, with circular objects failing too.

## Rolling deploys need a fixed key

That encryption key is regenerated on every build. Under rolling deploys, multi-region hosting, or a CDN still serving pages built with an older key, the front end and back end end up on different keys and decryption fails. Generate a reusable one with `astro create-key` and set it as `ASTRO_KEY` in the build environment.

## Fallback content

`slot="fallback"` renders with the page and is replaced when the island arrives. Give it the same shape as the real content — a generic avatar, a spinner, a placeholder price — so the swap does not shift layout.

## Render normally instead when

The content must be in the initial HTML for SEO, or it never changes. Server islands buy nothing there.
