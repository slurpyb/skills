---
title: "Animations"
---

In styled components, you can define keyframes using the `keyframes` method.

```ts
import styled, { keyframes } from 'styled-components'

const rotate = keyframes`
  from {
    transform: rotate(0deg);
  }

  to {
    transform: rotate(360deg);
  }
`

// usage
const Button = styled.button`
  &:hover {
    animation: ${rotate} 200ms;
  }
`
```

In Panda, you define keyframes in the `theme.keyframes` key of the `panda.config` function.

```ts
import { defineConfig } from '@pandacss/dev'

export default defineConfig({
  theme: {
    extend: {
      keyframes: {
        rotate: {
          from: {
            transform: 'rotate(0deg)'
          },
          to: {
            transform: 'rotate(360deg)'
          }
        }
      }
    }
  }
})

// usage
import { styled } from '../styled-system/jsx'

const Button = styled.button`
  &:hover {
    animation: rotate 200ms;
  }
`
```