---
title: "Sharing hooks"
---

Hooks can be shared as a snippet or as a `plugin`. Plugins are currently simple objects that contain a `name` associated
with a `hooks` object with the same structure as the `hooks` object in the config.

> Plugins differ from `presets` as they can't be extended, but they will be called in sequence in the order they are
> defined in the `plugins` array, with the user's config called last.

```ts
import { defineConfig } from '@pandacss/dev'

export default defineConfig({
  // ...
  plugins: [
    {
      name: 'token-format',
      hooks: {
        'tokens:created': ({ configure }) => {
          configure({
            formatTokenName: path => '$' + path.join('-')
          })
        }
      }
    }
  ]
})
```