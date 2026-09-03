---
description: PandaCSS recipes (defineRecipe + cva) — apply when authoring multi-variant component styles like buttons, badges, inputs, with base/variants/compoundVariants/defaultVariants
paths:
  - "**/recipes/**/*.ts"
  - "**/panda.config.ts"
  - "**/*.recipe.ts"
  - "**/slot-recipes/**/*.ts"
  - "**/preset*/**/*.ts"
  - "**/theme/**/*.ts"
---

# PandaCSS — Recipes

Two flavors:

| Flavor | API | Where it lives | When variants are emitted |
|--------|-----|---------------|----------------------------|
| **Config recipe** | `defineRecipe(...)` in `theme.recipes` | `theme/preset/recipes/*.ts` + config | JIT — only variants seen at call sites |
| **Atomic recipe** | `cva(...)` at the call site | colocated with the component | All variants, eagerly |

**Always prefer a config recipe** (`defineRecipe`), authored in the preset. It's
the design system's shared vocabulary — JIT-emitted, themable, and consumable
anywhere via `styled-system/recipes`. Reach for `cva` only for a genuinely
throwaway, single-file component that will never be reused or themed; the moment
a second call site or a theme concern appears, promote it to a config recipe.

## Config recipe

```ts
// path/to/theme/preset/recipes/button.ts
import { defineRecipe } from "@pandacss/dev"

export const button = defineRecipe({
  className: "button",
  description: "The button style",
  base: {
    display: "inline-flex",
    alignItems: "center",
    rounded: "md",
    px: "4",
    py: "2",
    fontWeight: "medium",
  },
  variants: {
    variant: {
      primary:   { bg: "brand.red",   color: "white" },
      secondary: { bg: "brand.wheat", color: "brand.red" },
      ghost:     { bg: "transparent", color: "fg.default", _hover: { bg: "neutral.50" } },
    },
    size: {
      sm: { px: "3", py: "1.5", fontSize: "sm" },
      md: { px: "4", py: "2",   fontSize: "md" },
      lg: { px: "6", py: "3",   fontSize: "lg" },
    },
  },
  compoundVariants: [
    { variant: "primary", size: "lg", css: { letterSpacing: "wide" } },
  ],
  defaultVariants: { variant: "primary", size: "md" },
})
```

Wire in `panda.config.ts`:

```ts
theme: {
  extend: {
    recipes: { button },
  },
},
```

Consume:

```tsx
import { button } from "styled-system/recipes"

<button className={button({ variant: "ghost", size: "sm" })}>Click</button>
```

## Atomic recipe (`cva`)

```tsx
import { cva } from "styled-system/css"

const badge = cva({
  base: { rounded: "full", px: "2", py: "0.5", fontSize: "xs" },
  variants: {
    tone: {
      info:    { bg: "blue.100",  color: "blue.700" },
      warning: { bg: "amber.100", color: "amber.800" },
    },
  },
})

<span className={badge({ tone: "info" })}>New</span>
```

## Rules

- Default to `defineRecipe` (config, in the preset) over `cva`; `cva` is the narrow exception for a throwaway one-off, and even then promote it on reuse.
- `base` is always applied — variants merge on top.
- `defaultVariants` matter for type-safety; consumers can omit those props.
- `compoundVariants` for cross-variant overrides — don't try to encode this in nested variant objects.
- A recipe is single-slot. For multi-element components (Accordion, Tabs, Card with parts), use **slot recipes** (`sva` / `defineSlotRecipe`).
- Consume a recipe by binding it to a component — `styled(el, recipe)` (variants become typed props) or, for slots, `createStyleContext`. Avoid calling `recipe(props)` inside a component body: with dynamic args it sidesteps static extraction and re-runs each render. The one in-body call worth keeping is `recipe.splitVariantProps(props)`, when a wrapper has to separate variant props from DOM props before applying them.

## See also

- [Slot recipes](slot-recipes.md)
- [JSX style context](style-context.md)
- [Choosing primitives](../refactoring/choosing-primitives.md)
