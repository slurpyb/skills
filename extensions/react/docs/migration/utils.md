---
title: "Utils"
---

In Stitches, you can define utilities by using the `utils` key in the `createStitches` method.

```ts
import { createStitches, type PropertyValue } from '@stitches/react'

const { styled, css } = createStitches({
  utils: {
    linearGradient: (value: PropertyValue<'backgroundImage'>) => ({
      backgroundImage: `linear-gradient(${value})`
    })
  }
})
```

In Panda, you get a lot of built-in utilities (like mx, marginX, my, py, etc.) that you can use out of the box. You can
also create custom utilites using the `utilities` key in the `panda.config` function.

The utilities API allows you define the connected token scale, generated className, and transform function.

```ts
import { defineConfig } from '@pandacss/dev'

export default defineConfig({
  utilities: {
    extend: {
      linearGradient: {
        // (optional): the css property this maps to (to inherit the types from)
        property: 'backgroundImage',
        // (optional): the className to generate
        className: 'bg_gradient',
        // (optional): the shorthand name to use in the css
        shorthand: 'gradient',
        // (required): maps the value to the raw css object
        transform: value => ({
          backgroundImage: `linear-gradient(${value})`
        })
      }
    }
  }
})
```

> Running `panda codegen` will update the typings for the utilities, allowing for a type-safe developer experience.

Then you can use the utility in your styles.

```tsx
import { css } from '../styled-system/css'

const buttonClass = css({
  linearGradient: '19deg, #21D4FD 0%, #B721FF 100%'
})
```