---
title: "Token Nesting"
---

Tokens can be nested to create a hierarchy of tokens. This is useful when you want to group tokens together.

> Tip: You can use the `DEFAULT` key to define the default value of a nested token.

```js
import { defineConfig } from '@pandacss/dev'

export default defineConfig({
  // ...
  theme: {
    semanticTokens: {
      colors: {
        bg: {
          DEFAULT: { value: '{colors.gray.100}' },
          muted: { value: '{colors.gray.100}' }
        }
      }
    }
  }
})
```

This allows the use of the `bg` token in the following ways:

```jsx
import { css } from '../styled-system/css'

function App() {
  return (
    <div
      className={css({
        // 👇🏻 This will use the `DEFAULT` value
        bg: 'bg',
        // 👇🏻 This will use the `muted` value
        color: 'bg.muted'
      })}
    >
      Hello World
    </div>
  )
}
```