---
title: "Theming"
---

In Theme UI, you need to wrap your application in a `ThemeProvider` component which is a wrapper around `@emotion/react`
theme context.

```jsx
import { ThemeProvider } from 'theme-ui'

const theme = {
  fonts: {
    body: 'system-ui, sans-serif',
    heading: '"Avenir Next", sans-serif'
  },
  colors: {
    text: '#000',
    background: '#fff'
  }
}

export default function App({ Component, pageProps }) {
  return (
    <ThemeProvider theme={theme}>
      <Component {...pageProps} />
    </ThemeProvider>
  )
}
```

In Panda, you don't need to wrap your application in a `ThemeProvider` component. Instead, you can pass the theme object
to the `panda.config.js` file.

The theme object in Panda is broken down into multiple parts, `tokens` and `semanticTokens`. The theme specification
also required passing the tokens as `{ value: XX }`

```js
// panda.config.js
import { defineConfig } from '@pandacss/dev'

export default defineConfig({
  theme: {
    extend: {
      tokens: {
        fonts: {
          body: { value: 'system-ui, sans-serif' },
          heading: { value: '"Avenir Next", sans-serif' }
        },
        colors: {
          text: { value: '#000' },
          background: { value: '#fff' }
        }
      }
    }
  }
})
```