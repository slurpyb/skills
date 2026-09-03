---
title: "Setting global styles (base)"
---

Use `globalCss` to define additional global styles and set variables.

```ts filename="panda.config.ts"
import { defineConfig } from '@pandacss/dev'

export default defineConfig({
  // ...
  globalCss: {
    html: {
      '--global-font-body': 'Inter, sans-serif',
      '--global-font-mono': 'Mononoki Nerd Font, monospace',
      '--global-color-border': 'colors.gray.400',
      '--global-color-placeholder': 'rgba(0,0,0,0.5)',
      '--global-color-selection': 'rgba(0,115,255,0.3)',
      '--global-color-focus-ring': 'colors.blue.400'
    }
  }
})
```

### Theming patterns

You can set variables on `:root`, a `.dark` class, or via media queries.

```css
:root {
  --global-color-border: oklch(0.8 0 0);
}
.dark {
  --global-color-border: oklch(0.72 0 0);
}

@media (prefers-color-scheme: dark) {
  :root {
    --global-color-border: oklch(0.72 0 0);
  }
}
```