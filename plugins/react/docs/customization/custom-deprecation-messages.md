---
title: "Custom Deprecation Messages"
---

You can also provide a custom deprecation message by setting the `deprecated` property to a string. i.e. the migration
message.

```ts filename="panda.config.ts"
import { defineConfig } from '@pandacss/dev'

export default defineConfig({
  theme: {
    tokens: {
      colors: {
        primary: { value: 'blue.500', deprecated: 'use `blue.600` instead' }
      }
    }
  }
})
```

```ts filename="panda.config.ts"
import { defineConfig } from '@pandacss/dev'

export default defineConfig({
  theme: {
    recipes: {
      btn: {
        deprecated: 'will be removed in v2.0'
      }
    }
  }
})
```