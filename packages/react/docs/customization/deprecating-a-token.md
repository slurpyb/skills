---
title: "Deprecating a Token"
---

To deprecate a token, set the `deprecated` property to `true` in the `token` object.

```ts filename="panda.config.ts"
import { defineConfig } from '@pandacss/dev'

export default defineConfig({
  theme: {
    tokens: {
      spacing: {
        lg: { value: '8px', deprecated: true }
      }
    }
  }
})
```