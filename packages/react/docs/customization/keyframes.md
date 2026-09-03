---
title: "Keyframes"
---

Use the `keyframes` key in the `theme` section of your Panda config file to customize the default keyframes.

```ts filename="panda.config.ts"
import { defineConfig } from '@pandacss/dev'

export default defineConfig({
  theme: {
    extend: {
      keyframes: {
        fadein: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' }
        },
        fadeout: {
          '0%': { opacity: '1' },
          '100%': { opacity: '0' }
        }
      }
    }
  }
})
```

Panda ships with the following keyframes by default:

<TokenDocs type="keyframes" />