---
description: PandaCSS flex/grid utilities — apply when building or tweaking a flex or grid layout (alignment, distribution, gap, item placement) directly via css() or style props
paths:
  - "**/panda.config.ts"
  - "**/*.recipe.ts"
  - "**/recipes/**/*.ts"
  - "**/slot-recipes/**/*.ts"
  - "**/preset*/**/*.ts"
  - "**/theme/**/*.ts"
---

# PandaCSS — Flex & Grid Utilities

| Shorthand | Long form | Notes |
|-----------|-----------|-------|
| `display: "flex" \| "grid" \| "inline-flex" \| "inline-grid"` | `display` | Establish container |
| `flexDir` / `flexDirection` | `flex-direction` | `row` / `column` / reverse |
| `flexWrap` | `flex-wrap` | |
| `flex` | `flex` | shorthand: `"1"` → `1 1 0%`, `"auto"`, `"none"` |
| `align` / `alignItems` | `align-items` | container cross-axis |
| `justify` / `justifyContent` | `justify-content` | container main-axis |
| `alignSelf` / `justifySelf` | per-item | |
| `gridTemplateColumns` | `grid-template-columns` | use `"repeat(3, 1fr)"` or `Grid` pattern's `columns` |
| `gridTemplateColumns: "repeat(auto-fit, minmax(<min>, 1fr))"` | intrinsic grid | columns adapt to container width — no breakpoints |
| `gridTemplateRows` | `grid-template-rows` | |
| `gridColumn` / `gridRow` | spans | |
| `gap` | `gap` | `spacing` tokens, e.g. `"4"` |
| `columnGap` / `rowGap` | per-axis gap | |

## Prefer patterns over hand-rolling

```tsx
// ✅ Pattern
<Stack gap="4">…</Stack>
<Grid columns={{ base: 1, md: 3 }} gap="7" />

// — vs —

// 🆗 Inline (only for one-off layouts)
<div className={css({ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: "7" })}>
```

## Rules

- Reach for `stack`/`hstack`/`vstack`/`flex`/`grid`/`container` patterns first. Inline `display: "grid"` is for cases where no pattern fits.
- `gap` uses `spacing` tokens, not arbitrary values, unless explicitly bypassing tokens.
- Use the `flex` shorthand for `flex: 1` / `flex: auto` / `flex: none` — clearer than `flexGrow`/`flexShrink`/`flexBasis` for the common cases.
- For grids that should reflow by available width, use `repeat(auto-fit, minmax(<min>, 1fr))` instead of breakpoint-keyed `columns`.
- Logical alignment (`start`, `end`) honors writing direction; `left`/`right` do not.

## See also

- [Patterns](../composing/patterns.md)
- [Display](display.md)
- [Spacing](spacing.md)
- [Sizing](sizing.md)
