---
title: "Semantic Virtual Colors"
---

Semantic virtual colors gives you an ability to create a virtual color organized by category, variant and state.
Hierarchically organized virtual colors are useful when creating easily customizable components.

```js
const theme = {
  extend: {
    semanticTokens: {
      colors: {
        button: {
          dark: {
            value: 'navy'
          },
          light: {
            DEFAULT: {
              value: 'skyblue'
            },
            accent: {
              DEFAULT: {
                value: 'cyan'
              },
              secondary: {
                value: 'blue'
              }
            }
          }
        }
      }
    }
  }
}
```

You can now use the root `button` color palette and its values directly:

```tsx
import { css } from '../styled-system/css'

export const App = () => {
  return (
    <button
      className={css({
        colorPalette: 'button',
        color: 'colorPalette.light',
        backgroundColor: 'colorPalette.dark',
        _hover: {
          color: 'colorPalette.light.accent',
          background: 'colorPalette.light.accent.secondary'
        }
      })}
    >
      Root color palette
    </button>
  )
}
```

Or you can use any deeply nested property (e.g. `button.light.accent`) as a root color palette:

```tsx
import { css } from '../styled-system/css'

export const App = () => {
  return (
    <button
      className={css({
        colorPalette: 'button.light.accent',
        color: 'colorPalette.secondary'
      })}
    >
      Nested color palette leaf
    </button>
  )
}
```

> **Note**: Nested tokens require glob patterns in the `colorPalette` config (e.g., `'button.*'`) to generate proper CSS
> variables.