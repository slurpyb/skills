---
title: "Defining layer styles"
---

Layer styles are defined in the `layerStyles` property of the theme.

Here's an example of a layer style:

```js filename="layer-styles.ts"
import { defineLayerStyles } from '@pandacss/dev'

const layerStyles = defineLayerStyles({
  container: {
    description: 'container styles',
    value: {
      background: 'gray.50',
      border: '2px solid',
      borderColor: 'gray.500'
    }
  }
})
```

> **Good to know:** The `value` property maps to style objects that will be applied to the element.