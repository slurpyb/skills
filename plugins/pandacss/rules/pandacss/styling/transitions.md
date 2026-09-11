---
description: PandaCSS transition utilities — apply when adding CSS transitions or animation references to a component (hover, focus, state-change motion)
paths:
  - "**/panda.config.ts"
  - "**/*.recipe.ts"
  - "**/recipes/**/*.ts"
  - "**/slot-recipes/**/*.ts"
  - "**/preset*/**/*.ts"
  - "**/theme/**/*.ts"
---

# PandaCSS — Transition Utilities

| Key | Long form | Token |
|-----|-----------|-------|
| `transition` | `transition` (composite) | preset shortcuts: `colors`, `opacity`, `transform`, `all`, `none` |
| `transitionProperty` | `transition-property` | preset categories or CSS prop names |
| `transitionDuration` | `transition-duration` | `durations` |
| `transitionTimingFunction` | `transition-timing-function` | `easings` |
| `transitionDelay` | `transition-delay` | `durations` |
| `animation` | `animation` | `animations` token category |
| `animationName` | `animation-name` | keyframe name |
| `animationDuration` | `animation-duration` | `durations` |
| `animationTimingFunction` | `animation-timing-function` | `easings` |
| `animationFillMode` / `animationIterationCount` / ... | full suite | — |

## Form

```tsx
css({
  transition: "colors",
  transitionDuration: "fast",
  _hover: { bg: "bg.subtle", color: "fg.accent" },
})
```

Targeted property:

```tsx
css({
  transition: "transform",
  transitionDuration: "200ms",
  transitionTimingFunction: "ease-out",
  _hover: { scale: 1.05 },
})
```

Animation token:

```tsx
css({
  animation: "fade-in",
  // expands to: animationName + duration + easing from theme.tokens.animations
})
```

## Rules

- Use named transition shortcuts (`"colors"`, `"transform"`, `"opacity"`) over `"all"` — `all` triggers paint on properties you didn't intend.
- Define durations (`fast`, `normal`, `slow`) and easings (`ease-out-expo`, etc.) as tokens, reference them by name — never hardcode `200ms` repeatedly.
- Always pair non-decorative motion with `_motionReduce: { transition: "none", animation: "none" }`.
- For complex, reusable motion sequences, prefer an `animationStyle` token over inline `animation*` properties.

## See also

- [Animation styles](../theming/animation-styles.md)
- [Transforms](transforms.md)
- [Conditional styles](conditions.md)
- [Tokens](../theming/tokens.md)
