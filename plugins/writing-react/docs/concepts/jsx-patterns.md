---
title: "JSX Patterns"
---

Patterns are common layout patterns like `stack`, `grid`, `circle` that can be used to speed up your css. Think of them
as a way to avoid repetitive layout styles.

All the patterns provided by Panda are available as JSX components.

> Learn more about the [patterns](/docs/customization/patterns) we provide.

```jsx
import { Stack, Circle } from '../styled-system/jsx'

const App = () => (
  <Stack gap="4" align="flex-start">
    <button>Button</button>
    <Circle size="4" bg="red.300">
      4
    </Circle>
  </Stack>
)
```