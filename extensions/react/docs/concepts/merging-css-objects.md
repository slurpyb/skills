---
title: "Merging css objects"
---

You can merge multiple style objects together using the `css` function.

```js
import { css } from 'styled-system/css'

const style1 = {
  bg: 'red',
  color: 'white'
}

const style2 = {
  bg: 'blue'
}

const className = css(style1, style2) // => 'bg_blue text_white'
```

In some cases though, the style object might not be colocated in the same file as the component. In this case, you can
use the `css.raw` function to preserve the original style object.

> All `.raw(...)` signatures are identity functions that return the same value as the input, but serve as a hint to the
> compiler that the value is a style object.

```js
// style.js
import { css } from 'styled-system/css'

export const style1 = css.raw({
  bg: 'red',
  color: 'white'
})

// component.js
import { css } from 'styled-system/css'
import { style1 } from './style.js'

const style2 = css.raw({
  bg: 'blue'
})

const className = css(style1, style2) // => 'bg_blue text_white'
```