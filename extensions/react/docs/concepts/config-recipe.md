---
title: "Config Recipe"
---

Config recipes are extracted and generated just in time, this means regardless of the number of recipes in the config,
only the recipes and variants you use will exist in the generated CSS.

The config recipe takes the following additional properties:

- `className`: The name of the recipe. Used in the generated class name
- `jsx`: An array of JSX components that use the recipe. Defaults to the uppercase version of the recipe name
- `description`: An optional description of the recipe (used in the js-doc comments)

> As of v0.9, the `name` property is removed in favor of `className`

### Defining the recipe

To define a config recipe, import the `defineRecipe` helper function

```jsx filename="button.recipe.ts"
import { defineRecipe } from '@pandacss/dev'

export const buttonRecipe = defineRecipe({
  className: 'button',
  description: 'The styles for the Button component',
  base: {
    display: 'flex'
  },
  variants: {
    visual: {
      funky: { bg: 'red.200', color: 'white' },
      edgy: { border: '1px solid {colors.red.500}' }
    },
    size: {
      sm: { padding: '4', fontSize: '12px' },
      lg: { padding: '8', fontSize: '40px' }
    },
    shape: {
      square: { borderRadius: '0' },
      circle: { borderRadius: 'full' }
    }
  },
  defaultVariants: {
    visual: 'funky',
    size: 'sm',
    shape: 'circle'
  }
})
```

### Adding recipe to config

To add the recipe to the config, you’d need to add it to the `theme.recipes` object.

```jsx filename="panda.config.ts"
import { defineConfig } from '@pandacss/dev'
import { buttonRecipe } from './button.recipe'

export default defineConfig({
  //...
  jsxFramework: 'react',
  theme: {
    extend: {
      recipes: {
        button: buttonRecipe
      }
    }
  }
})
```

### Generate JS code

This generates a recipes folder the specified `outdir` which is `styled-system` by default. If Panda doesn’t
automatically generate your CSS file, you can run the `panda codegen` command.

You only need to import the recipes into the component files where you need to use them.

### Using the recipe

To use the recipe, you can import the recipe from the `<outdir>/recipes` entrypoint and use it in your component. Panda
tracks the usage of the recipe and only generates CSS of the variants used in your application.

```js
import { button } from '../styled-system/recipes'

function App() {
  return (
    <div>
      <button className={button()}>Click me</button>
      <button className={button({ shape: 'circle' })}>Click me</button>
    </div>
  )
}
```

The generated css is registered under the `recipe` [cascade layer](/docs/concepts/cascade-layers.mdx) with the class
name that matches the recipe-variant name pattern `<recipe-className>--<variant-name>`.

> **Technical Notes 📝:** Only the recipe and variants used in your application are generated. Not more!

```css
@layer recipes {
  @layer base {
    .button {
      font-size: var(--font-sizes-lg);
    }
  }

  .button--visual-funky {
    background-color: var(--colors-red-200);
    color: var(--colors-white);
  }

  .button--size-lg {
    padding: var(--space-8);
    font-size: var(--font-sizes-40px);
  }
}
```

### Responsive and Conditional variants

Recipes created in the config have a **special** feature; they can be applied based on a specific breakpoints or
conditions.

Here's how to tweak the size variant of the button recipe based on breakpoints.

```jsx
import { button } from '../styled-system/recipes'

function App() {
  return (
    <div>
      <button className={button({ size: { base: 'sm', md: 'lg' } })}>Click me</button>
    </div>
  )
}
```

> In most cases, we don't recommend applying conditional variants inline. Ideally, you might want to render different
> views for your responsive breakpoints.

### TypeScript Guide

Every recipe ships a type interface for its accepted variants. You can import them from the `styled-system/recipes`
entrypoint.

For the button recipe, we can import the `ButtonVariants` type like so:

```ts
import React from 'react'
import type { ButtonVariants } from '../styled-system/recipes'

type ButtonProps = ButtonVariants & {
  children: React.ReactNode
}
```

### Usage in JSX

Layer recipes can be consumed directly in your custom JSX components. Panda will automatically track the usage of the
recipe if the component name matches the recipe name.

For example, if your recipe is called `button` and you create a `Button` component from it, Panda will automatically
track the usage of the variant properties.

```tsx
import React from 'react'
import { button, type ButtonVariants } from '../styled-system/recipes'

type ButtonProps = ButtonVariants & {
  children: React.ReactNode
}

const Button = (props: ButtonProps) => {
  const { children, size } = props
  return (
    <button {...props} className={button({ size })}>
      {children}
    </button>
  )
}

const App = () => {
  return (
    <div>
      <Button size="lg">Click me</Button>
    </div>
  )
}
```

### Advanced JSX Tracking

We recommend that you use the recipe functions in most cases, in design systems there might be a need to compose
existing components (like Button) to create new components.

To track the usage of the recipes in these cases, you'll need to add the `jsx` hint for the recipe config

```js {12} filename="button.recipe.ts"
import { defineRecipe } from '@pandacss/dev'

const button = defineRecipe({
  base: {
    color: 'red',
    fontSize: '1.5rem'
  },
  variants: {
    // ...
  },
  // Add the jsx hint to track the usage of the recipe in JSX, you can use regex to match multiple components
  jsx: ['Button', 'PageButton']
})
```

Then you can create a new component that uses the `Button` component and Panda will track the usage of the `button`
recipe as well.

```tsx
const PageButton = (props: ButtonProps) => {
  const { children, size } = props
  return (
    <Button {...props} size={size}>
      {children}
    </Button>
  )
}
```

#### Extending a preset recipe

If you're using a recipe from a preset, you can still extend it in your config.

```js
import { defineConfig } from '@pandacss/dev'

export default defineConfig({
  //...
  jsxFramework: 'react',
  theme: {
    extend: {
      recipes: {
        button: {
          className: 'something-else', // 👈 override the className
          base: {
            color: 'red', // 👈 replace some part of the recipe
            fontSize: '1.5rem' // or add new styles
          },
          variants: {
            // ... // 👈 add or extend new variants
          },
          jsx: ['Button', 'PageButton'] // 👈 extend the jsx tracking hint
        }
      }
    }
  }
})
```

Learn more about the [extend](/docs/concepts/extend.md) keyword.