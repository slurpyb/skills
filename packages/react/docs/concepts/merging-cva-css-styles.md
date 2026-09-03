---
title: "Merging cva + css styles"
---

The same technique can be used to merge an atomic `cva` recipe and a style object.

```js
import { css, cx, cva } from 'styled-system/css'

const overrideStyles = css.raw({
  bg: 'red',
  color: 'white'
})

const buttonStyles = cva({
  base: {
    bg: 'blue',
    border: '1px solid black'
  },
  variants: {
    size: {
      small: { fontSize: '12px' }
    }
  }
})

const className = css(
  // returns the resolved style object
  buttonStyles.raw({ size: 'small' }),
  // add the override styles
  overrideStyles
)

// => 'bg_red border_1px_solid_black color_white font-size_12px'
```