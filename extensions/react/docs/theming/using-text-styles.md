---
title: "Using text styles"
---

Now we can use `textStyle` property in our components.

```jsx
import { css } from '../styled-system/css'

function App() {
  return <p className={css({ textStyle: 'body' })}>This is a paragraph from Panda with the body text style.</p>
}
```