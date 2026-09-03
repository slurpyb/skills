---
description: PandaCSS refactor decision tree — apply when a component file has many ad-hoc css() calls or duplicated styles, and you need to pick between cva/sva and local/global scope
paths:
  - "**/panda.config.ts"
  - "**/*.recipe.ts"
  - "**/recipes/**/*.ts"
  - "**/slot-recipes/**/*.ts"
  - "**/preset*/**/*.ts"
  - "**/theme/**/*.ts"
---

# PandaCSS — Refactor Fragmented Styles

A two-step decision tree when collapsing a wall of `css(...)` calls into a recipe.

## Step 1 — Structural choice

Is this one element or several coordinated parts?

| Component shape | Pick |
|-----------------|------|
| One root element (Button, Badge, Tag, Pill) | **Single-part** — `cva` (local) or `defineRecipe` (global) |
| Root + named subcomponents (Card with header/body/actions, Accordion) | **Multi-part** — `sva` (local) or `defineSlotRecipe` (global) |

## Step 2 — Scope choice

Where does the recipe live?

**Default to a global config recipe** — `defineRecipe` / `defineSlotRecipe` in the
preset. It's the design system's shared, themable vocabulary.

| Reuse profile | Scope | API |
|---------------|-------|-----|
| Anything reusable, themable, or part of the design system (the default) | **Global** | `defineRecipe` / `defineSlotRecipe` in the preset (`recipes/` · `slot-recipes/`) |
| A genuinely throwaway one-off, single file, never reused | **Local** | `cva` / `sva` colocated — promote to a config recipe the moment it's reused |

## Then — Variant logic

- If the only difference between variants is **which color palette** the component renders, encode the palette with `colorPalette: "brand"` on the variant instead of repeating `bg`/`color`/`borderColor` per variant.
- Hoist shared layout into `base`; let variants only carry what changes.
- `compoundVariants` for `variantA & variantB → extra styles` cases.

## Refactor checklist

1. List slots (or just `root` for single-part).
2. Hoist shared styles to `base`.
3. Identify the axes of variation → variant keys.
4. Move palette-only differences to `colorPalette`.
5. Add `defaultVariants` so consumers can omit props.
6. Replace every `css({...})` call site with `recipe({...})`.
7. Delete the old style constants.

## See also

- [Recipes](../composing/recipes.md)
- [Slot recipes](../composing/slot-recipes.md)
- [Virtual color](../styling/color-palette.md)
- [Choosing primitives](choosing-primitives.md)
- [Writing styles](../styling/css.md)
