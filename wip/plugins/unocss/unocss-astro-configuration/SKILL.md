---
name: unocss-astro-configuration
description: Wires UnoCSS (v66) into Astro (v6) — setup reference. Covers @unocss/astro integration (injectReset/injectEntry/injectExtra, scanned content sources), uno.config.ts structure, theme system with light-dark() and [data-theme] dark mode, safelist, CSS @layer cascade, extractor config (Pug/MDC/Svelte/arbitrary-variants), autocomplete, transformers (directives/@apply, variant-group, compile-class, attributify-jsx), dev tooling (Inspector /__unocss, VS Code, ESLint), browser runtime/CDN, Vite + Nuxt integrations. Use when installing or wiring UnoCSS into Astro, structuring uno.config.ts, defining theme tokens, setting up dark mode, controlling scanned files, enabling a transformer, or configuring tooling. NOT for preset utility use (see unocss-astro-usage); NOT for custom rules/variants/shortcuts (see unocss-astro-extending). Triggers: unocss astro install, uno.config.ts, @unocss/astro, light-dark unocss, safelist, @layer, inspector, attributify-jsx, variant-group, compile-class, unocss vite, unocss nuxt.
metadata:
  version: "66.x"
  framework: "astro@6"
  slice: configuration
  companions: "unocss-astro-usage, unocss-astro-extending"
  source: Constructed for the UnoCSS-in-Astro situation from the UnoCSS expert (unocss/unocss v66.7.0) + @unocss/astro source + house Astro standards.
---

# UnoCSS for Astro — Configuration

UnoCSS is an instant, on-demand atomic CSS engine with **no default utilities** — everything comes
from presets and config. This skill is the **configuration surface**: how to plug UnoCSS into an
Astro project and tune every engine knob, *without* authoring new utility logic.

> **Companion skills** (this is one of three):
> - **`unocss-astro-usage`** — writing styles: preset vocabularies, the extraction model, islands/MDX/content, recipes, migration, gotchas.
> - **`unocss-astro-extending`** — authoring custom engine behaviour: rules, variants, shortcuts, the generator architecture.

## When to Use This Skill

- Installing UnoCSS in an Astro project and wiring `@unocss/astro`
- Structuring `uno.config.ts` (presets, theme, transformers, content, safelist)
- Defining design tokens and pointing the UnoCSS `theme` at them
- Setting up dark mode (`media` vs attribute/`[data-theme]`) and CSP-safe theme init
- Controlling which files are scanned (`content.filesystem`, extractors)
- Enabling an official transformer (`@apply`/`theme()`, variant-group, compile-class, attributify-jsx)
- Setting up the Inspector, VS Code extension, or ESLint
- Shipping via the browser runtime/CDN, or configuring the generic Vite/Nuxt integration

## Quick Reference

### Install + wire into Astro

```bash
bun add -d unocss @unocss/astro @unocss/reset
```

```ts
// astro.config.ts
import { defineConfig } from 'astro/config'
import UnoCSS from 'unocss/astro'

export default defineConfig({
  integrations: [UnoCSS({ injectReset: true })], // injects @unocss/reset/tailwind.css
})
```

```ts
// uno.config.ts — one home for engine config (read by the integration, IDE, ESLint, CLI)
import { defineConfig, presetWind4, presetIcons, transformerDirectives } from 'unocss'

export default defineConfig({
  presets: [
    presetWind4(),                              // REQUIRED — no default preset, no utilities without one
    presetIcons({ extraProperties: { display: 'inline-block' } }),
  ],
  transformers: [transformerDirectives()],      // enables @apply / theme() in <style>
})
```

### `@unocss/astro` integration options

| Option | Type | Default | Purpose |
|--------|------|---------|---------|
| `injectReset` | `string \| boolean` | `false` | `true` → `@unocss/reset/tailwind.css`; a string is a path to your own reset |
| `injectEntry` | `boolean \| string` | `true` | Injects `import "uno.css"` per page; a string replaces it; `false` → import it yourself |
| `injectExtra` | `string[]` | `[]` | Extra `import` statements injected per page (e.g. global token CSS) |

