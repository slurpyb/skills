---
description: PandaCSS design tokens — apply when defining or editing raw token values (colors/spacing/fonts/radii/shadows) in the theme
paths:
  - "**/panda.config.ts"
  - "**/tokens.ts"
  - "**/semantic-tokens.ts"
  - "**/theme/**/*.ts"
---

# PandaCSS — Design Tokens

Two APIs:

| API | Holds | Lives in |
|-----|-------|----------|
| `defineTokens` | Raw fixed values (`#C12026`, `1rem`, `0 4 14 0 rgba(...)`) | `theme/preset/theme/tokens.ts` |
| `defineSemanticTokens` | Intent-named refs, optionally condition-aware (`bg.surface`, `_dark` variants) | `theme/preset/theme/semantic-tokens.ts` |

Categories (Panda built-in): `colors`, `spacing`, `sizes`, `fonts`, `fontSizes`, `fontWeights`, `lineHeights`, `letterSpacings`, `radii`, `shadows`, `durations`, `easings`, `zIndex`, `assets`, `gradients`, `breakpoints`, `borders`.

## Raw tokens

```ts
// path/to/theme/preset/theme/tokens.ts
import { defineTokens } from "@pandacss/dev"

export const tokens = defineTokens({
  colors: {
    brand: {
      red:   { value: "#C12026" },
      wheat: { value: "#F4E3C1" },
      ink:   { value: "#382F2D" },
    },
    neutral: {
      50:  { value: "#FAFAFA" },
      900: { value: "#171717" },
    },
  },
  spacing: {
    1: { value: "0.25rem" },
    2: { value: "0.5rem" },
    4: { value: "1rem" },
    8: { value: "2rem" },
  },
  radii: {
    sm: { value: "0.25rem" },
    md: { value: "0.5rem" },
    lg: { value: "1rem" },
  },
})
```

## Semantic tokens

```ts
import { defineSemanticTokens } from "@pandacss/dev"

export const semanticTokens = defineSemanticTokens({
  colors: {
    bg: {
      surface: { value: { base: "{colors.brand.wheat}", _dark: "{colors.brand.ink}" } },
    },
    fg: {
      default: { value: { base: "{colors.brand.ink}", _dark: "{colors.brand.wheat}" } },
    },
  },
})
```

Wire in `panda.config.ts`:

```ts
theme: { extend: { tokens, semanticTokens } }
```

## Rules

- Every leaf must be `{ value: ... }`. Bare strings are not tokens — Panda will silently drop them.
- Reference other tokens with brace syntax inside string values: `"{colors.brand.red}"`.
- Components read **semantic** tokens; raw tokens are the theme's private vocabulary.
- Token mutations require `panda codegen` to refresh types before TS picks them up.
- Use dotted nesting (`brand.red`, `bg.surface`) — Panda's type generation prefers this over flat keys.
- Keep token keys lowercase and dotted. For a multi-word concept, nest a group with a `DEFAULT` leaf for the base plus sub-keys for variants (`measure` → `measure.narrow`) rather than fusing words into `measureNarrow`.
- `zIndex` is a token category — define the stacking scale once (`dropdown`, `sticky`, `modal`, `tooltip`, …) and reference it as `zIndex: "modal"`, instead of scattering raw numbers or one utility class per layer.
- A value that is born semantic (a `ch` reading measure, a one-off brand layer) can sit directly in `defineSemanticTokens` — skip a raw→semantic indirection when the raw name would just repeat the same intent.

## See also

- [Using tokens](../styling/using-tokens.md)
- [Semantic tokenization](../refactoring/semantic-tokens.md)
- [Virtual color](../styling/color-palette.md)
- [The extend keyword](../configuring/extend.md)
