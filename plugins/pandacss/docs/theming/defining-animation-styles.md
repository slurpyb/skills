---
title: "Defining Animation Styles"
---

Animation styles are defined in the `animationStyles` property of the theme.

Here's an example of an animation style:

```js filename="animation-styles.ts"
import { defineAnimationStyles } from '@pandacss/dev'

export const animationStyles = defineAnimationStyles({
  'slide-fade-in': {
    value: {
      transformOrigin: 'var(--transform-origin)',
      animationDuration: 'fast',
      '&[data-placement^=top]': {
        animationName: 'slide-from-top, fade-in'
      },
      '&[data-placement^=bottom]': {
        animationName: 'slide-from-bottom, fade-in'
      },
      '&[data-placement^=left]': {
        animationName: 'slide-from-left, fade-in'
      },
      '&[data-placement^=right]': {
        animationName: 'slide-from-right, fade-in'
      }
    }
  }
})
```

> **Good to know:** The `value` property maps to style objects that will be applied to the element.