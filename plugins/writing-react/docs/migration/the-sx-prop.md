---
title: "The sx prop"
---

In Theme UI, you can use the `sx` prop to style any component when you add the `jsxImportSource` pragma to the top of
your file.

```jsx
/** @jsxImportSource theme-ui */

export const Demo = props => (
  <div
    {...props}
    sx={{
      color: 'white',
      bg: 'primary',
      fontSize: 4
    }}
  />
)
```

Panda offers three similar ways to style components. The first approach is to use the `styled` element syntax and rename
`sx` to `css`

```jsx
import { styled } from 'styled-system/jsx'

export const Demo = props => (
  <styled.div
    {...props}
    css={{
      color: 'white',
      bg: 'primary',
      fontSize: 4
    }}
  />
)
```

The second approach is to create styled components using the `styled` function. This approach allows you to create style
variants.

```jsx
import { styled } from 'styled-system/jsx'

export const Demo = styled('div', {
  base: {
    color: 'white',
    bg: 'primary',
    fontSize: 4
  }
})
```

The simplest approach is to use the `css` function to write one-off styles.

```jsx
import { css } from 'styled-system/css'

export const Demo = props => (
  <div
    {...props}
    className={css({
      color: 'white',
      bg: 'primary',
      fontSize: 4
    })}
  />
)
```