---
title: "Defining text styles"
---

Text styles are defined in the `textStyles` property of the theme.

Here's an example of a text style:

```js filename="text-styles.ts"
import { defineTextStyles } from '@pandacss/dev'

export const textStyles = defineTextStyles({
  body: {
    description: 'The body text style - used in paragraphs',
    value: {
      fontFamily: 'Inter',
      fontWeight: '500',
      fontSize: '16px',
      lineHeight: '24px',
      letterSpacing: '0',
      textDecoration: 'None',
      textTransform: 'None'
    }
  }
})
```

> **Good to know:** The `value` property maps to style objects that will be applied to the text.