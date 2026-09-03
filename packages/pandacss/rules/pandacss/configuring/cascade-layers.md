---
description: PandaCSS cascade layer order — apply when editing the root CSS entry, debugging specificity wars, or adding a new layer/preset
paths:
  - "**/index.css"
  - "**/globals.css"
  - "**/app.css"
  - "**/panda.config.ts"
---

# PandaCSS — Cascade Layers

Panda ships five layers in fixed priority (low → high): `reset`, `base`, `tokens`, `recipes`, `utilities`. The declaration order at the top of the entry CSS file determines precedence; do not reorder without intent.

## Required declaration

Put this as the **first non-comment line** of the entry CSS (typically `globals.css` or `app.css`):

```css
@layer reset, base, tokens, recipes, utilities;
```

## Rules

- Never write unlayered CSS that needs to win over `utilities` — promote it into the cascade instead of using `!important`.
- Custom layers (e.g. `@layer overrides`) must be declared in the same `@layer ...` statement, after `utilities` if they need to win.
- Do not duplicate the `@layer` declaration in multiple files; Panda relies on a single source of truth.

## See also

- [Global styles](global-styles.md)
- [Writing styles](../styling/css.md)
