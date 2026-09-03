---
title: "Deprecating a Recipe"
---

To deprecate a recipe, set the `deprecated` property to true in the `recipe` definition.

```ts filename="panda.config.ts"
import { defineConfig } from '@pandacss/dev'

export default defineConfig({
  theme: {
    recipes: {
      btn: {
        deprecated: true
      }
    }
  }
})
```