---
name: unocss-astro-extending
description: Extend the UnoCSS (v66) engine with your own utility logic in an Astro (v6) project — the authoring reference. Covers the engine architecture and the createGenerator pipeline you build against, writing static and dynamic rules (regex matchers, body functions returning CSS objects or strings, ordering and meta), authoring custom variants (hover/dark/responsive-style modifiers and parametric variants that rewrite selectors), and defining shortcuts that fold many utilities into reusable named classes — the building blocks of a project-specific design-system vocabulary. Use when the official presets don't cover a utility you need, when designing a bespoke utility or shortcut vocabulary in uno.config.ts, or when you need to understand the generator internals to write rules, variants, or shortcuts correctly. For installation and uno.config.ts configuration see the unocss-astro-configuration skill; for using the built-in preset utilities day-to-day see the unocss-astro-usage skill.
metadata:
  version: "66.x"
  framework: "astro@6"
  slice: extending
  companions: "unocss-astro-configuration, unocss-astro-usage"
  source: Constructed for the UnoCSS-in-Astro situation from the UnoCSS expert (unocss/unocss v66.7.0) + @unocss/astro source + house Astro standards.
---

# UnoCSS for Astro — Extending the Engine

UnoCSS's core is un-opinionated: presets are just bundles of **rules**, **variants**, and
**shortcuts**. This skill is about **authoring your own** — extending the engine with utility logic
the official presets don't provide, to build a project-specific design-system vocabulary in
`uno.config.ts`.

> **Companion skills** (this is one of three):
> - **`unocss-astro-configuration`** — installing/wiring `@unocss/astro`, `uno.config.ts`, theme, dark mode, transformers, tooling.
> - **`unocss-astro-usage`** — using the built-in preset utilities, the extraction model, islands/MDX/content.

## When to Use This Skill

- The presets don't cover a utility you need — you want a new `rule`
- You're designing a bespoke utility or shortcut vocabulary for a design system
- You need a custom `variant` (a new modifier, or one that rewrites the selector)
- You're folding repeated utility combinations into named `shortcuts`
- You need to understand the generator (`createGenerator`) to write the above correctly

> **The abstraction gate.** Reach for the built-in presets and `theme` first; reach for a `shortcut`
> when you repeat a combination; reach for a custom `rule`/`variant` only when no preset expresses it.
> Don't author engine logic you'd get for free from `presetWind4` + tokens.

## Quick Reference

### Custom rules (static + dynamic)

```ts
// uno.config.ts
import { defineConfig } from 'unocss'

export default defineConfig({
  rules: [
    // static: exact match
    ['m-1', { margin: '0.25rem' }],
    // dynamic: regex capture → CSS object
    [/^m-(\d+)$/, ([, d]) => ({ margin: `${Number(d) / 4}rem` })],
    // dynamic: pull from theme
    [/^text-(.+)$/, ([, c], { theme }) => theme.colors?.[c] && { color: theme.colors[c] }],
  ],
})
```

### Shortcuts (fold utilities into one name)

```ts
export default defineConfig({
  shortcuts: [
    ['btn', 'py-2 px-4 font-semibold rounded-lg shadow-md'],            // static
    [/^btn-(.*)$/, ([, c]) => `bg-${c}-500 text-${c}-50 py-2 px-4 rounded-lg`], // dynamic
  ],
})
```

### Custom variants (modify selector / wrap output)

```ts
export default defineConfig({
  variants: [
    // a parametric variant: `hocus:` → :hover and :focus
    (matcher) => {
      if (!matcher.startsWith('hocus:')) return matcher
      return {
        matcher: matcher.slice(6),
        selector: (s) => `${s}:hover, ${s}:focus`,
      }
    },
  ],
})
```

### The generator you build against

```ts
import { createGenerator } from '@unocss/core'
import presetWind4 from '@unocss/preset-wind4'

const uno = await createGenerator({ presets: [presetWind4()] })
const { css } = await uno.generate('m-1 btn hocus:underline')
// rules, variants, shortcuts, theme all flow through this pipeline
```

## Reference Files

- **[core-architecture](references/core-architecture.md)** — engine pipeline, `createGenerator` API, the core abstractions a preset is made of
- **[core-rules](references/core-rules.md)** — static and dynamic rules for generating CSS utilities
- **[core-variants](references/core-variants.md)** — apply and author variations like `hover:`, `dark:`, responsive, and parametric variants
- **[core-shortcuts](references/core-shortcuts.md)** — combine multiple rules into single named shorthands

> Once a set of rules/variants/shortcuts stabilises, package them as a **preset** so they're reusable
> across projects — a preset is exactly `{ rules, variants, shortcuts, theme, … }`. See
> [core-architecture](references/core-architecture.md).
