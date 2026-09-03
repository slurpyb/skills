---
description: PandaCSS sizing utilities — apply when setting width/height/min/max or boxSize, including fractional and token-backed values
paths:
  - "**/panda.config.ts"
  - "**/*.recipe.ts"
  - "**/recipes/**/*.ts"
  - "**/slot-recipes/**/*.ts"
  - "**/preset*/**/*.ts"
  - "**/theme/**/*.ts"
---

# PandaCSS — Sizing Utilities

| Shorthand | Long form | Token |
|-----------|-----------|-------|
| `w` / `width` | `width` | `sizes` |
| `h` / `height` | `height` | `sizes` |
| `minW` / `minWidth` | `min-width` | `sizes` |
| `maxW` / `maxWidth` | `max-width` | `sizes` |
| `minH` / `minHeight` | `min-height` | `sizes` |
| `maxH` / `maxHeight` | `max-height` | `sizes` |
| `boxSize` | sets `width` + `height` | `sizes` |
| `size` | alias for `boxSize` | `sizes` |

## Value forms

- Token: `w: "4"` → `1rem`
- Raw: `w: "240px"`, `w: "32rem"`
- Fractional string: `w: "1/2"` → `50%`, `w: "1/3"` → `33.333%`
- Keywords: `w: "full"` → `100%`, `w: "screen"` → `100vw`, `w: "fit"` → `fit-content`, `w: "min"`, `w: "max"`, `w: "auto"`

## Form

```tsx
css({ w: "full", maxW: "5xl", h: "screen" })
css({ boxSize: "10" })           // square 2.5rem × 2.5rem
css({ w: "1/2", h: "auto" })
```

## Rules

- Default to **token** sizes (`sizes` scale) for consistent rhythm. Drop to raw values only when the layout needs an exact pixel (hairlines/borders).
- Size text measure in `ch` (`maxW: "65ch"`) and fluid dimensions with `clamp()` — content-relative, not viewport-pinned.
- `boxSize` is the most idiomatic way to express a square (icon button, avatar).
- For dynamic viewport units (mobile address bar friendly), use `100dvh` / `100svh` raw values.
- Combine `maxW` with `mx: "auto"` for centered containers — or just reach for the `container` pattern.

## See also

- [Spacing](spacing.md)
- [Layout](layout.md)
- [Tokens](../theming/tokens.md)
