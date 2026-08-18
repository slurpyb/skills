---
name: astro-7
description: Configures Astro 7 routing, output modes, middleware, and upgrades from Astro 5 or 6. Use when choosing static or server output, adding middleware, creating pages or endpoints, or migrating to Astro 7.
license: MIT
metadata:
  author: Fusengine
  author_url: https://github.com/fusengine
  origin: https://github.com/fusengine/agents
---

# Astro 7

## Work the project

1. Read `package.json`, `astro.config.*`, `src/pages/`, and layouts. Done when you can name the installed Astro version and the current `output` from those files.
2. Load `consult-astro-docs` for the APIs this task will touch. On an upgrade, query the current v7 (and, from v5, v6) upgrade guide. Done when you have the current pattern for those keys.
3. Follow `astro-conventions` for scaffold and `astro add`. Implement against the version you found. Done when routes and config match that version.

## Output

Stay on `static` until most routes need request-time data. Then add an adapter and either set `export const prerender = false` on those routes, or switch `output` to `'server'` and `export const prerender = true` on the static exceptions.

`output` is `'static' | 'server'`. Per-route `prerender` is the mix — there is no `hybrid` key.

Load [output.md](references/output.md) when choosing a mode or converting a leftover `hybrid` config.

## Routing

`src/pages/` maps to URLs. Dynamic segments use `[param]` and `[...rest]`. Endpoints are `.ts` / `.js` files in that tree.

`src/fetch.ts` is reserved for advanced routing. If that file already exists for something else, set `fetchFile` (or `null`) in config.

## Middleware

Put auth, redirects, headers, and `locals` in `src/middleware.ts`. Load `consult-astro-docs` for `defineMiddleware` and `sequence`.

## Upgrade

Load [upgrade.md](references/upgrade.md) when migrating from Astro 5 or 6.
