---
title: "Merging sva + css styles"
---

The same technique can be used to merge an atomic `sva` recipe and a style object.

```js
import { css, sva } from 'styled-system/css'

const overrideStyles = css.raw({
  bg: 'red',
  color: 'white'
})

const buttonStyles = sva({
  slots: ['root']
  base: {
    root: {
      bg: 'blue',
      border: '1px solid black'
    }
  },
  variants: {
    size: {
      root: {
        small: { fontSize: '12px' }
      }
    }
  }
})

// returns the resolved style object for all slots
const { root } = buttonStyles.raw({ size: 'small' })

const className = css(
  root,
  // add the override styles
  overrideStyles
)

// => 'bg_red border_1px_solid_black color_white font-size_12px'
```