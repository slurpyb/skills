---
title: "The css function"
---

This the basic way of writing template styles. It converts the template literal into a set of atomic class name which
you can pass to the `className` prop of an element.

```js
import { css } from '../styled-system/css'

const className = css`
  font-size: 16px;
  font-weight: bold;
`

function Heading() {
  return <h1 className={className}>This is a title</h1>
}

// => <h1 className='font-size_16px font-weight_bold'></h1>
```

Here's what the emitted atomic CSS looks like:

```css
.font-size_16px {
  font-size: 16px;
}

.font-weight_bold {
  font-weight: bold;
}
```