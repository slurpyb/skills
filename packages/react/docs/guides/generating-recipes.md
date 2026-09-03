---
title: "Generating Recipes"
---

The `recipes` property is an object of component recipes you want to generate with their `conditions`.

```js
export default {
  staticCss: {
    recipes: {
      button: [
        {
          size: ['sm', 'md'],
          responsive: true
        },
        { variant: ['*'] }
      ],
      // shorthand for all variants
      tooltip: ['*']
    }
  }
}
```

You can also directly specify a recipe's `staticCss` rules from inside a recipe config, e.g.:

```js
import { defineRecipe } from '@pandacss/dev'

const card = defineRecipe({
  className: 'card',
  base: { color: 'white' },
  variants: {
    size: {
      small: { fontSize: '14px' },
      large: { fontSize: '18px' }
    }
  },
  staticCss: [{ size: ['*'] }]
})
```

would be the equivalent of defining it inside the main config:

```js
import { defineConfig } from '@pandacss/dev'

export default defineConfig({
  // ...
  staticCss: {
    recipes: {
      card: {
        size: ['*']
      }
    }
  }
})
```

Or you could even generate the CSS for every config `recipe` / `slotRecipes` (and each of their variants):

```tsx filename="panda.config.ts"
import { defineConfig } from '@pandacss/dev'

export default defineConfig({
  // ...
  staticCss: {
    recipes: '*'
  }
})
```

This is mostly useful for testing purposes with [`Storybook`](/docs/installation/storybook).