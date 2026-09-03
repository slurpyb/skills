---
description: PandaCSS SVG utilities — apply when styling fill/stroke on inline SVG icons or illustrations
paths:
  - "**/icons.tsx"
  - "**/icon-*.tsx"
  - "**/panda.config.ts"
  - "**/*.recipe.ts"
  - "**/recipes/**/*.ts"
  - "**/slot-recipes/**/*.ts"
  - "**/preset*/**/*.ts"
  - "**/theme/**/*.ts"
---

# PandaCSS — SVG Utilities

| Key | Long form | Token |
|-----|-----------|-------|
| `fill` | `fill` | `colors` |
| `stroke` | `stroke` | `colors` |
| `strokeWidth` | `stroke-width` | `borderWidths` (or raw) |

## Form — icon base style

```tsx
import { css } from "styled-system/css"

const iconStyle = css.raw({
  fill: "currentColor",
  stroke: "currentColor",
  strokeWidth: 0,
})

export function ChevronIcon({ size = 4 }: { size?: number | string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={css(iconStyle, { w: size, h: size })}
      aria-hidden="true"
    >
      <path d="..." />
    </svg>
  )
}
```

## Rules

- Default icons to `fill: "currentColor"` / `stroke: "currentColor"` so the icon picks up the parent's `color` automatically.
- Set `aria-hidden="true"` on purely decorative SVG; give meaningful `<title>` or `aria-label` to informative SVG.
- Don't set `width`/`height` attributes on the `<svg>` tag if you control them via Panda `w`/`h` — they'll fight.
- `strokeWidth` accepts both unitless numbers and tokens; pick one convention per project.

## See also

- [Background](background.md)
- [Sizing](sizing.md)
- [Writing styles](css.md)
