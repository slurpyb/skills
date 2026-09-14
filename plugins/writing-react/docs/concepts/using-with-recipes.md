---
title: "Using with recipes"
---

You can also use virtual colors with recipes.

```js
import { css, cva, cx } from '../styled-system/css'

const button = cva({
  base: {
    padding: 4
    // you can also specify a default colorPalette in the `base` recipe key
    // colorPalette: 'blue',
    // ^^^^^^^^^^^^^^^^^^^^
  },
  variants: {
    variant: {
      primary: { color: 'colorPalette.500' }
    }
  },
  defaultVariants: { variant: 'primary' }
})
```