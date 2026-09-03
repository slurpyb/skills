---
title: "Object Syntax"
---

In styled-components, you can use the object syntax to style components.

```jsx
import styled from 'styled-components'

const Button = styled.button({
  backgroundColor: '#fff',
  border: '1px solid #000',
  color: '#000',
  padding: '0.5rem 1rem'
})
```

In Panda, you add the style object to the `base` key of the style object. The `styled` factory allows you define base
styles, variants and compound variants of your component.

```jsx
import { styled } from '../styled-system/jsx'

const Button = styled('button', {
  base: {
    backgroundColor: '#fff',
    border: '1px solid #000',
    color: '#000',
    padding: '0.5rem 1rem'
  }
})
```