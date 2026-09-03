---
description: PandaCSS type safety — apply when refactoring createStyleContext, recipe wrappers, or any component utility that uses 'any' or '@ts-ignore' to bypass Panda's generated types
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

# PandaCSS — Type Safety Restoration

Panda's generated types are the bridge between the theme and IDE autocomplete. `any` / `@ts-ignore` in styling utilities breaks that bridge — kill them.

## Generated types you should be using

| Type | Source | Use for |
|------|--------|---------|
| `RecipeVariantProps<T>` | `styled-system/types` | Extract variant prop types from a recipe |
| `HTMLStyledProps<T>` | `styled-system/jsx` | HTML attributes + style props for a styled element |
| `RecipeDefinition`, `SlotRecipeDefinition` | `@pandacss/types` | Typing a function that accepts a recipe |
| `ComponentProps<T>` / `ComponentPropsWithoutRef<T>` | `react` | Native React prop extraction |

## Anti-pattern → hardened

```tsx
// ❌ Fragile — drops all autocomplete and type checking
export const createStyleContext = (recipe: any) => {
  const withProvider = (Component: any, part: string) => {
    /* ... */
  }
}
```

```tsx
// ✅ Hardened — generic over the recipe, slot keys derive from ReturnType
import type { ElementType } from "react"

export interface AnyRecipe {
  (props?: Record<string, unknown>): Record<string, string>
  splitVariantProps: (props: Record<string, unknown>) => [
    Record<string, unknown>,
    Record<string, unknown>,
  ]
}

export function createStyleContext<R extends AnyRecipe>(recipe: R) {
  type Slot = keyof ReturnType<R>

  function withProvider<T extends ElementType>(Component: T, slot: Slot) {
    /* ... ctx-aware wrapper */
  }
  function withContext<T extends ElementType>(Component: T, slot: Slot) {
    /* ... ctx-consuming wrapper */
  }

  return { withProvider, withContext }
}
```

## Checklist

- Replace `any` on recipe parameters with a generic `<R extends AnyRecipe>` constraint.
- Derive slot names from `keyof ReturnType<R>` so `withContext(_, "head" /* autocomplete */)` works.
- Use `HTMLStyledProps<T>` for any custom component built on top of `styled()`.
- Use `RecipeVariantProps<typeof recipe>` to expose variant props without hand-listing keys.
- Remove every `@ts-ignore` / `@ts-expect-error` left from before the refactor — if a real error remains, fix the type, not the suppression.

## See also

- [JSX style context](../composing/style-context.md)
- [Recipes](../composing/recipes.md)
- [Polymorphism factory](../composing/styled-factory.md)
- [Polymorphic components strategy](../composing/polymorphic-pattern.md)
