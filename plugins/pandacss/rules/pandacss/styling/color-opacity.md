---
description: PandaCSS color/opacity slash syntax — apply when assigning bg/color/borderColor with a transparency value
paths:
  - "**/panda.config.ts"
  - "**/*.recipe.ts"
  - "**/recipes/**/*.ts"
  - "**/slot-recipes/**/*.ts"
  - "**/preset*/**/*.ts"
  - "**/theme/**/*.ts"
---

# PandaCSS — Color Opacity Modifier

Use the `{color}/{opacity}` slash syntax to attach opacity to any color token. Panda lowers this to `color-mix()` at build time — do not write `color-mix` by hand, and do not author `rgba()` with manual alpha for token colors.

## Syntax

```tsx
bg: "sky.400/85"        // token color, 85% opacity
color: "neutral.900/60" // token color, 60% opacity
borderColor: "red.500/0.5"
```

- Left side: any token from `colors`.
- Right side: numeric `0–100` (percentage), `0–1` (decimal), or an opacity token.

## Rules

- Prefer `colors.foo/NN` over inline `rgb()` / `rgba()` — keeps theme switching working.
- Works on every utility wired to the `colors` category (`bg`, `color`, `borderColor`, `outlineColor`, `caretColor`, etc.).
- Avoid mixing with manual `color-mix()` in the same declaration; you lose token reactivity.

## See also

- [Tokens](../theming/tokens.md)
- [Writing styles](css.md)
