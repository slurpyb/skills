---
title: "Global Styles"
---

Theme UI offers a Global component (that wraps Emotion’s) for adding global CSS with theme-based values.

```jsx
import { Global } from 'theme-ui'

export default props => (
  <Global
    styles={{
      button: {
        m: 0,
        bg: 'primary',
        color: 'background',
        border: 0
      }
    }}
  />
)
```

In Panda, global styles are defined in the `theme.global` property of the panda config.

```js
// panda.config.js
import { defineConfig } from '@pandacss/dev'

export default defineConfig({
  globalCss: {
    button: {
      m: 0,
      bg: 'primary',
      color: 'background',
      border: 0
    }
  }
})
```