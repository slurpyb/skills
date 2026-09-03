---
description: PandaCSS gradient utilities — apply when creating linear/radial/conic gradients for backgrounds or text fills via tokens instead of hand-rolled linear-gradient strings
paths:
  - "**/panda.config.ts"
  - "**/*.recipe.ts"
  - "**/recipes/**/*.ts"
  - "**/slot-recipes/**/*.ts"
  - "**/preset*/**/*.ts"
  - "**/theme/**/*.ts"
---

# PandaCSS — Gradient Utilities

| Key | Effect |
|-----|--------|
| `bgLinear` | Linear gradient background — takes direction (`"to-r"`, `"to-tl"`, `"45deg"`) |
| `bgRadial` | Radial gradient background |
| `bgConic` | Conic gradient background |
| `textGradient` | Apply the gradient to text fill (uses `background-clip: text`) |
| `gradientFrom` | Start color (token) |
| `gradientVia` | Middle color (token) |
| `gradientTo` | End color (token) |
| `bgGradient` | Reference a token defined in `theme.tokens.gradients` |

## Form — token-driven

```tsx
css({
  bgLinear: "to-r",
  gradientFrom: "brand.red",
  gradientVia: "brand.orange",
  gradientTo: "brand.wheat",
})
```

## Text gradient

```tsx
css({
  textGradient: "to-r",
  gradientFrom: "brand.red",
  gradientTo: "accent.500",
})
```

## Pre-defined gradient token

```ts
// theme/tokens.ts
gradients: {
  "brand-fade": { value: "linear-gradient(to right, {colors.brand.red}, {colors.brand.wheat})" },
}
```

```tsx
css({ bgGradient: "brand-fade" })
```

## Rules

- Prefer `bgLinear` + `gradientFrom`/`To` over raw `bgImage: "linear-gradient(...)"` — the utility wires tokens.
- For reusable brand gradients, register them in `theme.tokens.gradients` and reference via `bgGradient`.
- Direction keywords: `to-r`, `to-l`, `to-t`, `to-b`, `to-tr`, `to-tl`, `to-br`, `to-bl`, or any CSS angle string.
- `textGradient` requires text color set via the gradient — don't combine with `color: ...` on the same node.

## See also

- [Background](background.md)
- [Effects](effects.md)
- [Tokens](../theming/tokens.md)
