---
title: "Atomic Slot Recipe"
---

- Create a slot recipe using the `sva` function
- Pass the slot recipe to the `createStyleContext` function
- Use the `withProvider` and `withContext` functions to create compound components

```tsx
// components/ui/card.tsx

import { sva } from 'styled-system/css'
import { createStyleContext } from 'styled-system/jsx'

const card = sva({
  slots: ['root', 'label'],
  base: {
    root: {},
    label: {}
  },
  variants: {
    size: {
      sm: { root: {} },
      md: { root: {} }
    }
  },
  defaultVariants: {
    size: 'sm'
  }
})

const { withProvider, withContext } = createStyleContext(card)

const Root = withProvider('div', 'root')
const Label = withContext('label', 'label')

export const Card = {
  Root,
  Label
}
```

Then you can use the `Root` and `Label` components to create a card.

```tsx
// app/page.tsx

import { Card } from './components/ui/card'

export default function App() {
  return (
    <Card.Root>
      <Card.Label>Hello</Card.Label>
    </Card.Root>
  )
}
```