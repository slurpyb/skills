---
title: "Deprecating a Pattern"
---

To deprecate a pattern, set the `deprecated` property to true in the `pattern` definition.

```ts filename="panda.config.ts"
import { defineConfig } from '@pandacss/dev'

export default defineConfig({
  patterns: {
    customStack: {
      deprecated: true
    }
  }
})
```