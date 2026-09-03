---
title: "Reset (preflight)"
---

Enable or scope the reset styles.

```ts filename="panda.config.ts"
import { defineConfig } from '@pandacss/dev'

export default defineConfig({
  preflight: true
})
```

Scope and level:

```ts filename="panda.config.ts"
import { defineConfig } from '@pandacss/dev'

export default defineConfig({
  preflight: { scope: '.extension', level: 'element' }
})
```