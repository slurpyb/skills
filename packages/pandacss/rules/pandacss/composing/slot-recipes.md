---
description: PandaCSS slot recipes (defineSlotRecipe + sva) — apply when styling multi-part components (Accordion, Tabs, Card, Menu) where variants must coordinate across slots
paths:
  - "**/slot-recipes/**/*.ts"
  - "**/recipes/**/*.ts"
  - "**/panda.config.ts"
  - "**/*.recipe.ts"
  - "**/preset*/**/*.ts"
  - "**/theme/**/*.ts"
---

# PandaCSS — Slot Recipes

Slot recipes describe a multi-part component as a single recipe. Variants apply across all slots, keeping the parts in sync.

| API | Where it lives | Notes |
|-----|----------------|-------|
| `defineSlotRecipe` | `theme/preset/slot-recipes/*.ts` + config | JIT, used via `import { foo } from "styled-system/recipes"` |
| `sva` | colocated with the component | Eager, for one-off compound components |

## Form

```tsx
import { sva } from "styled-system/css"

const accordion = sva({
  slots: ["root", "item", "header", "trigger", "content"],
  base: {
    root:    { width: "full" },
    item:    { borderBottomWidth: "1px", borderBottomColor: "border.default" },
    trigger: { display: "flex", justifyContent: "space-between", py: "3" },
    content: { px: "4", pb: "4" },
  },
  variants: {
    size: {
      sm: { trigger: { py: "2", fontSize: "sm" }, content: { px: "3", pb: "3" } },
      md: { trigger: { py: "3", fontSize: "md" }, content: { px: "4", pb: "4" } },
    },
  },
  defaultVariants: { size: "md" },
})

const classes = accordion({ size: "sm" })
// → { root: "...", item: "...", header: "...", trigger: "...", content: "..." }
```

## `defineParts` — one className, no context

When a multi-part component renders as a single DOM subtree, `defineParts` is the
lighter path: it returns a `parts()` helper used inside a `defineRecipe`, so the
whole component is one className and parts are targeted by `[data-part]`
selectors — no per-slot class map, no `createStyleContext`.

```ts
import { defineParts, defineRecipe } from "@pandacss/dev"

const parts = defineParts({
  root:  { selector: "&[data-part='root']" },   // matches the recipe element itself
  label: { selector: "& [data-part='label']" }, // descendants
})

export const field = defineRecipe({
  className: "field",
  base: parts({ root: { display: "grid", gap: "1" }, label: { color: "fg.muted" } }),
})
```

The `selector` is **arbitrary** — any valid CSS selector. `[data-part='…']` is just
a convention; a part can key off a class, an element, or a scoped attribute of your
choosing (`& [data-scope='field'][data-part='label']`, `& > .label`, `& label`).
Pick whatever the consuming markup already expresses.

Reach for `defineSlotRecipe` + `createStyleContext` instead when the parts live on
separate, non-adjacent elements, or when you want a compound `<Field.Label>` API.

## Rules

- **Always prefer `defineSlotRecipe`** (config, in the preset) over `sva`; `sva` is the narrow exception for a throwaway one-off multi-part component, promoted to a config slot recipe on any reuse.
- Declare every slot in the `slots` array; missing slots are runtime-undefined.
- Prefer `defineParts` for a single-subtree multi-part component; reach for `createStyleContext` when you want per-slot classes or a compound subcomponent API.
- Consume by binding — `styled(el, recipe)` for `defineParts`, `createStyleContext` for slots — rather than calling the recipe in render.
- A variant value is a **map of slot → styles** — key it by slot; a flat style object lands on nothing.
- Compound variants and `defaultVariants` work just like single-slot recipes.
- For React compound components, pair with `createStyleContext` so child components pick up their slot class automatically — but only inside the UI component library; app code consumes the assembled component (see [JSX style context](style-context.md)).
- Don't mix `sva` and `defineSlotRecipe` for the same component — pick one.

## See also

- [Recipes](recipes.md)
- [JSX style context](style-context.md)
- [Polymorphic components](polymorphic-pattern.md)
