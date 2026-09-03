---
title: "How does Panda manage style conflicts ?"
---

When you combine shorthand and longhand properties, Panda will resolve the styles in a predictable way. The shorthand
property will take precedence over the longhand property.

```jsx
import { css } from '../styled-system/css'

const styles = css({
  paddingTop: '20px',
  padding: '10px'
})
```

The styles generated at build time will look like this:

```css
@layer utilities {
  .p_10px {
    padding: 10px;
  }

  .pt_20px {
    padding-top: 20px;
  }
}
```