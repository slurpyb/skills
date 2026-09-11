---
description: PandaCSS layer styles — apply when defining reusable container visual presets (background, border, shadow, opacity) or using layerStyle shorthand in a component
paths:
  - "**/panda.config.ts"
  - "**/layer-styles.ts"
  - "**/theme/**/*.ts"
  - "**/*.recipe.ts"
  - "**/recipes/**/*.ts"
  - "**/slot-recipes/**/*.ts"
  - "**/preset*/**/*.ts"
---

# PandaCSS — Layer Styles

`defineLayerStyles({ ... })` packages a visual preset (background, border, shadow, padding/maxWidth combos) into a named token applied via `layerStyle`. Use for **containers** — surfaces, panels, callouts — not typography (use `textStyles`) or animation (use `animationStyles`).

## Define

```ts
// path/to/theme/preset/theme/layer-styles.ts
import { defineLayerStyles } from "@pandacss/dev"

export const layerStyles = defineLayerStyles({
  container: {
    description: "Centered max-width container with responsive gutters",
    value: {
      position: "relative",
      maxWidth: "88rem",
      mx: "auto",
      px: { base: "4", md: "8" },
    },
  },
  "panel.subtle": {
    description: "Surface for secondary content",
    value: {
      bg: "bg.subtle",
      borderWidth: "1px",
      borderColor: "border.subtle",
      rounded: "lg",
      p: "6",
    },
  },
})
```

Wire in `panda.config.ts`:

```ts
theme: { extend: { layerStyles } }
```

## Consume

```tsx
css({ layerStyle: "container" })
css({ layerStyle: "panel.subtle", _dark: { bg: "bg.subtleDark" } })
```

## Rules

- Dot-keyed names (`panel.subtle`) become nested in the generated type — consumers see `layerStyle: "panel.subtle"`, IntelliSense surfaces them.
- A layer style is a **plain style object** — full responsive + condition support inside `value`.
- Override inside `css()` by setting properties after `layerStyle` (later wins in serialization).
- Don't put typography in layer styles; cross-cutting type rules belong in `textStyles`.

## See also

- [Animation styles](animation-styles.md)
- [Text styles](text-styles.md)
- [Tokens](tokens.md)
