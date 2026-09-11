---
name: unocss-astro
description: Exhaustive UnoCSS (v66) reference for building with the instant atomic-CSS engine inside Astro (v6) projects. Covers the engine pipeline, configuration (rules, variants, shortcuts, theme, safelist, layers, extractors, autocomplete), every official preset (Wind3/Wind4/Mini/Icons/Attributify/Typography/Web-Fonts/Tagify/Rem-to-Px), transformers and directives, tooling (Inspector/ESLint/IDE), runtime/CDN, migration from Tailwind — plus the Astro-specific layer: @unocss/astro setup, utility extraction across .astro/MDX/framework islands, content collections and prose, and token-backed theming with CSP-safe dark mode. Use when configuring UnoCSS in an Astro app, writing utilities/shortcuts/variants, choosing or tuning presets, wiring @unocss/astro, theming from design tokens, or debugging styles that don't appear in the build.
metadata:
  version: "66.x"
  framework: "astro@6"
  source: Constructed for the UnoCSS-in-Astro situation from the UnoCSS expert (unocss/unocss v66.7.0) + @unocss/astro source + house Astro standards.
---

# UnoCSS for Astro

UnoCSS is an instant, on-demand atomic CSS engine: an un-opinionated core where **every utility comes from a preset**, so it is a superset of Tailwind (reuse your Tailwind syntax via `presetWind4`) while staying fully customisable. This skill is a **UnoCSS reference first** — the engine and its full configuration surface — framed for use **inside an Astro project**.

## When to Use This Skill

Use this skill when you're:
- Setting up UnoCSS in an Astro project for the first time
- Configuring custom rules, shortcuts, or variants in `uno.config.ts`
- Debugging utilities that work in dev but disappear in production builds
- Migrating from Tailwind CSS to UnoCSS in an Astro app
- Working with framework islands (React/Vue/Svelte) and utility extraction
- Setting up token-backed theming with dark mode support
- Choosing between presets (Wind3 vs Wind4, Icons, Typography, etc.)
- Troubleshooting dynamic class names or `client:only` component styling
- Using advanced features like attributify mode, transformers, or runtime generation

## Quick Reference

### Basic Astro Setup

```bash
bun add -d unocss @unocss/astro @unocss/reset
```

```ts
// astro.config.ts
import { defineConfig } from 'astro/config'
import UnoCSS from 'unocss/astro'

export default defineConfig({
  integrations: [UnoCSS({ injectReset: true })]
})
```

```ts
// uno.config.ts
import { defineConfig, presetWind4, presetIcons, transformerDirectives } from 'unocss'

export default defineConfig({
  presets: [
    presetWind4(),
    presetIcons({ extraProperties: { display: 'inline-block' } })
  ],
  transformers: [transformerDirectives()],
})
```

### Custom Rules and Shortcuts

```ts
// uno.config.ts
export default defineConfig({
  rules: [
    ['m-1', { margin: '0.25rem' }],  // static rule
    [/^m-(\d+)$/, ([, d]) => ({ margin: `${d / 4}rem` })],  // dynamic rule
  ],
  shortcuts: [
    ['btn', 'py-2 px-4 font-semibold rounded-lg shadow-md'],  // static shortcut
    [/^btn-(.*)$/, ([, c]) => `bg-${c}-400 text-${c}-100 py-2 px-4 rounded-lg`],  // dynamic
  ],
})
```

### Token-Backed Theming

```css
/* src/styles/tokens.css */
:root {
  --color-ink-700: light-dark(#374151, #d1d5db);
  --color-accent-600: light-dark(#15803d, #22c55e);
  --color-surface: light-dark(#ffffff, #0b0f17);
}
```

```ts
// uno.config.ts
export default defineConfig({
  theme: {
    colors: {
      ink: { 700: 'var(--color-ink-700)' },
      accent: { 600: 'var(--color-accent-600)' },
      surface: 'var(--color-surface)',
    },
  },
})
```

### Icons and Typography

```ts
// uno.config.ts - Icons + Typography
export default defineConfig({
  presets: [
    presetWind4(),
    presetIcons(),
    presetTypography(),
  ],
})
```

