# Astro Integration (`@unocss/astro`)

The official UnoCSS integration for [Astro](https://astro.build/) (Astro 6.x). It wraps the
`@unocss/vite` plugin, wires UnoCSS into Astro's Vite pipeline, and injects the generated
`uno.css` into every page. Import path: **`unocss/astro`**.

> **Inspect first.** Before writing utilities in an Astro project, open `astro.config.*` and
> `uno.config.*` to see which integration options, presets, and shortcuts are configured. The
> integration ships **no default presets** — if `uno.config.ts` has no preset, no utilities exist.

## Install

```bash [bun]
bun add -d unocss @unocss/astro
```

`unocss/astro` re-exports `@unocss/astro`, so depending on `unocss` is enough; add `@unocss/astro`
explicitly if you import it directly. For the browser reset, also add `@unocss/reset`.

## Minimal setup

```ts [astro.config.ts]
import { defineConfig } from 'astro/config'
import UnoCSS from 'unocss/astro'

export default defineConfig({
  integrations: [
    UnoCSS({ injectReset: true }), // injects @unocss/reset/tailwind.css
  ],
})
```

```ts [uno.config.ts]
import { defineConfig, presetWind4, presetIcons, transformerDirectives } from 'unocss'

export default defineConfig({
  presets: [
    presetWind4(),          // Tailwind v4-compatible utilities (REQUIRED — no default preset)
    presetIcons({ extraProperties: { display: 'inline-block', 'vertical-align': 'middle' } }),
  ],
  transformers: [transformerDirectives()], // enables @apply / theme() in <style>
})
```

That's it — write utilities in any `.astro`, `.md`/`.mdx`, or framework component:

```astro [src/pages/index.astro]
<h1 class="text-3xl font-bold text-emerald-600 hover:underline">Hello UnoCSS</h1>
<div class="i-logos-astro w-16 h-16" />
```

## Integration options (`AstroIntegrationConfig`)

The options object **extends `VitePluginConfig`** — every `@unocss/vite` option (`presets`,
`rules`, `shortcuts`, `theme`, `transformers`, `content`, `extractors`, `safelist`, …) is valid
inline — plus three Astro-specific keys:

| Option | Type | Default | Purpose |
|--------|------|---------|---------|
| `injectReset` | `string \| boolean` | `false` | `true` → injects `@unocss/reset/tailwind.css`; a string is treated as a path to your own reset. |
| `injectEntry` | `boolean \| string` | `true` | Injects `import "uno.css"` on every page. A string replaces the import (e.g. your own entry CSS). `false` → you import `uno.css` yourself. |
| `injectExtra` | `string[]` | `[]` | Extra `import` statements injected on every page (e.g. additional global stylesheets). |

> You can configure UnoCSS **inline** in `astro.config.ts` OR in a separate `uno.config.ts`.
> A standalone `uno.config.ts` is preferred — the UnoCSS VS Code extension, ESLint config, and CLI
> all read it. Keep one home for config; don't split presets across both files.

```ts [astro.config.ts — inline config (alternative to uno.config.ts)]
import { defineConfig } from 'astro/config'
import UnoCSS from 'unocss/astro'
import { presetWind4 } from 'unocss'

export default defineConfig({
  integrations: [
    UnoCSS({
      presets: [presetWind4()],
      injectReset: true,
      injectExtra: ['import "@/styles/tokens.css"'],
    }),
  ],
})
```

## How it wires up (so the gotchas make sense)

On `astro:config:setup` the integration:

1. Adds `src/components/**/*` to UnoCSS `content.filesystem` — so components are always scanned.
2. Builds the inject list from `injectReset` → `injectEntry` → `injectExtra`.
3. Registers the UnoCSS Vite plugin (`enforce: 'pre'`) ahead of Astro's pipeline.
4. `injectScript('page-ssr', 'import "uno-astro"')` so the injected imports load per page.

The practical consequence: anything **outside `src/components/`** that is hydrated in isolation —
notably **`client:only` islands** — may not be scanned by default. See
**astro-islands-and-extraction** (in the `unocss-astro-usage` skill).

## Style reset

The reset is **not** injected by default. Enable it with `injectReset: true` (uses
`@unocss/reset/tailwind.css`), or point it at another reset:

```ts [astro.config.ts]
UnoCSS({ injectReset: '@unocss/reset/tailwind-compat.css' })
```

Available resets in `@unocss/reset`: `tailwind.css`, `tailwind-compat.css`, `normalize.css`,
`sanitize/*.css`, `eric-meyer.css`. See [core-config](core-config.md) for non-Astro setups.

## Where to go next

- Utilities across `.astro` + React/Vue/Svelte/Solid islands, and the extraction model →
  **astro-islands-and-extraction** (in the `unocss-astro-usage` skill)
- Markdown/MDX, content collections, and prose → **astro-content-and-prose** (in the `unocss-astro-usage` skill)
- Token-backed theming + CSP-safe dark mode → [astro-theming-tokens](astro-theming-tokens.md)
- Generic (non-Astro) Vite setup → [integrations-vite](integrations-vite.md)
