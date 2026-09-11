---
title: "Style Properties"
---

The recommended way to consume your tokens is in the `css` function or style props.

```jsx
import { css } from '../styled-system/css'

const App = () => (
  <div
    className={css({
      color: 'green.400',
      background: 'gray.200'
    })}
  />
)
```