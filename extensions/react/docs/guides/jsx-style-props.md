---
title: "JSX Style Props"
---

Panda supports forwarding JSX style properties to any element in your codebase.

For example, let's say we create a Card component that accepts a `color` prop:

```tsx filename="Card.tsx"
import { styled } from '../styled-system/jsx'

const Card = props => {
  return <styled.div px="4" py="3" {...props} />
}
```

Then you add more style props to the Card component in a different file:

```tsx filename="App.tsx"
const App = () => {
  return (
    <Card color="blue.300">
      <p>Some content</p>
    </Card>
  )
}
```

As long as all prop-value pairs are statically extractable, Panda will automatically generate the CSS, so avoid using
runtime values:

```tsx filename="App.tsx"
import { useState } from 'react'

const App = () => {
  const [color, setColor] = useState('blue.300')

  // ❌ Avoid: Panda can't determine the value of color at build-time
  return (
    <Card color={color}>
      <p>Some content</p>
    </Card>
  )
}
```