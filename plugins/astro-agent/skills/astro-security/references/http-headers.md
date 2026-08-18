# CSP as a response header

A `<meta>` element is parsed with the document; a response header applies before parsing starts. Prefer the header where the adapter can write one.

## The switch

`staticHeaders: true` on the adapter, alongside `security.csp`:

```js
// astro.config.mjs
import { defineConfig } from 'astro/config';
import vercel from '@astrojs/vercel';

export default defineConfig({
  security: { csp: true },
  adapter: vercel({ staticHeaders: true }),
});
```

Available on `@astrojs/vercel` 10+, `@astrojs/netlify` 7+, and `@astrojs/node` 10+. Vercel and Netlify write the headers into platform config (`vercel.json`, the Netlify Framework API config); Node serves them from its own `Response`. Confirm the option against the adapter's integration page through `consult-astro-docs` before writing it — adapter options are pinned to an Astro major, and an adapter without this feature is a live possibility. Adapter choice and installation belong to `astro-deployment`.

## The gotcha

`staticHeaders` is an either-or, not an addition: with it enabled, Astro stops injecting the `<meta>` element into prerendered pages and hands the policy to the adapter as a `routeToHeaders` map instead. An adapter that does not consume that map leaves the page with no CSP at all, and the build still succeeds.

So verify the header reached production rather than trusting the build:

```bash
curl -sI https://example.com | grep -i content-security-policy
```

An empty result on a page you expected to be protected means the map was dropped. Check the platform config the adapter wrote to see whether the route is listed at all.

## Scope

`staticHeaders` covers prerendered pages, which is exactly the set that has no request to attach headers to. On-demand routes set their own headers through `Astro.response.headers` in middleware — add to that `Headers` instance rather than replacing it.

## Very large static sites

Per-route header entries grow with the page count, and platforms cap their config file size. Where a build hits that cap, check the adapter's current options for a global or catch-all CSP setting through `consult-astro-docs`; failing that, fall back to the `<meta>` element, which carries no per-route config cost.
