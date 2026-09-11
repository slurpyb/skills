---
title: "Style props"
---

Build UIs quickly by passing css properties as "props" to your components.

While you can get very far by using the `className` prop and function from Panda, style props provide a more ergonomic
way of expressing styles.

Panda will extract the style props through static analysis and generate the CSS at build time.

> If you use Chakra UI, Styled System, or Theme UI, you'll feel right at home right away 😊

```jsx
import { css } from '../styled-system/css'
import { styled } from '../styled-system/jsx'

// The className approach
const Button = ({ children }) => (
  <button
    className={css({
      bg: 'blue.500',
      color: 'white',
      py: '2',
      px: '4',
      rounded: 'md'
    })}
  >
    {children}
  </button>
)

// The style props approach
const Button = ({ children }) => (
  <styled.button bg="blue.500" color="white" py="2" px="4" rounded="md">
    {children}
  </styled.button>
)
```