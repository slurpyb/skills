---
title: "Deprecating a Utility"
---

To deprecate a utility, set the `deprecated` property to `true` in the `utility` object.

```ts filename="panda.config.ts"
import { defineConfig } from '@pandacss/dev'

export default defineConfig({
  utilities: {
    ta: {
      deprecated: true,
      transform(value) {
        return { textAlign: value }
      }
    }
  }
})
```