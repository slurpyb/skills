---
title: "Which panda presets will be included ?"
---

![Visual helper](/stately-presets-merging.png)

- `@pandacss/preset-base`: ALWAYS included if NOT using `eject: true`

- `@pandacss/preset-panda`: only included by default if you haven't specified the `presets` config option, otherwise
  you'll have to include that preset by yourself like so:

```ts
import pandaPreset from '@pandacss/preset-panda'
import { defineConfig } from '@pandacss/dev'

export default defineConfig({
  // ...
  presets: [pandaPreset, myCustomPreset]
})
```