---
title: "Using tokens"
---

Use the `token()` function or `{}` syntax in your template literals to reference design tokens in your styles. Panda
will automatically generate the corresponding CSS variables.

```js
import { css } from '../styled-system/css'

const className = css`
  font-size: {fontSizes.md};
  font-weight: token(fontWeights.bold, 700);
`
```