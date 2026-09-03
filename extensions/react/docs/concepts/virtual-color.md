---
title: "Virtual Color"
---

Panda allows you to create a virtual color or color placeholder in your project.

The `colorPalette` property is how you create virtual colors.

```js
import { css } from '../styled-system/css'

const className = css({
  colorPalette: 'blue',
  bg: 'colorPalette.100',
  _hover: {
    bg: 'colorPalette.200'
  }
})
```

This will translate to the `blue.100` background color and `blue.200` background color on hover.

Virtual colors are useful when creating easily customizable components.