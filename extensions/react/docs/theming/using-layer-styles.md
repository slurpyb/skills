---
title: "Using layer styles"
---

Now we can use `layerStyle` property in our components.

```jsx
import { css } from '../styled-system/css'

function App() {
  return <div className={css({ layerStyle: 'container' })}>This is inside a container style</div>
}
```