---
title: "Breakpoints"
---

Use the `breakpoints` key in the `theme` section of your Panda config file to customize the default breakpoints.

```ts filename="panda.config.ts"
import { defineConfig } from '@pandacss/dev'

export default defineConfig({
  theme: {
    extend: {
      breakpoints: {
        '3xl': '1800px'
      }
    }
  }
})
```

Panda ships with the following breakpoints by default:

<TokenDocs type="breakpoints" />