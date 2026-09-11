---
title: "Tagged Template Syntax"
---

In styled-components, the recommended way to style components is to use tagged template literals.

```jsx
import styled from 'styled-components'

const Button = styled.button`
  background-color: #fff;
  border: 1px solid #000;
  color: #000;
  padding: 0.5rem 1rem;
`
```

In Panda, you will use the autogenerate code in the `styled-system` directory at the root of your project.

> Remember to initialize your project with the `--syntax template-literal` flag or update the panda.config.ts file.

```jsx
import { styled } from '../styled-system/jsx'

const Button = styled.button`
  background-color: #fff;
  border: 1px solid #000;
  color: #000;
  padding: 0.5rem 1rem;
`
```