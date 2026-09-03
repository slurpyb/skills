---
title: "Nesting animation styles"
---

Animation styles support nested structures with a special `DEFAULT` key. This allows you to create variants of an
animation style while having a default fallback.

When you define a `DEFAULT` key within a nested animation style, you can reference the parent key directly to use the
default value.

```js filename="panda.config.ts"
export default defineConfig({
  theme: {
    extend: {
      animationStyles: {
        fade: {
          DEFAULT: {
            value: {
              animationName: 'fade-in',
              animationDuration: '300ms',
              animationTimingFunction: 'ease-in-out'
            }
          },
          slow: {
            value: {
              animationName: 'fade-in',
              animationDuration: '600ms',
              animationTimingFunction: 'ease-in-out'
            }
          },
          fast: {
            value: {
              animationName: 'fade-in',
              animationDuration: '150ms',
              animationTimingFunction: 'ease-in-out'
            }
          }
        }
      }
    }
  }
})
```

Now you can use the default fade animation or specific speed variants:

```jsx
import { css } from '../styled-system/css'

function App() {
  return (
    <div>
      <div className={css({ animationStyle: 'fade' })}>Default fade speed</div>
      <div className={css({ animationStyle: 'fade.slow' })}>Slow fade</div>
      <div className={css({ animationStyle: 'fade.fast' })}>Fast fade</div>
    </div>
  )
}
```