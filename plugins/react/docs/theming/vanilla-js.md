---
title: "Vanilla JS"
---

Use the generated `token` function to query design tokens in your project. This is useful if you need direct access to
your design tokens in the `style` attribute or when using CSS-in-JS libraries like `styled-components` or
`@emotion/styled`

> This approach is useful for incrementally adopting Panda in existing projects or
> [dynamic styling](/docs/guides/dynamic-styling#using-token)

### Style Attribute

```tsx filename="src/App.tsx"
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

Each of your design tokens will be available in the generated `/tokens` folder. It looks like this:

```js filename="styled-system/tokens.ts"
const tokens = {
  // ...
  'colors.blue.200': {
    value: '#bfdbfe',
    variable: 'var(--colors-blue-200)'
  }
  // ...
}
```

- The `token()` function returns the raw value of the token.
- The `token.var()` function returns the CSS custom property used to reference the token.

Both functions are typesafe and expect a known dot-separated token path, they also accept a fallback value as a second
argument.

Using the example above, `token('colors.blue.200')` would return `#bfdbfe` and `token.var('colors.blue.200')` would
return `var(--colors-blue-200)`.

### Styled Components

```tsx
import styled from 'styled-components'

const Button = styled.button`
  background: ${token('colors.blue.200')};
`
```

### Emotion

```tsx
import styled from '@emotion/styled'

const Button = styled.button`
  background: ${token('colors.blue.200')};
`
```