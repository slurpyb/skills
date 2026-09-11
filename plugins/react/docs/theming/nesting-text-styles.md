---
title: "Nesting text styles"
---

Text styles support nested structures with a special `DEFAULT` key. This allows you to create variants of a text style
while having a default fallback.

When you define a `DEFAULT` key within a nested text style, you can reference the parent key directly to use the default
value.

```js filename="panda.config.ts"
export default defineConfig({
  theme: {
    extend: {
      textStyles: {
        heading: {
          DEFAULT: {
            value: {
              fontFamily: 'Inter',
              fontWeight: 'bold',
              fontSize: '1.5rem',
              lineHeight: '1.2'
            }
          },
          h1: {
            value: {
              fontFamily: 'Inter',
              fontWeight: 'bold',
              fontSize: '2.5rem',
              lineHeight: '1.1'
            }
          },
          h2: {
            value: {
              fontFamily: 'Inter',
              fontWeight: 'bold',
              fontSize: '2rem',
              lineHeight: '1.15'
            }
          }
        }
      }
    }
  }
})
```

Now you can use the default heading style or specific variants:

```jsx
import { css } from '../styled-system/css'

function App() {
  return (
    <div>
      <h1 className={css({ textStyle: 'heading.h1' })}>Main Title</h1>
      <h2 className={css({ textStyle: 'heading.h2' })}>Subtitle</h2>
      <h3 className={css({ textStyle: 'heading' })}>Uses DEFAULT variant</h3>
    </div>
  )
}
```