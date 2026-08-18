---
name: astro-islands
description: Hydrates Astro framework components with `client:*`, `server:defer`, and `transition:persist`. Use when choosing a hydration strategy, passing props into a hydrated component, deferring auth-gated or per-user content, or keeping a player or form alive across navigations.
license: MIT
metadata:
  author: Fusengine
  author_url: https://github.com/fusengine
  origin: https://github.com/fusengine/agents
---

# Astro islands

## Work the project

1. Search `src/` for `client:`, `server:defer`, `transition:persist`, and `ClientRouter`, then read `astro.config.*`. Done when you can name every directive already in use, the installed UI framework integrations, and whether an adapter is configured.
2. Load `consult-astro-docs` for each directive this task touches. Done when you have its current options.
3. If the component's framework has no integration yet, follow `astro-integrations` first. Done when that framework appears in `integrations` and the directive you write is one the project already uses, or you can say what the new component needs that the others do not.

## No directive is the default

A framework component with no `client:*` renders to HTML on the server and ships zero JS. Add a directive only for real interactivity. A directive takes effect on a framework component imported directly into a `.astro` file; a dynamic tag or a component handed to MDX through the `components` prop stays static, and an `.astro` component gets a `<script>` tag instead.

## Choosing a client directive

| Directive | Hydrates | Reach for |
|---|---|---|
| `client:load` | on page load | above-fold nav, search, buy button |
| `client:idle` | on `requestIdleCallback` | cookie banner, newsletter |
| `client:visible` | on `IntersectionObserver` | below-fold or expensive components |
| `client:media="(max-width: 50em)"` | when the query matches | a control that exists at one breakpoint only |
| `client:only="react"` | client only, no SSR | browser-API components — canvas, map, `localStorage` |

`client:idle={{timeout: 500}}` caps the wait. `client:visible={{rootMargin: "200px"}}` hydrates before the component reaches the viewport, cutting layout shift on slow connections. `client:only` requires the framework name (`react`, `preact`, `svelte`, `vue`, `solid-js`) and, since it never server-renders, accepts a `slot="fallback"` child as loading content.

## Props cross a serialization boundary

Astro serializes props into the page, so pass plain data: structured values cross (objects, arrays, `Map`, `Set`, `Date`, `RegExp`, `URL`, typed arrays), and functions survive the server render only. Compute browser state on the server and pass it down (`currentUrl={Astro.url.pathname}`) rather than reading `window` at mount, which mismatches the server HTML under every directive except `client:only`.

Children and named slots also cross: React, Preact, and Solid receive them as `children` and camelCased props; Svelte and Vue as `<slot name="…">`. Islands share no framework context — use nanostores for cross-island state.

## server:defer

`server:defer` on an `.astro` component splits it into its own on-demand route, fetched after the page renders, with `slot="fallback"` content shipped in its place. It needs an adapter. Reach for it for avatars, cart counts, prices, and auth-gated blocks on an otherwise cacheable page.

Load [server-islands.md](references/server-islands.md) before writing one — `Astro.url`, prop size, and caching all behave differently inside a server island.

## Persisting across navigation

`transition:persist` moves an island into the next page instead of remounting it. Load [view-transitions.md](references/view-transitions.md) for `<ClientRouter />` setup and the persist pitfalls.
