---
title: "Removing something from the base presets"
---

Let's say you want to remove the `stack` pattern from the `@pandacss/preset-base` preset (included by default).

You can pick only the parts that you need with and spread the rest, like this:

```ts
import pandaBasePreset from '@pandacss/preset-base'

// omitting stack here
const { stack, ...pandaBasePresetPatterns } = pandaBasePreset.patterns

export default defineConfig({
  presets: ['@pandacss/preset-panda'], // 👈 we still want the tokens, breakpoints and textStyles from this preset

  // ⚠️ we need to eject to prevent the `@pandacss/preset-base` from being resolved
  // https://panda-css.com/docs/customization/presets#which-panda-presets-will-be-included-
  eject: true,
  patterns: {
    extend: {
      ...pandaBasePresetPatterns
      // your customizations here
    }
  }
})
```