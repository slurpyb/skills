---
title: "Update the config"
---

To use the text styles, we need to update the `config` object in the `panda.config.ts` file.

```js filename="panda.config.ts"
import { defineConfig } from '@pandacss/dev'
import { textStyles } from './text-styles'

export default defineConfig({
  theme: {
    extend: {
      textStyles
    }
  }
})
```

This should automatically update the generated theme the specified `textStyles`. If this doesn't happen, you can run the
`panda codegen` command.