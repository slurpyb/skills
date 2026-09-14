---
title: "Config Slot Recipe"
---

Config slot recipes are very similar atomic recipes except that they use well-defined classNames and store the styles in
the `recipes` cascade layer.

The config slot recipe takes the following additional properties:

- `className`: The name of the recipe. Used in the generated class name
- `jsx`: An array of JSX components that use the recipe. Defaults to the uppercase version of the recipe name
- `description`: An optional description of the recipe (used in the js-doc comments)

### Defining the recipe

To define a config slot recipe, import the `defineSlotRecipe` function

```jsx filename="checkbox.recipe.ts"
import { defineSlotRecipe } from '@pandacss/dev'

export const checkboxRecipe = defineSlotRecipe({
  className: 'checkbox',
  description: 'The styles for the Checkbox component',
  slots: ['root', 'control', 'label'],
  base: {
    root: { display: 'flex', alignItems: 'center', gap: '2' },
    control: { borderWidth: '1px', borderRadius: 'sm' },
    label: { marginStart: '2' }
  },
  variants: {
    size: {
      sm: {
        control: { width: '8', height: '8' },
        label: { fontSize: 'sm' }
      },
      md: {
        control: { width: '10', height: '10' },
        label: { fontSize: 'md' }
      }
    }
  },
  defaultVariants: {
    size: 'sm'
  }
})
```

### Adding recipe to config

To add the recipe to the config, you’d need to add it to the `slotRecipes` property of the `theme`

```jsx filename="panda.config.ts"
import { defineConfig } from '@pandacss/dev'
import { checkboxRecipe } from './checkbox.recipe'

export default defineConfig({
  //...
  jsxFramework: 'react',
  theme: {
    extend: {
      slotRecipes: {
        checkbox: checkboxRecipe
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
import { css } from '../styled-system/css'
import { checkbox } from '../styled-system/recipes'

const Checkbox = () => {
  const classes = checkbox({ size: 'sm' })
  return (
    <label className={classes.root}>
      <input type="checkbox" className={css({ srOnly: true })} />
      <div className={classes.control} />
      <span className={classes.label}>Checkbox Label</span>
    </label>
  )
}
```

The generated css is registered under the `recipe` [cascade layer](/docs/concepts/cascade-layers.mdx) with the class
name that matches the recipe-slot-variant name pattern `<recipe-className>__<slot-name>--<variant-name>`.

```css
@layer recipes {
  @layer base {
    .checkbox__root {
      display: flex;
      align-items: center;
      gap: var(--space-2);
    }

    .checkbox__control {
      border-width: var(--border-widths-1px);
      border-radius: var(--radii-sm);
    }

    .checkbox__label {
      margin-start: var(--space-2);
    }
  }

  .checkbox__control--size-sm {
    width: var(--space-8);
    height: var(--space-8);
  }

  .checkbox__label--size-sm {
    font-size: var(--font-sizes-sm);
  }

  .checkbox__control--size-md {
    width: var(--space-10);
    height: var(--space-10);
  }

  .checkbox__label--size-md {
    font-size: var(--font-sizes-md);
  }
}
```

### TypeScript Guide

Every slot recipe ships a type interface for its accepted variants. You can import them from the `styled-system/recipes`
entrypoint.

For the checkbox recipe, we can import the `CheckboxVariants` type like so:

```ts
import React from 'react'
import type { CheckboxVariants } from '../styled-system/recipes'

type CheckboxProps = CheckboxVariants & {
  children: React.ReactNode
  value?: string
  onChange?: (value: string) => void
}
```

### `defineParts`

It can be useful when you want to have the equivalent of a slot recipe without needing to split the class names bindings
and instead just having a className that handles children on 1 DOM element.

It pairs well with [ZagJs](https://zagjs.com/) and [Ark-UI](https://ark-ui.com/)

Let's refactor the previous example to use parts instead of slots:

```ts
import { defineParts, definetRecipe } from '@pandacss/dev'

const parts = defineParts({
  root: { selector: '& [data-part="root"]' },
  control: { selector: '& [data-part="control"]' },
  label: { selector: '& [data-part="label"]' }
})

export const checkboxRecipe = defineRecipe({
  className: 'checkbox',
  description: 'A checkbox style',
  base: parts({
    root: { display: 'flex', alignItems: 'center', gap: '2' },
    control: { borderWidth: '1px', borderRadius: 'sm' },
    label: { marginStart: '2' }
  }),
  variants: {
    size: {
      sm: parts({
        control: { width: '8', height: '8' },
        label: { fontSize: 'sm' }
      }),
      md: parts({
        control: { width: '10', height: '10' },
        label: { fontSize: 'md' }
      })
    }
  },
  defaultVariants: {
    size: 'sm'
  }
})
```