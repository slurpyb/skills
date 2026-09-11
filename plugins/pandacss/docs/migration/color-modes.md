---
title: "Color Modes"
---

In Theme UI, colors modes can be used to create a user-configurable light and dark mode values that are automatically
applied to components depending on color mode.

```jsx
// theme.js
const theme = {
  colors: {
    primary: '#07c',
    modes: {
      dark: {
        primary: '#0cf'
      }
    }
  }
}

// Button.js
const Demo = () => <button sx={{ color: 'primary' }} />
```

In Panda, color modes related values are defined as `semanticTokens` in the theme. Semantic tokens are tokens that
change depending on the color mode.

```js
// panda.config.js
import { defineConfig } from '@pandacss/dev'

export default defineConfig({
  theme: {
    extend: {
      semanticTokens: {
        colors: {
          primary: { value: { base: '#07c', _dark: '#0cf' } }
        }
      }
    }
  }
})

// Button.js
import { css } from 'styled-system/css'

const Demo = () => (
  <button
    className={css({
      color: 'primary'
    })}
  />
)
```