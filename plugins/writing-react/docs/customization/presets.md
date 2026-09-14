---
title: "Presets"
---

Creating your own reusable preset for utilities and theme

By default, any configuration you add in your own `panda.config.js` file is smartly merged with the
[default configuration](#), allowing you to override or extend specific parts of the configuration.

You can specify a preset in your `panda.config.js` file by using the `presets` option:

```js
import { defineConfig } from '@pandacss/dev'

export default defineConfig({
  presets: ['@acmecorp/panda-preset']
})
```