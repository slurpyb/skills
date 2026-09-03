---
title: "Methods and Properties"
---

Both atomic and config recipe ships a helper methods and properties that can be used to get information about the
recipe.

- `variantKeys`: An array of the recipe variant keys
- `variantMap`: An object of the recipe variant keys and their values
- `splitVariantProps`: A function that takes an object as its argument and returns an array containing the recipe
  variant props and the rest of the props

```js
import { cva } from '../styled-system/css'

const buttonRecipe = cva({
  base: {
    color: 'red',
    fontSize: '1.5rem'
  },
  variants: {
    size: {
      sm: {
        fontSize: '1rem'
      },
      md: {
        fontSize: '2rem'
      }
    }
  }
})

buttonRecipe.variantKeys
// => ['size']

buttonRecipe.variantMap
// => { size: ['sm', 'md'] }

buttonRecipe.splitVariantProps({ size: 'sm', onClick() {} })
// => [{ size: 'sm'}, { onClick() {} }]
```

These methods and properties are useful when creating custom components or writing Storybook stories for your recipes.

Here's a Storybook example.

```tsx filename="button.stories.tsx"
import { Button, buttonRecipe } from './components/button'

export default {
  title: 'Button',
  component: Button,
  argTypes: {
    size: {
      control: {
        type: 'select',
        options: buttonRecipe.variantMap.size
      }
    }
  }
}

export const Demo = {
  render: args => <Button {...args}>Click me</Button>
}
```