```html
<!-- Pure CSS icons -->
<span class="i-carbon-information text-blue-500" />
<button class="i-carbon-sun dark:i-carbon-moon" />

<!-- Typography for markdown content -->
<article class="prose prose-emerald dark:prose-invert">
  <Content />
</article>
```

### Attributify Mode

```ts
// uno.config.ts
export default defineConfig({
  presets: [presetWind4(), presetAttributify()],
  transformers: [transformerAttributifyJsx()], // for JSX islands
})
```

```html
<!-- Instead of long class strings -->
<button
  bg="blue-400 hover:blue-500"
  text="sm white"
  p="y-2 x-4"
  border="2 rounded blue-200"
>
  Button
</button>
```

### Dynamic Classes (Safelist)

```ts
// uno.config.ts - Handle dynamic classes
export default defineConfig({
  safelist: [
    'text-emerald-600', 'text-rose-600',
    ...['sm','md','lg'].map(s => `p-${s === 'sm' ? 2 : 4}`),
  ],
})
```

```astro
<!-- ✓ Static mapping (extractable) -->
---
const statusClass = {
  required: 'bg-emerald-100 text-emerald-800',
  optional: 'bg-amber-100 text-amber-800',
} as const
---
<span class:list={['rounded-full px-2 py-0.5', statusClass[status]]} />
```

### CSS Directives

```ts
// uno.config.ts
export default defineConfig({
  transformers: [transformerDirectives()],
})
```

```astro
<!-- Use @apply in scoped styles -->
<style>
  .btn {
    @apply text-center my-0 font-medium rounded;
    color: theme('colors.blue.500');
  }
  
  @screen sm {
    .btn { @apply px-6; }
  }
</style>
```

### Dark Mode Setup

```ts
// uno.config.ts
export default defineConfig({
  presets: [presetWind4({ 
    dark: { dark: '[data-theme="dark"]', light: '[data-theme="light"]' }
  })],
})
```

```astro
<!-- CSP-safe theme toggle -->
<script is:inline>
  try {
    var t = localStorage.getItem('theme') ||
      (matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
    document.documentElement.setAttribute('data-theme', t);
  } catch (e) {}
</script>
```

## Key Concepts

### Extraction Model
UnoCSS generates CSS by **statically scanning source text** at build time. Classes must appear as complete literal strings in your code or be added to the safelist. Dynamic class construction (`text-${color}`) won't work without explicit handling.

### Preset System
UnoCSS ships **no default utilities** — everything comes from presets. `presetWind4()` provides Tailwind v4 compatibility (use `presetWind3()` for Tailwind v3), while `presetMini()` offers just essentials. Always include at least one preset.

### Layer System
CSS output is organized into layers (`preflights`, `default`, `shortcuts`, `utilities`) that control cascade order. Later layers override earlier ones.

### Framework Islands
In Astro, utilities in React/Vue/Svelte islands are extracted automatically if the component files live in `src/components/`. `client:only` components need special attention.

## Reference Files

### Astro-Specific Integration
- **[integrations-astro](references/integrations-astro.md)** - `@unocss/astro` setup, options, and how it wires into Astro's pipeline
- **[astro-islands-and-extraction](references/astro-islands-and-extraction.md)** - Utility extraction across `.astro` + framework islands, `client:only` gotchas
- **[astro-content-and-prose](references/astro-content-and-prose.md)** - Markdown/MDX, content collections, `presetTypography` for prose
- **[astro-theming-tokens](references/astro-theming-tokens.md)** - Token-backed theming with `light-dark()` and CSP-safe dark mode

