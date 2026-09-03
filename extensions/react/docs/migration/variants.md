---
title: "Variants"
---

In Theme UI, variants are used to create groups of styles based on the theme. It offers variant groups in the theme for
several components.

- `Grid` maps to `theme.grids`
- `Button`, `IconButton` maps to `theme.buttons`
- `NavLink`, `Link` maps to `theme.links`
- `Input`, `Select`, `Textarea` maps to `theme.forms`
- `Heading`, `Text` maps to `theme.text`

```js
// theme.js

export default {
  colors: {
    primary: '#07c',
    secondary: '#30c',
    accent: '#609'
  },
  buttons: {
    primary: {
      color: 'white',
      bg: 'primary'
    },
    secondary: {
      color: 'white',
      bg: 'secondary'
    },
    accent: {
      color: 'white',
      bg: 'accent'
    }
  }
}

// Button.js
<button sx={{ variant: 'buttons.primary' }} />
```

In Panda, multi-variant styles are referred to as recipes. Recipes are a collection of styles that can be applied to any
component.

There are two ways to define recipes in Panda. The first approach is to use the `cva` function which produces atomic
classnames.

```js
import { cva } from 'styled-system/css'

const buttonStyles = cva({
  base: {
    display: 'inline-flex'
  },
  variants: {
    variant: {
      primary: {
        color: 'white',
        bg: 'primary'
      },
      secondary: {
        color: 'white',
        bg: 'secondary'
      },
      accent: {
        color: 'white',
        bg: 'accent'
      }
    }
  }
})

const Demo = () => (
  <button
    className={buttonStyles({
      variant: 'accent'
    })}
  />
)
```

The second approach is to define the recipe in the `theme.recipes` property of the panda config. This is referred to as
'Config recipes' in Panda and allows for sharing recipes across components and projects.

```js
// panda.config.js
import { defineConfig } from '@pandacss/dev'

export default defineConfig({
  theme: {
    extend: {
      recipes: {
        button: {
          className: 'button',
          base: { display: 'inline-flex' },
          variants: {
            variant: {
              primary: { color: 'white', bg: 'primary' },
              secondary: { color: 'white', bg: 'secondary' },
              accent: { color: 'white', bg: 'accent' }
            }
          }
        }
      }
    }
  }
})

// Button.js
import { button } from 'styled-system/recipes'

const Demo = () => <button className={button({ variant: 'accent' })} />
```