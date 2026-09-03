---
title: "Ship a Panda Preset"
---

This is the simplest approach. You can include the token, semantic tokens, text styles, etc. within a preset and consume
them in your projects.

**Library code**

```tsx filename="src/index.ts"
import { definePreset } from '@pandacss/dev'

export const acmePreset = definePreset({
  theme: {
    extend: {
      tokens: {
        colors: { primary: { value: 'blue.500' } }
      }
    }
  }
})
```

Build the preset code

```bash
pnpm tsup src/index.ts
```

**App code**

```tsx filename="panda.config.ts"
import { acmePreset } from '@acme-org/panda-preset'
import { defineConfig } from '@pandacss/dev'

export default defineConfig({
  //...
  presets: ['@pandacss/dev/presets', acmePreset]
})
```

> Adding a preset will remove the default theme from Panda. To add it back, you need to include the
> `@pandacss/dev/presets` preset.