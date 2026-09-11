---
description: PandaCSS spacing utilities — apply when setting padding/margin/gap (per-side, per-axis, or logical) with the spacing scale
paths:
  - "**/panda.config.ts"
  - "**/*.recipe.ts"
  - "**/recipes/**/*.ts"
  - "**/slot-recipes/**/*.ts"
  - "**/preset*/**/*.ts"
  - "**/theme/**/*.ts"
---

# PandaCSS — Spacing Utilities

All keys take `spacing` tokens (e.g. `"0"`, `"1"`, `"2"`, `"4"`, `"8"`, `"12"`) or raw lengths.

## Padding

| Shorthand | Long form |
|-----------|-----------|
| `p` | `padding` |
| `px` | `padding-inline` (left + right) |
| `py` | `padding-block` (top + bottom) |
| `pt` / `pr` / `pb` / `pl` | per-side |
| `ps` / `pe` | logical inline-start / inline-end |

## Margin

| Shorthand | Long form |
|-----------|-----------|
| `m` | `margin` |
| `mx` | `margin-inline` |
| `my` | `margin-block` |
| `mt` / `mr` / `mb` / `ml` | per-side |
| `ms` / `me` | logical |

## Gap (flex/grid only)

| Shorthand | Long form |
|-----------|-----------|
| `gap` | `gap` |
| `columnGap` | `column-gap` |
| `rowGap` | `row-gap` |

## Form

```tsx
css({ p: "6", py: "8", px: { base: "4", md: "6" } })
css({ mt: "4", mx: "auto" })
css({ display: "grid", gap: "5", columnGap: { base: "3", lg: "5" } })
```

## Rules

- Always use the **spacing scale** (`"4"`, `"6"`, `"8"`) instead of raw `1rem` / `24px` — keeps rhythm consistent and themable.
- Prefer `gap` on a flex/grid parent over `margin` between siblings.
- Use logical `ps`/`pe` / `ms`/`me` in any UI that must support RTL.
- `mx: "auto"` works only when `maxW` (or `width`) is also set on the same element.

## See also

- [Sizing](sizing.md)
- [Flex and grid](flex-and-grid.md)
- [Tokens](../theming/tokens.md)
- [Patterns](../composing/patterns.md)
