---
title: "Use the custom fonts"
---

```jsx
import { css } from '../styled-system/css'

function Page() {
  return (
    <div>
      <h1 className={css({ fontFamily: 'mona' })}>Mona Sans</h1>
      <code className={css({ fontFamily: 'fira' })}>Fira Code</code>
    </div>
  )
}
```