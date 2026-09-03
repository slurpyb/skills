---
title: "Using tokens"
---

You can also use tokens in your conditions, and they will be resolved to their actual values:

```tsx
import { defineConfig } from '@pandacss/dev'

export default defineConfig({
  conditions: {
    extend: {
      mq: '@media (min-width: token(sizes.4xl))',
      size2: '&[data-size=token(spacing.2)]'
    }
  }
})
```