---
title: "Merging config recipe and style object"
---

Due to the fact that the generated styles of a config recipe are saved in the `@layer recipe` cascade layer, they can be
overridden with any atomic styles. Use the `cx` function to achieve that.

> The `utilties` layer has more precedence than the `recipe` layer.

```js
import { css, cx } from 'styled-system/css'
import { button } from 'styled-system/recipes'

const className = cx(
  // returns the resolved class name: `button button--size-small`
  button({ size: 'small' }),
  // add the override styles
  css({ bg: 'red' }) // => 'bg_red'
)

// => 'button button--size-small bg_red'
```