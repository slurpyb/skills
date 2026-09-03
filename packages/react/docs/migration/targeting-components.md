---
title: "Targeting Components"
---

In styled-components, you can target existing styled components within the styled function

```tsx
import styled from 'styled-components'

const Link = styled.a`
  background: papayawhip;
  color: #bf4f74;
`

const Icon = styled.svg`
  width: 48px;
  height: 48px;

  ${Link}:hover & {
    fill: rebeccapurple;
  }
`
```

In Panda, you need to use the native selector directly. This is largely due to the static nature of Panda

```tsx
import { styled } from '../styled-system/jsx'

const Link = styled.a`
  background: papayawhip;
  color: #bf4f74;
`

const Icon = styled.svg`
  width: 48px;
  height: 48px;

  .Link:hover & {
    fill: rebeccapurple;
  }
`

const App = () => (
  <Link className="Link">
    <Icon />
  </Link>
)
```