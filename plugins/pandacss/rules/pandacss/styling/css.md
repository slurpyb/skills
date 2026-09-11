---
description: PandaCSS css() — the primary styling API; apply when authoring any inline style block on a JSX element or returning a className from a hook/util
paths:
  - "**/panda.config.ts"
  - "**/*.recipe.ts"
  - "**/recipes/**/*.ts"
  - "**/slot-recipes/**/*.ts"
  - "**/preset*/**/*.ts"
  - "**/theme/**/*.ts"
---

# PandaCSS — Writing Styles (`css()`)

`css({ ... })` is the primary entry point. Object syntax, type-safe, statically extracted to atomic CSS at build time, returns a className string.

## Form

```tsx
import { css } from "styled-system/css"

<div
  className={css({
    display: "flex",
    gap: "4",
    p: "6",
    bg: "bg.surface",
    color: "fg.default",
    rounded: "md",
    _hover: { bg: "bg.subtle" },
    md: { p: "8" },
  })}
/>
```

## Style object features

- **Shorthands** — `bg`, `p`, `m`, `pt`/`pb`/`pl`/`pr`, `mx`, `my`, `rounded`, `shadow`, etc.
- **Tokens** — string values resolve against `theme.tokens` and `theme.semanticTokens`.
- **Conditions** — `_hover`, `_dark`, `_focusVisible`, `_groupHover`, `_motionReduce`, ...
- **Responsive** — `{ base, sm, md, lg }` objects on any property.
- **Color opacity** — `bg: "accent.500/60"`.
- **Color palette** — `colorPalette: "brand"` + `bg: "colorPalette.500"`.
- **Nested selectors** — `"& > svg"`, `"&[data-state=open]"`, etc.

## Rules

- Prefer `css()` over inline `style={{}}` — inline `style` skips token resolution and atomic extraction.
- Prefer **shorthand keys** for spacing/color (`p`, `bg`) over longhand to match the rest of the codebase.
- For component variants, switch from `css()` to a config recipe (`defineRecipe`, or `defineSlotRecipe` for multi-element) in the preset — `cva`/`sva` only for a throwaway one-off. For pure arrangement, switch to patterns.
- For values that must be merged across files, use `css.raw` upstream and `css(a, b)` at the call site.

## See also

- [Style props](style-props.md)
- [Styled system](../configuring/styled-system.md)
- [Conditional styles](conditions.md)
- [Merging styles](merging.md)
