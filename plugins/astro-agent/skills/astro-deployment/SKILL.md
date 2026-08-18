---
name: astro-deployment
description: Configures Astro deploy adapters for Cloudflare Workers, Vercel, Netlify, and Node. Use when adding or switching an adapter, wiring platform bindings, running middleware at the edge, caching on-demand pages, or fixing a failing deploy build.
license: MIT
metadata:
  author: Fusengine
  author_url: https://github.com/fusengine
  origin: https://github.com/fusengine/agents
---

# Astro deployment

## Work the project

1. Read `package.json` and `astro.config.*`. Done when you can name the installed adapter (or its absence), its version, and the current `output`.
2. Load `consult-astro-docs` and query the integration page for **that** adapter. Adapter options churn every major, and each adapter is pinned to an Astro major. Done when every option key this task will write is confirmed against current docs.
3. Install or switch adapters with `astro add <adapter>` per `astro-conventions`. Done when `astro build` completes and a local preview serves an on-demand route.

## Which adapter

An adapter is earned by the first route that renders on demand. Output mode and per-route `prerender` belong to skill `astro-7`; `server:defer` server islands also require an adapter, see skill `astro-islands`.

- **Cloudflare** — `@astrojs/cloudflare`. Workers only; Cloudflare Pages is no longer supported. `astro dev` and `astro preview` run on `workerd`. Load [cloudflare-runtime.md](references/cloudflare-runtime.md).
- **Vercel** — `@astrojs/vercel`. Serverless functions, Vercel Image Optimization, `skewProtection` for Pro/Enterprise.
- **Netlify** — `@astrojs/netlify`. Functions plus Edge Functions. Netlify Image CDN and skew protection are on by default.
- **Node** — `@astrojs/node`. `mode: 'standalone'` boots its own server and serves `dist/client/`; `mode: 'middleware'` exports a `handler` you mount in Express or Fastify and serves no files itself.

## Edge middleware

`src/middleware.ts` runs at build time for prerendered pages and per request for on-demand pages. To run it on every request — static assets and prerendered pages included — set `middlewareMode: 'edge'` on the Vercel or Netlify adapter. Platform request context then arrives as `Astro.locals.vercel.edge` or `Astro.locals.netlify.context`.

## Headers on prerendered pages

Astro-generated headers such as Content Security Policy only reach prerendered pages when the adapter writes them into platform config. Set `staticHeaders: true` on Vercel, Netlify, or Node alongside `security.csp`.

## Cache

Astro has no ISR of its own — every revalidation story is the platform's. Load [platform-cache.md](references/platform-cache.md) before promising freshness behaviour.
