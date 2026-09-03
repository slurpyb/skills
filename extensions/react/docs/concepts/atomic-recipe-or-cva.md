---
title: "Atomic Recipe (or cva)"
---

Atomic recipes are a way to create multi-variant atomic styles with a type-safe runtime API.

They are defined using the `cva` function which was inspired by [Class Variance Authority](https://cva.style/). The
`cva` function which takes an object as its argument.

> **Note:** `cva` is not the same as [Class Variance Authority](https://cva.style/). The `cva` from Panda is a
> purpose-built function for creating atomic recipes that are connected to your design tokens and utilities.

### Defining the recipe

```jsx
import { cva } from '../styled-system/css'

const button = cva({
  base: {
    display: 'flex'
  },
  variants: {
    visual: {
      solid: { bg: 'red.200', color: 'white' },
      outline: { borderWidth: '1px', borderColor: 'red.200' }
    },
    size: {
      sm: { padding: '4', fontSize: '12px' },
      lg: { padding: '8', fontSize: '24px' }
    }
  }
})
```

### Using the recipe

The returned value from the `cva` function is a function that can be used to apply the recipe to a component. Here's an
example of how to use the `button` recipe:

```jsx
import { button } from './button'

const Button = () => {
  return <button className={button({ visual: 'solid', size: 'lg' })}>Click Me</button>
}
```

When a recipe is created, Panda will extract and generate CSS for every variant and compoundVariant `css` ahead of time,
as atomic classes.

```css
@layer utilities {
  .d_flex {
    display: flex;
  }

  .bg_red_200 {
    background-color: #fed7d7;
  }

  .color_white {
    color: #fff;
  }

  .border_width_1px {
    border-width: 1px;
  }
  /* ... */
}
```

### Setting the default variants

The `defaultVariants` property is used to set the default variant values for the recipe. This is useful when you want to
apply a variant by default. Here's an example of how to use `defaultVariants`:

```jsx
import { cva } from '../styled-system/css'

const button = cva({
  base: {
    display: 'flex'
  },
  variants: {
    visual: {
      solid: { bg: 'red.200', color: 'white' },
      outline: { borderWidth: '1px', borderColor: 'red.200' }
    },
    size: {
      sm: { padding: '4', fontSize: '12px' },
      lg: { padding: '8', fontSize: '24px' }
    }
  },
  defaultVariants: {
    visual: 'solid',
    size: 'lg'
  }
})
```

### Compound Variants

Compound variants are a way to combine multiple variants together to create more complex sets of styles. They are
defined using the `compoundVariants` property , which takes an array of objects as its argument. Each object in the
array represents a set of conditions that must be met in order for the corresponding styles to be applied.

Here's an example of how to use `compoundVariants` in Panda:

```js
import { cva } from '../styled-system/css'

const button = cva({
  base: {
    padding: '8px 16px',
    borderRadius: '4px',
    fontSize: '16px',
    fontWeight: 'bold'
  },

  variants: {
    size: {
      small: {
        fontSize: '14px',
        padding: '4px 8px'
      },
      medium: {
        fontSize: '16px',
        padding: '8px 16px'
      },
      large: {
        fontSize: '18px',
        padding: '12px 24px'
      }
    },
    color: {
      primary: {
        backgroundColor: 'blue',
        color: 'white'
      },
      secondary: {
        backgroundColor: 'gray',
        color: 'black'
      }
    },
    disabled: {
      true: {
        opacity: 0.5,
        cursor: 'not-allowed'
      }
    }
  },

  // compound variants
  compoundVariants: [
    // apply when both small size and primary color are selected
    {
      size: 'small',
      color: 'primary',
      css: {
        border: '2px solid blue'
      }
    },
    // apply when both large size and secondary color are selected and the button is disabled
    {
      size: 'large',
      color: 'secondary',
      disabled: true,
      css: {
        backgroundColor: 'lightgray',
        color: 'darkgray',
        border: 'none'
      }
    },
    // apply when both small or medium size, and secondary color variants are applied
    {
      size: ['small', 'medium'],
      color: 'secondary',
      css: {
        fontWeight: 'extrabold'
      }
    }
  ]
})
```

Here's an example usage of the `button` recipe:

```jsx
import { button } from './button'

const Button = () => {
  // will apply size: small, color: primary, css: { border: '2px solid blue' }
  return <button className={button({ size: 'small', color: 'primary' })}>Click Me</button>
}
```

Overall, using compound variants allows you to create more complex sets of styles that can be applied to your components
based on multiple conditions.

By combining simple variants together in this way, you can create a wide range of visual styles without cluttering up
your code with lots of conditional logic.

### TypeScript Guide

Panda provides a `RecipeVariantProps` type utility that can be used to infer the variant properties of a recipe.

This is useful when you want to use the recipe in JSX and want to get type safety for the variants.

```tsx
import { styled } from '../styled-system/jsx'
import { cva, type RecipeVariantProps } from '../styled-system/css'

const buttonStyle = cva({
  base: {
    color: 'red',
    textAlign: 'center'
  },
  variants: {
    size: {
      small: {
        fontSize: '1rem'
      },
      large: {
        fontSize: '2rem'
      }
    }
  }
})

export type ButtonVariants = RecipeVariantProps<typeof buttonStyle> // { size?: 'small' | 'large' }

export const Button = styled('button', buttonStyle)
```

### Usage in JSX

You can create a JSX component from any existing atomic recipe by using the `styled` function from the `/jsx`
entrypoint.

The `styled` function takes the element type as its first argument, and the recipe as its second argument.

> Make sure to add the `jsxFramework` option to your `panda.config` file, and run `panda codegen` to generate the JSX
> entrypoint.

```js
import { cva } from '../styled-system/css'
import { styled } from '../styled-system/jsx'

const buttonStyle = cva({
  base: {
    color: 'red',
    textAlign: 'center'
  },
  variants: {
    size: {
      small: {
        fontSize: '1rem'
      },
      large: {
        fontSize: '2rem'
      }
    }
  }
})

const Button = styled('button', buttonStyle)
```

Then you can use the component in JSX

```jsx
<Button size="large">Click me</Button>
```