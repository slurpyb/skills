---
description: PandaCSS semantic tokenization — apply when extracting hardcoded hex/rgb colors or raw px/rem values from components into the theme as semantic tokens
paths:
  - "**/panda.config.ts"
  - "**/tokens.ts"
  - "**/semantic-tokens.ts"
  - "**/theme/**/*.ts"
---

# PandaCSS — Semantic Tokenization

Two layers, separate concerns:

| Layer | API | Holds | Example |
|-------|-----|-------|---------|
| **Raw tokens** | `defineTokens` | Concrete values | `colors.ink = "rgb(56 47 45)"`, `spacing.4 = "1rem"` |
| **Semantic tokens** | `defineSemanticTokens` | Intent-named references | `colors.bg.surface = "{colors.ink}"`, can vary by condition (light/dark) |

Components consume **semantic** tokens. Raw tokens are an implementation detail of the theme.

## Form

```ts
// path/to/theme/preset/theme/tokens.ts
import { defineTokens } from "@pandacss/dev"

export const tokens = defineTokens({
  colors: {
    ink:   { value: "rgb(56 47 45)" },
    paper: { value: "rgb(252 250 246)" },
    red: {
      500: { value: "rgb(204 36 36)" },
      700: { value: "rgb(160 24 24)" },
    },
  },
  spacing: {
    1: { value: "0.25rem" },
    2: { value: "0.5rem" },
    4: { value: "1rem" },
    8: { value: "2rem" },
  },
})
```

```ts
// path/to/theme/preset/theme/semantic-tokens.ts
import { defineSemanticTokens } from "@pandacss/dev"

export const semanticTokens = defineSemanticTokens({
  colors: {
    bg: {
      surface: { value: { base: "{colors.paper}", _dark: "{colors.ink}" } },
      subtle:  { value: "{colors.ink/5}" },
    },
    fg: {
      default: { value: { base: "{colors.ink}", _dark: "{colors.paper}" } },
    },
    border: {
      subtle:  { value: "{colors.ink/30}" },
    },
  },
})
```

```tsx
// usage
css({ bg: "bg.surface", color: "fg.default", borderColor: "border.subtle" })
```

## Refactor pathway

1. Grep for hardcoded `rgb(`, `#`, `rgba(`, raw `rem`/`px` in component files.
2. Group by intent: is `rgb(56 47 45)` "ink" (raw) and "fg.default" (semantic)?
3. Add the raw token to `tokens.ts`.
4. Add the semantic token to `semantic-tokens.ts`, wiring conditions (`_dark`, etc.) if needed.
5. Replace component values with the semantic token name.
6. Run `panda codegen`.

## Rules

- Components reference semantic tokens (`bg.surface`), never raw tokens (`ink`) — gives you dark mode / theme swap for free.
- Token references use brace syntax inside values: `"{colors.ink}"`, `"{colors.ink/30}"` for opacity.
- Conditional values per token: `value: { base: "...", _dark: "...", _osDark: "..." }`.
- Token tree changes require `panda codegen` before TS picks up new keys.

## See also

- [Tokens](../theming/tokens.md)
- [Using tokens](../styling/using-tokens.md)
- [Color opacity modifier](../styling/color-opacity.md)
