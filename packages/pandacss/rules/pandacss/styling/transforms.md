---
description: PandaCSS transform utilities — apply when scaling, rotating, translating, or skewing elements (for hover effects, animations, micro-interactions)
paths:
  - "**/panda.config.ts"
  - "**/*.recipe.ts"
  - "**/recipes/**/*.ts"
  - "**/slot-recipes/**/*.ts"
  - "**/preset*/**/*.ts"
  - "**/theme/**/*.ts"
---

# PandaCSS — Transform Utilities

Composable transform shorthands. Each maps to a CSS custom property under the hood, so multiple shorthands compose in a single `transform` declaration.

| Key | Long form | Notes |
|-----|-----------|-------|
| `scale` | `--scale` | numeric, `1` is identity |
| `scaleX` / `scaleY` | per-axis | |
| `rotate` | `--rotate` | angle string: `"45deg"`, `"-10deg"` |
| `translateX` / `x` | `--translate-x` | `spacing` token or `%` |
| `translateY` / `y` | `--translate-y` | `spacing` token or `%` |
| `skewX` / `skewY` | per-axis skew | angle string |
| `transformOrigin` | `transform-origin` | `center` / `top left` / `--` |
| `transform` | raw `transform` | escape hatch |

## Form

```tsx
css({
  transition: "transform",
  transitionDuration: "200ms",
  _hover: { scale: 1.05, y: "-2px" },
  _active: { scale: 0.98 },
})
```

For paired entry/exit animations:

```tsx
css({
  rotate: "45deg",
  transformOrigin: "center",
  transition: "transform",
  transitionDuration: "300ms",
})
```

## Rules

- Always pair transform-based hover/active effects with a `transition` (usually `transition: "transform"`) — abrupt transforms feel jumpy.
- Pair `_motionReduce: { transform: "none" }` for any non-decorative animation.
- Prefer shorthand `x` / `y` for translate — they compose cleanly with other transforms.
- Raw `transform` overrides the composed CSS variables — don't mix `scale: 1.1` with `transform: "rotate(45deg)"` in the same style object.

## See also

- [Transitions](transitions.md)
- [Effects](effects.md)
- [Animation styles](../theming/animation-styles.md)
