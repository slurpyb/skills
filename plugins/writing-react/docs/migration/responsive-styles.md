---
title: "Responsive Styles"
---

### Tagged Template Syntax

In styled-components, you need to write the media query styles manually or use a helper function like
`styled-media-query`.

```tsx
import styled from 'styled-components'

const Button = styled.button`
  background-color: #fff;
  border: 1px solid #000;
  color: #000;
  padding: 0.5rem 1rem;

  @media (min-width: 768px) {
    padding: 1rem 2rem;
  }
`
```

In Panda, it's pretty much the same thing except that you can't do any interpolation in the media query styles due the
static nature of Panda.

```tsx
import { styled } from '../styled-system/jsx'

const Button = styled.button`
  background-color: #fff;
  border: 1px solid #000;
  color: #000;
  padding: 0.5rem 1rem;

  @media (min-width: 768px) {
    padding: 1rem 2rem;
  }
`
```

### Object Syntax

In styled-components, you can use the `styled-media-query` helper function to write responsive styles.

```tsx
import styled from 'styled-components'
import media from 'styled-media-query'

const Button = styled.button({
  backgroundColor: '#fff',
  border: '1px solid #000',
  color: '#000',
  padding: '0.5rem 1rem',

  [media.greaterThan('medium')]: {
    padding: '1rem 2rem'
  }
})
```

In Panda, you can use the pseudo props API to define responsive styles.

```tsx
import { styled } from '../styled-system/jsx'

const Button = styled('button', {
  base: {
    backgroundColor: '#fff',
    border: '1px solid #000',
    color: '#000',
    padding: { base: '0.5rem 1rem', md: '1rem 2rem' }
  }
})
```