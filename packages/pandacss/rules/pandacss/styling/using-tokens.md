---
description: PandaCSS token consumption — apply when referencing a token from a style object, composite string value, or JS code (token() helper)
paths:
  - "**/panda.config.ts"
  - "**/*.recipe.ts"
  - "**/recipes/**/*.ts"
  - "**/slot-recipes/**/*.ts"
  - "**/preset*/**/*.ts"
  - "**/theme/**/*.ts"
---

# PandaCSS — Using Tokens

Three contexts, three forms:

| Where | Form | Example |
|-------|------|---------|
| Style object property | Dot-path string | `bg: "brand.red"`, `p: "4"` |
| Composite string value (border, shadow, gradient) | `token(...)` call inside the string | `border: "1px solid token(colors.brand.red)"` |
| Token reference inside theme definitions | Brace syntax | `value: "{colors.brand.red}"` or `"{colors.ink/30}"` |
| Runtime / JS code | `token()` helper from `styled-system/tokens` | `token("colors.brand.red")` |

## In a style object

```tsx
css({
  bg:        "bg.surface",
  color:     "fg.default",
  p:         "4",
  rounded:   "md",
  shadow:    "lg",
  fontSize:  "lg",
})
```

## Composite strings

```tsx
css({
  border: "1px solid token(colors.border.subtle)",
  boxShadow: "0 4px 14px token(colors.brand.ink/15)",
  background: "linear-gradient(180deg, token(colors.bg.surface), token(colors.bg.subtle))",
})
```

## Inside theme refs

```ts
defineSemanticTokens({
  colors: {
    background: {
      canvas:  { value: "{colors.wheat.500}" },
      surface: { value: "{colors.wheat.400}" },
    },
  },
})
```

## In TS / runtime

```ts
import { token } from "styled-system/tokens"

const value = token("colors.brand.red")           // → CSS var or raw value
const variable = token.var("colors.brand.red")    // → forces CSS var form
```

## Retune a descendant via a CSS var

To change a token-backed value in one context, set a CSS custom property on an
ancestor — don't raise specificity or duplicate the descendant's selector.

```tsx
// recipe/base exposes a knob backed by a token default
base: { gap: "var(--stack-space, token(spacing.4))" }

// ancestor retunes it — no specificity war, recipe stays the source of truth
css({ "--stack-space": token.var("spacing.2") })
```

## Rules

- Prefer **semantic tokens** (`bg.surface`, `fg.default`) over raw tokens (`wheat.500`, `ink`) at the call site.
- Composite values **must** use `token(...)` — bare brace syntax does not work inside a string value at the call site.
- Don't import token values from `styled-system/tokens` in render-critical loops — they're stable at build time; capture once.
- Opacity composes everywhere: `"colors.brand.red/40"` works in style objects, `"{colors.brand.red/40}"` in theme refs.
- Override a descendant's value by setting a CSS var on an ancestor (`css({ "--knob": token.var(...) })`), not by out-specifying or duplicating its selector.

## See also

- [Tokens](../theming/tokens.md)
- [Semantic tokenization](../refactoring/semantic-tokens.md)
- [Virtual color](color-palette.md)
- [Color opacity modifier](color-opacity.md)
