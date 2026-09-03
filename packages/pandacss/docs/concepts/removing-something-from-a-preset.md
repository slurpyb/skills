---
title: "Removing something from a preset"
---

Let's say you want to remove the `br` utility from the `@acme/my-preset` preset. You can do it like this:

```ts
import { defineConfig } from '@pandacss/dev'
import myPreset from '@acme/my-preset'

const { br, ...utilities } = myPreset.utilities

export default defineConfig({
  presets: ['@acme/my-preset']
  utilities: {
    extend: {
      ...utilities, // 👈 we still want the other utilities from this preset
      // your customizations here
    }
  }
})
```