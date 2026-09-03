---
title: "Core Tokens"
---

Tokens are defined in the `panda.config` file under the `theme` key

```js filename="panda.config.ts"
import { defineConfig } from '@pandacss/dev'

export default defineConfig({
  theme: {
    // 👇🏻 Define your tokens here
    extend: {
      tokens: {
        colors: {
          primary: { value: '#0FEE0F' },
          secondary: { value: '#EE0F0F' }
        },
        fonts: {
          body: { value: 'system-ui, sans-serif' }
        }
      }
    }
  }
})
```

> ⚠️ Token values need to be nested in an object with a `value` key. This is to allow for additional properties like
> `description` and more in the future.

After defining tokens, you can use them in authoring components and styles.

```jsx
import { css } from '../styled-system/css'

function App() {
  return (
    <p
      className={css({
        color: 'primary',
        fontFamily: 'body'
      })}
    >
      Hello World
    </p>
  )
}
```

You can also add an optional description to your tokens. This will be used in the autogenerate token documentation.

```js {8}
import { defineConfig } from '@pandacss/dev'

export default defineConfig({
  theme: {
    tokens: {
      colors: {
        danger: {
          value: '#EE0F0F',
          description: 'Color for errors'
        }
      }
    }
  }
})
```