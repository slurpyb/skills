---
description: PandaCSS layout patterns (definePattern + built-ins) — apply when building reusable layout primitives or arranging components at a call site
paths:
  - "*.pattern.ts"
---

# PandaCSS — Layout Patterns

Patterns are the **layout** layer — arrangement (display, gap, columns, alignment),
not appearance or state. A pattern wraps a recipe or styled element; folding
layout into a recipe conflates concerns and kills reuse.

## Built-ins first

Panda ships JSX patterns from `styled-system/jsx` — prefer them before hand-rolling:

| Need | Pattern |
|------|---------|
| Auto-fit grid | `<Grid minChildWidth="16rem">` (compiles to `repeat(auto-fit, minmax(…))`) |
| 1D flex / clusters | `<Flex>`, `<Wrap>` |
| Vertical rhythm | `<Stack>` (+ `<Divider>` for separators) |
| Reading container | `<Container>` |
| Negative-margin bleed | `<Bleed inline="8">` |
| Aspect ratio | `<AspectRatio ratio={16/9}>` |
| Container query scope | `<Cq name="card">` |
| Centering | `<Center>` |
| sr-only | `<VisuallyHidden>` |

Reusing a built-in beats recreating it with `styled("div", { display: "flex", … })`.

## Custom patterns (`definePattern`)

Typed `properties` become typed JSX props and a callable className function:

```ts
import { definePattern } from "@pandacss/dev"

export const cardGrid = definePattern({
  description: "Auto-fitting card grid",
  jsxName: "CardGrid",
  jsxElement: "div",
  properties: { min: { type: "token", value: "sizes" } },
  defaultValues: { min: "16rem" },
  transform(props) {
    const { min, ...rest } = props
    return { display: "grid", gridTemplateColumns: `repeat(auto-fit, minmax(${min}, 1fr))`,
             gap: "6", "& > *": { minWidth: "0" }, ...rest }
  },
})
```

Wire under the top-level `patterns.extend` key in the single `panda.config.ts`
(sibling of `theme`) — not a separate config file.

## Extending a built-in (three ways)

1. **Override defaults** — redefine the built-in's key in `patterns.extend`
   (e.g. `container`); every call site gets your gutters/measure for free.
2. **Compose via `.raw()`** — `grid.raw({ … })` / `flex.raw({ … })` return the
   style object; spread it into a richer pattern instead of re-deriving.
3. **Wrap for structure** — build template areas / extra rules on top of a
   built-in's output (e.g. a holy-grail `appShell` over `grid`).

## Rules

- Patterns carry layout only; keep appearance and state in recipes. A pattern wraps a stateful component, not the other way round.
- Reach for a built-in (`Grid`/`Flex`/`Stack`/`Wrap`/`Container`/`Bleed`/`AspectRatio`/`Cq`/`Center`) before hand-rolling the same arrangement.
- Register custom patterns in `panda.config.ts` under `patterns.extend`; consume them as JSX components (`jsxName`) at call sites.
- Favor intrinsic sizing (`minChildWidth`, `minmax`/`auto-fit`, container queries) over viewport breakpoints, and logical properties (`insetBlockStart`, `marginInline`) over physical ones.
- Size reading measures in `ch` via a semantic token; keep `zIndex` and spacing as tokens.

## See also

- [Recipes](recipes.md)
- [Slot recipes](slot-recipes.md)
- [Styled factory](styled-factory.md)
- [Choosing primitives](../refactoring/choosing-primitives.md)
