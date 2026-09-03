---
title: "Custom global variables (globalVars)"
---

Define additional global CSS variables or `@property` entries.

```ts filename="panda.config.ts"
import { defineConfig } from '@pandacss/dev'

export default defineConfig({
  globalVars: {
    '--button-color': {
      syntax: '<color>',
      inherits: false,
      initialValue: 'blue'
    }
  }
})
```

> Keys from `globalVars` are suggestable in style objects and generated near your tokens at `cssVarRoot`.