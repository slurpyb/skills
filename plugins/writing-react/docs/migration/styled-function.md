---
title: "styled function"
---

In Stitches, the `styled` function can be used to create components that are bound to both regular and variant styles
objects.

```tsx
import { styled } from '@stitches/react'

const Button = styled('button', {
  // base styles
  backgroundColor: 'gainsboro',
  borderRadius: '9999px',

  variants: {
    // variant styles
  }
})
```

In Panda, the base styles object needs to added to the `base` key.

```tsx
import { styled } from '../styled-system/jsx'

const Button = styled('button', {
  // base styles
  base: {
    backgroundColor: 'gainsboro',
    borderRadius: '9999px'
  },
  variants: {
    // variant styles
  }
})
```

In Stitches, the styled function generates a unique className for each variant.

```tsx
import { styled } from '@stitches/react'

const Button = styled('button', {})
// => <button class="c-coNKBW c-coNKBW-dnSdJM-variant-primary">Button</button>
```

In Panda, you can decide if you want unique classNames for the recipe or you want atomic classNames.

- **Atomic classes** using the `cva` function or defining the recipe inline in the `styled` function

```tsx
import { styled } from '../styled-system/jsx'

const Button = styled('button', {
  base: {
    backgroundColor: 'gainsboro',
    borderRadius: '9999px'
  }
})
// => <button class="bg_gainsboro rounded_999px">Button</button>
```

- **Selector classes** by defining the recipe in the `panda.config.ts` file. This approach only generates the classes
  and css for the variants that are used in the project.

```ts
import { defineConfig, defineRecipe } from '@pandacss/dev'

const buttonStyle = defineRecipe({
  className: 'button',
  base: {
    backgroundColor: 'gainsboro',
    borderRadius: '9999px'
  },
  variants: {
    // variant styles
  }
})

export default defineConfig({
  theme: {
    extend: {
      recipes: {
        buttonStyle
      }
    }
  }
})
```

> You might need to run `panda codegen --clean` to generate the recipe functions.

```tsx
import { styled } from '../styled-system/jsx'
import { buttonStyle } from '../styled-system/recipes'

// create a styled component using the recipe function
const Button = styled('button', buttonStyle)

// or you can use directly in the JSX
<button className={buttonStyle({ variant: 'primary' })}>Button</button>

// => <button className="button button--variant-primary">Button</button>
```