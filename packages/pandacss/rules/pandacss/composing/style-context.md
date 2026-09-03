---
description: PandaCSS createStyleContext — apply when building compound components (Accordion, Tabs, Menu) that share a slot recipe across multiple subcomponents
paths:
  - "**/createStyleContext.tsx"
  - "**/createStyleContext.ts"
  - "**/panda.config.ts"
  - "**/*.recipe.ts"
  - "**/recipes/**/*.ts"
  - "**/slot-recipes/**/*.ts"
  - "**/preset*/**/*.ts"
  - "**/theme/**/*.ts"
---

# PandaCSS — JSX Style Context

`createStyleContext(recipe)` distributes a slot recipe's classes across compound subcomponents via React context. Use it instead of threading recipe results manually through props.

## Scope — UI component library only

`createStyleContext` is a **foundation-layer** primitive. It lives in the UI
component library (`@repo/react`), where the compound components (Accordion,
Tabs, Menu, …) are assembled. **Product / app code never calls it** — it imports
the already-assembled compound components and composes them.

This mirrors the React rule `scope-foundation-vs-product-code`: library idioms
(slot recipes + `createStyleContext`, relative imports) stay inside the
foundation boundary; the app consumes the output. If you're reaching for
`createStyleContext` in app code, you're rebuilding a foundation component in the
wrong layer — assemble it in `@repo/react` and import it instead.

## Setup helper (one-time, in the component library)

```tsx
// packages/fullsnack-ui/components/react/src/lib/createStyleContext.tsx
import { createContext, useContext } from "react"
// see Panda docs for the canonical implementation
```

## Wiring a compound component

Import `createStyleContext` **relatively**, not via a `@/` alias — a
source-distributed package (like `@repo/react`) can't rely on a consumer's
tsconfig `paths`, so the alias breaks at the call site.

```tsx
import { sva } from "styled-system/css"
import { createStyleContext } from "../lib/createStyleContext"

const accordionRecipe = sva({
  slots: ["root", "item", "trigger", "content"],
  base: { /* ... */ },
})

const { withProvider, withContext } = createStyleContext(accordionRecipe)

export const ProductAccordion = withProvider(Root, "root")
export const ProductAccordionItem = withContext(Item, "item")
export const ProductAccordionTrigger = withContext(Trigger, "trigger")
export const ProductAccordionContent = withContext(Content, "content")
```

## Rules

- Use only with **slot** recipes (`sva` / `defineSlotRecipe`). For single-slot recipes use the recipe function directly.
- `withProvider` wraps the root and injects the slot-class map into context; `withContext` reads from it.
- Recipe variants apply to all slots — pass variant props on the provider.
- One context per compound component family — don't share contexts across recipes.

## See also

- [Slot recipes](slot-recipes.md)
- [Recipes](recipes.md)
- [Polymorphic components](polymorphic-pattern.md)
