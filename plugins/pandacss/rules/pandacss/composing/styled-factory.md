---
description: PandaCSS styled() factory — apply when building polymorphic components (Heading, Box, Text with as-prop) instead of hand-rolled ElementType casting
paths:
  - "**/panda.config.ts"
  - "**/*.recipe.ts"
  - "**/recipes/**/*.ts"
  - "**/slot-recipes/**/*.ts"
  - "**/preset*/**/*.ts"
  - "**/theme/**/*.ts"
---

# PandaCSS — Polymorphism via `styled()`

Use `styled(element, recipe?)` from `styled-system/jsx` for any component that needs to accept an `as` prop. It carries type-safe `as` polymorphism, JSX style props, and recipe variants — no manual `ElementType` plumbing.

**This is the default** for polymorphic design-system primitives. Drop to the
hand-rolled [polymorphic skeleton](polymorphic-pattern.md) only when the component
needs extra prop logic the factory can't express — never wrap `styled(...)` inside it.

## Anti-pattern

```tsx
// ❌ Manual polymorphism — drops style props, loose typing
export function Heading({ as: Component = "h2", ...props }) {
  return <Component className={headingStyle} {...props} />
}
```

## Idiomatic

```ts
// src/components/ui/heading/heading.recipe.ts
import { cva } from "styled-system/css"

export const headingRecipe = cva({
  base: { fontWeight: "bold", color: "fg.default" },
  variants: {
    size: {
      xl: { textStyle: "headingXl" },
      lg: { textStyle: "headingLg" },
      md: { textStyle: "headingMd" },
    },
  },
  defaultVariants: { size: "md" },
})
```

```tsx
// src/components/ui/heading/Heading.tsx
import { styled } from "styled-system/jsx"
import { headingRecipe } from "./heading.recipe"

export const Heading = styled("h2", headingRecipe)

// usage
<Heading as="h1" size="xl">Title</Heading>
<Heading as="h3">Subtitle</Heading>
```

## Rules

- `styled(element, recipe)` types `as` against valid intrinsic + component types automatically. Don't re-type it.
- The bound recipe's variants surface as props on the component — no need to spread `recipe({...})` into `className`.
- For slot-based polymorphism (compound components), pair `styled()` with `createStyleContext` + slot recipe.
- `HTMLStyledProps<T>` is the canonical type for prop interfaces consuming a styled component.
- Don't wrap `styled(...)` in another forwardRef — `styled()` already forwards refs.

## See also

- [Recipes](recipes.md)
- [Style props](../styling/style-props.md)
- [Polymorphic components strategy](polymorphic-pattern.md)