The options object **extends `VitePluginConfig`** — every `@unocss/vite` option (`presets`, `rules`,
`shortcuts`, `theme`, `transformers`, `content`, `extractors`, `safelist`) is valid inline too. The
integration auto-adds `src/components/**/*` to `content.filesystem`.

### Token-backed theming + dark mode

```css
/* src/styles/tokens.css */
:root {
  --color-ink-700: light-dark(#374151, #d1d5db);
  --color-accent-600: light-dark(#15803d, #22c55e);
  --color-surface: light-dark(#ffffff, #0b0f17);
}
:root[data-theme='light'] { color-scheme: light; }
:root[data-theme='dark']  { color-scheme: dark; }
```

```ts
// uno.config.ts — point the theme at the tokens; attribute-driven dark variant
import { defineConfig, presetWind4 } from 'unocss'
export default defineConfig({
  presets: [presetWind4({ dark: { dark: '[data-theme="dark"]', light: '[data-theme="light"]' } })],
  theme: {
    colors: { ink: { 700: 'var(--color-ink-700)' }, accent: { 600: 'var(--color-accent-600)' }, surface: 'var(--color-surface)' },
  },
})
```

### Safelist (force-include classes the extractor can't see)

```ts
export default defineConfig({
  safelist: ['text-emerald-600', 'text-rose-600', ...['sm','md','lg'].map((s) => `p-${s === 'sm' ? 2 : 4}`)],
})
```

### Enable a transformer

```ts
import { defineConfig, presetWind4, transformerDirectives, transformerVariantGroup } from 'unocss'
export default defineConfig({
  presets: [presetWind4()],
  transformers: [transformerDirectives(), transformerVariantGroup()],
})
```

## Reference Files

### Astro setup & theming
- **[integrations-astro](references/integrations-astro.md)** — `@unocss/astro` setup, options, and how it wires into Astro's Vite pipeline
- **[astro-theming-tokens](references/astro-theming-tokens.md)** — token-backed theming with `light-dark()`, `[data-theme]`, and CSP-safe dark mode

### Engine configuration
- **[core-config](references/core-config.md)** — config file setup and all configuration options
- **[core-theme](references/core-theme.md)** — theming system for colours, breakpoints, design tokens
- **[core-safelist](references/core-safelist.md)** — force-include or exclude specific utilities
- **[core-layers](references/core-layers.md)** — CSS layer ordering and raw CSS injection
- **[core-extractors](references/core-extractors.md)** — configuring extractors (default, Pug, MDC, Svelte, arbitrary-variants)
- **[core-autocomplete](references/core-autocomplete.md)** — autocomplete configuration and templates

### Transformers (enable & configure)
- **[transformer-directives](references/transformer-directives.md)** — `@apply`, `@screen`, `theme()` in CSS
- **[transformer-variant-group](references/transformer-variant-group.md)** — shorthand for grouping utilities
- **[transformer-compile-class](references/transformer-compile-class.md)** — compile multiple classes into one hashed class
- **[transformer-attributify-jsx](references/transformer-attributify-jsx.md)** — support valueless attributify in JSX islands

### Tooling, runtime & other integrations
- **[tooling-inspector-ide](references/tooling-inspector-ide.md)** — UnoCSS Inspector, VS Code extension, ESLint
- **[runtime-cdn](references/runtime-cdn.md)** — `@unocss/runtime` for browser/CDN usage
- **[integrations-vite](references/integrations-vite.md)** — generic Vite setup
- **[integrations-nuxt](references/integrations-nuxt.md)** — UnoCSS module for Nuxt

> **Always inspect first.** Before changing config, open the existing `uno.config.*` and
> `astro.config.*` to see which presets, transformers, and content sources are already set. The
> Inspector at `/__unocss` (dev) shows what is actually being generated.
