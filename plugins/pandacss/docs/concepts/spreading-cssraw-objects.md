---
title: "Spreading css.raw objects"
---

> **Added in v1.6.1**

You can also spread `css.raw` objects within style declarations. This is particularly useful for reusing styles in
nested selectors, conditions, and complex compositions:

### Child selectors

```js
import { css } from 'styled-system/css'

const baseStyles = css.raw({ margin: 0, padding: 0 })

const component = css({
  '& p': { ...baseStyles, fontSize: '1rem' },
  '& h1': { ...baseStyles, fontSize: '2rem' }
})
```

### Nested conditions

```js
import { css } from 'styled-system/css'

const interactive = css.raw({ cursor: 'pointer', transition: 'all 0.2s' })

const card = css({
  _hover: {
    ...interactive,
    _dark: { ...interactive, color: 'white' }
  }
})
```