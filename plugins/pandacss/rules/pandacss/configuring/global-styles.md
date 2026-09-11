---
description: PandaCSS defineGlobalStyles — apply when editing global resets, base element styles, or :root variables in a Panda project
paths:
  - "**/global-css.ts"
  - "**/global-styles.ts"
  - "**/panda.config.ts"
  - "**/theme/**/*.ts"
---

# PandaCSS — Global Styles

`defineGlobalStyles({ ... })` declares CSS that targets selectors (`html`, `body`, `*`, `:root`, etc.) and lands in the `@layer base` cascade layer. Keep it small — anything component-scoped belongs in a recipe or `css()` call.

## Form

```ts
// path/to/theme/preset/styles/global-css.ts
import { defineGlobalStyles } from "@pandacss/dev"

export const globalCss = defineGlobalStyles({
  "html, body": {
    margin: 0,
    padding: 0,
    minHeight: "100dvh",
    fontFamily: "body",
  },
  "*, *::before, *::after": {
    boxSizing: "border-box",
  },
})
```

Then wire it in `panda.config.ts`:

```ts
import { globalCss } from "./path/to/theme/preset/styles/global-css"

export default defineConfig({
  globalCss,
})
```

## Rules

- Reserve for true cross-cutting rules (resets, element defaults, `:root` token wiring). Component styling does not belong here.
- Land in `@layer base` by default — component styles in `recipes`/`utilities` will override.
- Do not declare CSS variables here that already exist as theme tokens; define them in `theme.tokens` instead.
- Group selectors with commas to avoid duplicate keys at the top level.

## See also

- [Cascade layers](cascade-layers.md)
- [The extend keyword](extend.md)
- [Tokens](../theming/tokens.md)
