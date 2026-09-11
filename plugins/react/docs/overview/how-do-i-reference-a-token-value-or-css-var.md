---
title: "How do I reference a token value or css var?"
---

You can reference a token value or it's associated css variable using the
[`token` function](/docs/theming/usage#vanilla-js). This function allows you to access and use the values stored in your
theme tokens at runtime.

```tsx
import { token } from '../styled-system/tokens'

function App() {
  return (
    <div
      style={{
        background: token('colors.blue.200')
      }}
    />
  )
}
```