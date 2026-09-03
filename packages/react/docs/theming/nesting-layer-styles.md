---
title: "Nesting layer styles"
---

Layer styles support nested structures with a special `DEFAULT` key. This allows you to create variants of a layer style
while having a default fallback.

When you define a `DEFAULT` key within a nested layer style, you can reference the parent key directly to use the
default value.

```js filename="panda.config.ts"
export default defineConfig({
  theme: {
    extend: {
      layerStyles: {
        card: {
          DEFAULT: {
            value: {
              background: 'white',
              border: '1px solid',
              borderColor: 'gray.200',
              borderRadius: 'md',
              boxShadow: 'sm'
            }
          },
          elevated: {
            value: {
              background: 'white',
              border: 'none',
              borderRadius: 'lg',
              boxShadow: 'lg'
            }
          },
          outlined: {
            value: {
              background: 'transparent',
              border: '2px solid',
              borderColor: 'gray.300',
              borderRadius: 'md',
              boxShadow: 'none'
            }
          }
        }
      }
    }
  }
})
```

Now you can use the default card style or specific variants:

```jsx
import { css } from '../styled-system/css'

function App() {
  return (
    <div>
      <div className={css({ layerStyle: 'card' })}>Default card style</div>
      <div className={css({ layerStyle: 'card.elevated' })}>Elevated card</div>
      <div className={css({ layerStyle: 'card.outlined' })}>Outlined card</div>
    </div>
  )
}
```