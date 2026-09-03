---
title: "Mixed conditions"
---

You can also use mixed conditions (nested at-rules/selectors) under a single condition name:

```tsx
import { defineConfig } from '@pandacss/dev'

export default defineConfig({
  conditions: {
    extend: {
      supportHover: ['@media (hover: hover) and (pointer: fine)', '&:hover']
    }
  }
})
```

```ts
import { css } from '../styled-system/css'

css({
  _supportHover: {
    color: 'red'
  }
})
```

will generate the following CSS:

```css
@media (hover: hover) and (pointer: fine) {
  &:hover {
    color: red;
  }
}
```