---
title: "Tokens and Themes"
---

### Defining Tokens

In styled-components, you can define tokens in a theme object that is passed to the `ThemeProvider`.
This requires the use of React's context API to access the theme object in your styles

```tsx
import { ThemeProvider } from 'styled-components'

const theme = {
  colors: {
    primary: 'blue',
    secondary: 'red'
  }
}

const App = () => (
  <ThemeProvider theme={theme}>
    <Button>Button</Button>
  </ThemeProvider>
)
````

In Panda, you define tokens in the `theme` key of the `panda.config.ts` file. This allows you to access the tokens in
your styles without the need for React's context API.

```tsx
// panda.config.ts
import { defineConfig } from '@pandacss/dev'

export default defineConfig({
  theme: {
    extend: {
      tokens: {
        colors: {
          primary: { value: 'blue' },
          secondary: { value: 'red' }
        }
      }
    }
  }
})
```

### Using Tokens

In styled-components, you can use tokens in your styles using a function approach that provides the `theme` prop, and
requires ambient type declarations to get type safety.

```tsx
import styled from 'styled-components'

// link.tsx
const StyledLink = styled.a(({ theme }) => ({
  color: theme.colors.primary,
  display: 'block',
  textDecoration: 'none'
}))

// theme.d.ts
declare module 'styled-components' {
  export interface DefaultTheme {
    colors: {
      primary: string
      secondary: string
    }
  }
}
```

In Panda, the tokens are automatically available in your styles and connected to each css property, removing the need
for an interpolation function.

```tsx
// panda.config.ts
import { defineConfig } from '@pandacss/dev'

export default defineConfig({
  theme: {
    // extend the base theme
    extend: {
      tokens: {
        // add custom colors
        colors: {
          primary: { value: 'blue' },
          secondary: { value: 'red' }
        }
      }
    }
  }
})

// link.tsx
import { styled } from '../styled-system/jsx'

const StyledLink = styled('a', {
  base: {
    color: 'primary',
    display: 'block',
    textDecoration: 'none'
  }
})
```