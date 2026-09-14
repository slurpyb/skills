---
title: "Global styles"
---

Global styles are useful for applying additional global resets or font faces. Use the `globalCss` property in the
`panda.config.ts` file to define global styles.

Global styles are inserted at the top of the stylesheet and are scoped to the `@layer base` cascade layer.

> For resets, global variables, theming patterns, and more examples, see [Global styles](/docs/concepts/global-styles).

```js filename="panda.config.ts"
import { defineConfig, defineGlobalStyles } from '@pandacss/dev'

const globalCss = defineGlobalStyles({
  'html, body': {
    color: 'gray.900',
    lineHeight: '1.5'
  }
})

export default defineConfig({
  // ...
  globalCss
})
```

The styles generated at build time will look like this:

```css
@layer base {
  html,
  body {
    color: var(--colors-gray-900);
    line-height: 1.5;
  }
}
```