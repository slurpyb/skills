---
title: "Tokens and Theme"
---

### Tokens

In Stitches, tokens are defined in the `theme` key of the `createStitches` method.

```ts
import { createStitches } from '@stitches/react'

const { styled, css } = createStitches({
  theme: {
    colors: {
      gray100: 'hsl(206,22%,99%)',
      gray200: 'hsl(206,12%,97%)'
    }
  },
  space: {},
  fonts: {}
})

// usage
const styles = css({
  backgroundColor: '$gray100'
})
```

In Panda, tokens are defined in the `theme` key of the `panda.config` function.

```ts
import { defineConfig } from '@pandacss/dev'

export default defineConfig({
  theme: {
    tokens: {
      colors: {
        gray100: { value: 'hsl(206,22%,99%)' },
        gray200: { value: 'hsl(206,12%,97%)' }
      },
      spacing: {},
      fonts: {}
    },
    semanticTokens: {
      // ...
    }
  }
})

// usage
import { css } from '../styled-system/css'

const styles = css({
  backgroundColor: 'gray100'
})
```

Notice that in Panda, you don't need to use the `$` prefix to access the tokens. If you really want to use the `$`
prefix, you can either update the name of the token:

```diff
export default defineConfig({
  theme: {
    colors: {
-      gray100: { value: 'hsl(206,22%,99%)' },
+      $gray100: { value: 'hsl(206,22%,99%)' },
    },
  }
})
```

Or you can tweak the token engine to format them with the `$` prefix:

```ts
import { defineConfig } from '@pandacss/dev'

export default defineConfig({
  // ...
  hooks: {
    'tokens:created': ({ configure }) => {
      configure({
        formatTokenName: path => '$' + path.join('-')
      })
    }
  }
})
```

### Themes

In Stitches, the `createTheme` function is used to define dark theme values.

```tsx
import { createStitches } from '@stitches/react'

const { createTheme } = createStitches({})

// create theme
const darkTheme = createTheme({
  colors: {
    gray100: 'hsl(206,8%,12%)',
    gray200: 'hsl(206,7%,14%)'
  }
})

// apply theme
<div className={darkTheme}>
  <div>Content nested in dark theme.</div>
</div>
```

In Panda, themes are designed as semantic tokens. You can define the semantic tokens in the `semanticTokens` key of the
`panda.config` function.

```ts
import { defineConfig } from '@pandacss/dev'

export default defineConfig({
  theme: {
    semanticTokens: {
      colors: {
        gray100: {
          value: { base: 'hsl(206,22%,99%)', _dark: 'hsl(206,8%,12%)' }
        },
        gray200: {
          value: { base: 'hsl(206,12%,97%)', _dark: 'hsl(206,7%,14%)' }
        }
      }
    }
  }
})
```

### Token Aliases

In Stitches, you can create locally scoped tokens using the `$$` prefix

```ts
import { styled } from '@stitches/react'

const Button = styled('button', {
  $$shadowColor: '$colors$pink500',
  boxShadow: '0 0 0 15px $$shadowColor'
})
```

In Panda, there's no special syntax, you need to use the css variable syntax. CSS variables are able to query the theme
tokens directly using dot notation

```ts
import { styled } from '../styled-system/jsx'

const Button = styled('button', {
  base: {
    '--shadowColor': 'colors.pink500',
    boxShadow: '0 0 0 15px var(--shadowColor)'
  }
})
```