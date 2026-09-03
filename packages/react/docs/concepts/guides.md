---
title: "Guides"
---

### Config Recipes

The rules of config recipes still applies when using `createStyleContext`. Ensure the name of the final component
matches the name of the recipe.

> If you want to use a custom name, you can configure the recipe's `jsx` property in the `panda.config.ts` file.

```tsx
// recipe name is "card"
import { card } from '../styled-system/recipes'

const { withRootProvider, withContext } = createStyleContext(card)

const Root = withRootProvider('div')
const Header = withContext('header', 'header')
const Body = withContext('body', 'body')

// The final component name must be "Card"
export const Card = {
  Root,
  Header,
  Body
}
```

### Default Props

Use `defaultProps` option to provide default props to the component.

```tsx
const { withContext } = createStyleContext(card)

export const CardHeader = withContext('header', 'header', {
  defaultProps: {
    role: 'banner'
  }
})
```