### Core Engine & Configuration
- **[core-architecture](references/core-architecture.md)** - Engine pipeline, `createGenerator` API, core abstractions
- **[core-config](references/core-config.md)** - Config file setup and all configuration options
- **[core-rules](references/core-rules.md)** - Static and dynamic rules for generating CSS utilities
- **[core-shortcuts](references/core-shortcuts.md)** - Combine multiple rules into single shorthands
- **[core-theme](references/core-theme.md)** - Theming system for colors, breakpoints, design tokens
- **[core-variants](references/core-variants.md)** - Apply variations like `hover:`, `dark:`, responsive
- **[core-extracting](references/core-extracting.md)** - How UnoCSS extracts utilities from source code
- **[core-extractors](references/core-extractors.md)** - Configuring extractors (default, Pug, MDC, Svelte, arbitrary-variants)
- **[core-safelist](references/core-safelist.md)** - Force include or exclude specific utilities
- **[core-layers](references/core-layers.md)** - CSS layer ordering and raw CSS injection
- **[core-autocomplete](references/core-autocomplete.md)** - Autocomplete configuration and templates

### Official Presets
- **[preset-wind3](references/preset-wind3.md)** - Tailwind v3 / Windi CSS compatible preset (most common)
- **[preset-wind4](references/preset-wind4.md)** - Tailwind v4 compatible with modern CSS features
- **[preset-mini](references/preset-mini.md)** - Minimal preset with essential utilities
- **[preset-icons](references/preset-icons.md)** - Pure-CSS icons using Iconify
- **[preset-attributify](references/preset-attributify.md)** - Group utilities in HTML attributes
- **[preset-typography](references/preset-typography.md)** - `prose` classes for typographic defaults
- **[preset-web-fonts](references/preset-web-fonts.md)** - Easy Google Fonts integration
- **[preset-tagify](references/preset-tagify.md)** - Use utilities as HTML tag names
- **[preset-rem-to-px](references/preset-rem-to-px.md)** - Convert rem units to px

### Transformers
- **[transformer-directives](references/transformer-directives.md)** - `@apply`, `@screen`, `theme()` in CSS
- **[transformer-variant-group](references/transformer-variant-group.md)** - Shorthand for grouping utilities
- **[transformer-compile-class](references/transformer-compile-class.md)** - Compile multiple classes into one hashed class
- **[transformer-attributify-jsx](references/transformer-attributify-jsx.md)** - Support valueless attributify in JSX

### Tooling & Migration
- **[tooling-inspector-ide](references/tooling-inspector-ide.md)** - UnoCSS Inspector, VS Code extension, ESLint
- **[runtime-cdn](references/runtime-cdn.md)** - `@unocss/runtime` for browser usage
- **[migration-from-tailwind](references/migration-from-tailwind.md)** - Move from Tailwind to UnoCSS
- **[gotchas-and-pitfalls](references/gotchas-and-pitfalls.md)** - Common mistakes and fixes

### Other Integrations
- **[integrations-vite](references/integrations-vite.md)** - Generic Vite setup
- **[integrations-nuxt](references/integrations-nuxt.md)** - UnoCSS module for Nuxt
- **[recipes](references/recipes.md)** - Task-oriented cookbook

## Working with This Skill

1. **Start with the basics**: Check [integrations-astro](references/integrations-astro.md) for setup, then [astro-islands-and-extraction](references/astro-islands-and-extraction.md) for how extraction works across your components.

2. **When styles don't appear**: First check [gotchas-and-pitfalls](references/gotchas-and-pitfalls.md) for the most common issues (dynamic classes, extraction misses, layer conflicts).

3. **For custom styling**: Use [core-rules](references/core-rules.md) for one-off utilities, [core-shortcuts](references/core-shortcuts.md) for reusable combinations, and [core-theme](references/core-theme.md) for design tokens.

4. **For specific features**: Each preset has its own reference file with complete options and examples. Start with [preset-wind3](references/preset-wind3.md) for Tailwind compatibility.

5. **For advanced workflows**: Check [transformer-directives](references/transformer-directives.md) for `@apply` support, [preset-attributify](references/preset-attributify.md) for attribute-based utilities, and [tooling-inspector-ide](references/tooling-inspector-ide.md) for debugging tools.

> **Always inspect first**: Open `uno.config.*` and `astro.config.*` to see which presets, rules, and transformers are configured before writing utilities. Use the Inspector at `/__unocss` during development to debug extraction and rule matching.