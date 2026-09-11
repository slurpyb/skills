---
description: PandaCSS extend keyword — apply when adding tokens/recipes/utilities/conditions to a theme or preset without clobbering Panda or upstream-preset defaults
paths:
  - "**/panda.config.ts"
  - "**/preset.ts"
  - "**/preset/**/*.ts"
  - "**/theme/**/*.ts"
---

# PandaCSS — The `extend` Keyword

`extend` deep-merges your additions into Panda's base config (or an upstream preset). Without `extend`, you **replace** that section wholesale — usually a footgun.

## Form

```ts
// panda.config.ts
export default defineConfig({
  presets: ["@pandacss/preset-base", myPreset],
  theme: {
    extend: {
      tokens: { ... },
      semanticTokens: { ... },
      textStyles: { ... },
      recipes: { ... },
      slotRecipes: { ... },
      keyframes: { ... },
    },
  },
  utilities: {
    extend: { ... },
  },
  conditions: {
    extend: { ... },
  },
  patterns: {
    extend: { ... },
  },
})
```

## Inside a preset

```ts
// path/to/theme/preset/preset.ts
import { definePreset } from "@pandacss/dev"

export const preset = definePreset({
  theme: {
    extend: {
      tokens,
      semanticTokens,
      textStyles,
      recipes,
      slotRecipes,
    },
  },
})
```

## Rules

- Default to `extend` for every `theme`, `utilities`, `conditions`, `patterns` block.
- Drop `extend` only when you **deliberately** want to replace the upstream definition (e.g. swapping out the whole color palette and rejecting defaults).
- `extend` merges deeply: same token path in both is overwritten by your value; sibling paths are kept.
- `recipes` keyed by recipe name — collisions overwrite, no merge of recipe internals.

## See also

- [Tokens](../theming/tokens.md)
- [Global styles](global-styles.md)
- [Architecture flow](../debugging/architecture.md)
