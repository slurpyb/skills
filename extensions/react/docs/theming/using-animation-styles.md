---
title: "Using Animation Styles"
---

Now we can use the `animationStyle` property in our components.

```jsx
import { css } from '../styled-system/css'

function App() {
  return (
    <div className={css({ animationStyle: 'slide-fade-in' })}>
      This is an element with slide-fade-in animation style.
    </div>
  )
}
```

Take advantage of it in your conditions:

```ts
export const popoverSlotRecipe = defineSlotRecipe({
  slots: anatomy.keys(),
  base: {
    content: {
      _open: {
        animationStyle: 'scale-fade-in'
      },
      _closed: {
        animationStyle: 'scale-fade-out'
      }
    }
  }
})
```