---
name: astro-integrations
description: Installs Astro UI framework renderers (React, Preact, Vue, Svelte, `solid-js`, Alpine) into the `integrations` array of `astro.config`. Use when adding a `.jsx`, `.tsx`, `.vue`, or `.svelte` component to an Astro site, hand-wiring a community renderer, or scoping `include` because two JSX renderers share one project.
license: MIT
metadata:
  author: Fusengine
  author_url: https://github.com/fusengine
  origin: https://github.com/fusengine/agents
---

# Astro integrations

## Work the project

1. Read the `integrations` array in `astro.config.*` and the `@astrojs/*` entries in `package.json`, then find where each framework's components live under `src/`. Done when you can name every framework already wired and its folder, or confirm none is.
2. Install through `astro add` per `astro-conventions`. Done when the CLI has updated `astro.config.*`, dependencies, and `tsconfig.json` — a JSX framework needs `jsx` and `jsxImportSource` set, which the CLI writes for you.
3. Load `consult-astro-docs` for that integration before passing it any option. Done when you have the current option names for the version installed.

## Official integrations

`@astrojs/react`, `@astrojs/vue`, `@astrojs/svelte`, `@astrojs/solid-js`, `@astrojs/preact`, `@astrojs/alpinejs`.

The CLI name is the short one: `astro add solid` installs `@astrojs/solid-js`, `astro add alpinejs` installs `@astrojs/alpinejs`.

Qwik, Angular, and the rest are community packages with no `astro add` support — install them with the project's package manager and add the integration to the config by hand.

Lit lost its integration in Astro 5. Import the element from a client `<script>` and use the custom element tag directly.

## Rendering

Framework components render to static HTML on the server and ship no JavaScript until you hydrate them. Load `astro-islands` for hydration.

Only `.astro` files can hold components from more than one framework. A `.jsx` file cannot import a `.vue` one.

## More than one framework

React, Preact, and SolidJS all compile JSX, so the moment two of them are installed each needs an `include` naming the files it owns. Vue and Svelte are matched by file extension and need nothing.

Load [multi-framework.md](references/multi-framework.md) before wiring a second JSX framework.
