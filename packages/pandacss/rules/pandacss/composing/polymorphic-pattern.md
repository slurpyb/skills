---
description: PandaCSS design-system component skeleton — apply when authoring a shared UI primitive (Button, Heading, Tag) that needs polymorphic 'as' + recipe variants + className merging
---

# PandaCSS — Polymorphic Design-System Component Pattern

> **Default to [`styled(el, recipe)`](styled-factory.md)** for polymorphic primitives —
> it gives type-safe `as`, style props, variant props, and ref forwarding for free.
> This hand-rolled skeleton is the **named exception**: reach for it only when the
> component needs extra prop logic the factory can't express (e.g. splitting/transforming
> props before render). Don't wrap `styled(...)` inside it — pick one.

The hand-rolled skeleton, when you do need it. Three guarantees: type-safe `as`, no variant leakage to DOM, consumer `className` merges cleanly.

## Skeleton

```tsx
import type { ComponentPropsWithoutRef, ElementType } from "react"
import { button, type ButtonVariantProps } from "styled-system/recipes"
import { cx } from "styled-system/css"

type ButtonElement = "button" | "a"

export type ButtonProps<T extends ButtonElement = "button"> =
  & ButtonVariantProps
  & { as?: T; className?: string }
  & Omit<ComponentPropsWithoutRef<T>, "className">

export function Button<T extends ButtonElement = "button">({
  as,
  className,
  ...rest
}: ButtonProps<T>) {
  // 1. Separate recipe variants from DOM props
  const [variantProps, localProps] = button.splitVariantProps(rest)

  // 2. Resolve element
  const Component = (as ?? "button") as ElementType

  // 3. Render with merged className
  return (
    <Component
      className={cx(button(variantProps), className)}
      {...localProps}
    />
  )
}
```

## Required parts

| Step | API | Why |
|------|-----|-----|
| Generate variant types | `import { ..., type FooVariantProps } from "styled-system/recipes"` | Type-safe variant props |
| Split props | `recipe.splitVariantProps(props)` | Stops `intent="primary"` from leaking to `<button>` |
| Element resolution | `(as ?? "default") as ElementType` | Polymorphism with default |
| Class merge | `cx(recipe(variantProps), className)` | Recipe class + consumer override |

## Anti-patterns

- ❌ Passing variant props straight to DOM (`<button intent="primary" />`) — React warning + invalid HTML.
- ❌ Importing a Tailwind-style `cn()` from `@/lib/utils` — use Panda's `cx`.
- ❌ Exposing the raw recipe to page code (`import { button } from "styled-system/recipes"` in a page) — keep that import inside the design-system component.
- ❌ Wrapping `styled(...)` in this skeleton — pick one (`styled()` factory **or** this hand-rolled wrapper). The factory covers most cases; this skeleton is for when you need extra prop logic.

## See also

- [Recipes](recipes.md)
- [Polymorphism factory](styled-factory.md)
- [Merging styles](../styling/merging.md)
- [Styled system](../configuring/styled-system.md)
