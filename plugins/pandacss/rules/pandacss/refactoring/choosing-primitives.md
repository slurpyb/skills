---
description: PandaCSS primitive selection — apply when starting a new styled component or feature and choosing between css(), patterns, recipes, or slot recipes
---

# PandaCSS — Choosing the Right Primitive

Three roles, three primitives. Pick by **role**, not by code size.

## Decision tree

```
Is the work primarily layout? (display, flex, grid, gap, alignment)
├── YES → Pattern (stack/grid/container or custom definePattern)
└── NO
    │
    └── Is this a named visual primitive with variants? (Button, Card, Badge, Input)
        ├── YES → Recipe (config-first — author in the preset)
        │   ├── Single element → defineRecipe (default); cva only for a throwaway one-off
        │   └── Multi-element  → defineSlotRecipe (default); sva only for a throwaway one-off
        └── NO → css({}) at the call site
```

Arrangement lives on the outer element (pattern/`layerStyle`), identity and state
live inside the recipe. Compose by nesting — never one rule doing both.

## When to elevate

| Pattern detected | Action |
|------------------|--------|
| Same layout idiom in 3+ places | Promote to a custom `definePattern` |
| Any reusable/themable recipe (the default) | Author as `defineRecipe` in the preset from the start |
| Variants are only swapping color shades | Use `colorPalette` instead of multiplying variants |
| Multi-part component sharing variant state | Promote to slot recipe + `createStyleContext` |

## Anti-patterns

- Using `css()` everywhere → results in fragmented styles; refactor toward patterns/recipes once duplication emerges.
- Wrapping `css()` in a custom helper that re-implements `cva` → use `cva` directly.
- Reaching for `cva`/`sva` when a config recipe fits → default to `defineRecipe`/`defineSlotRecipe` in the preset; `cva`/`sva` is only for a genuinely throwaway one-off, promoted on any reuse.
- One recipe that sets both outer arrangement (margin, grid, gap) and inner identity (bg, border, radius) → split: a pattern/layerStyle wraps; the recipe fills.
- A pattern carrying variant/state → patterns are stateless layout; wrap a stateful recipe in a pattern, never fold state into the pattern.

## See also

- [Recipes](../composing/recipes.md)
- [Slot recipes](../composing/slot-recipes.md)
- [Patterns](../composing/patterns.md)
- [Writing styles](../styling/css.md)
- [Refactor fragmented styles](fragmented-styles.md)
