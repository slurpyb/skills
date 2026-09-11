---
title: "Example"
---

After running the `panda init` command you should see something similar to this:

```ts
import { defineConfig } from '@pandacss/dev'

export default defineConfig({
  // ...

  // Useful for theme customization
  theme: {
    extend: {} // 👈 it's already there! perfect, now you just need to add your customizations in this object
  }

  // ...
})
```

Let's say you want to add a new color to the default theme. You can do it like this:

```ts
import { defineConfig } from '@pandacss/dev'

export default defineConfig({
  theme: {
    extend: {
      colors: {
        primary: { value: '#ff0000' }
      }
    }
  }
})
```

This will add a new color to the default theme, without erasing the other ones.

Now, let's say we want to create new property `br` that applies a border radius to an element.

```ts
import { defineConfig } from '@pandacss/dev'

export default defineConfig({
  utilities: {
    extend: {
      br: {
        className: 'rounded', // css({ br: "sm" }) => rounded-sm
        values: 'radii', // connect values to the radii tokens
        transform(value) {
          return { borderRadius: value }
        }
      }
    }
  }
})
```

What if this utility was coming from a preset (`@acme/my-preset`) ? You can extend any specific part, as it will be
deeply merged with the existing one:

```ts
import { defineConfig } from '@pandacss/dev'

export default defineConfig({
  presets: ['@acme/my-preset']
  utilities: {
    extend: {
      br: {
        className: 'br' // css({ br: "sm" }) => br-sm
      }
    }
  }
})
```