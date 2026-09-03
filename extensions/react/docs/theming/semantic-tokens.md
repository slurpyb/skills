---
title: "Semantic Tokens"
---

Semantic tokens are tokens that are designed to be used in a specific context. In most cases, the value of a semantic
token references to an existing token.

> To reference a value in a semantic token, use the `{}` syntax.

For example, assuming we've defined the following tokens:

- `red` and `green` are raw tokens that define the color red and green.
- `danger` and `success` are semantic tokens that reference the `red` and `green` tokens.

```js
import { defineConfig } from '@pandacss/dev'

export default defineConfig({
  theme: {
    tokens: {
      colors: {
        red: { value: '#EE0F0F' },
        green: { value: '#0FEE0F' }
      }
    },
    semanticTokens: {
      colors: {
        danger: { value: '{colors.red}' },
        success: { value: '{colors.green}' }
      }
    }
  }
})
```

> ⚠️ Semantic Token values need to be nested in an object with a `value` key. This is to allow for additional properties
> like `description` and more in the future.

Semantic tokens can also be changed based on the [conditions](/docs/concepts/conditional-styles) like light and dark
modes.

For example, if you want a color to change automatically based on light or dark mode.

```js
import { defineConfig } from '@pandacss/dev'

export default defineConfig({
  // ...
  theme: {
    semanticTokens: {
      colors: {
        danger: {
          value: { base: '{colors.red}', _dark: '{colors.darkred}' }
        },
        success: {
          value: { base: '{colors.green}', _dark: '{colors.darkgreen}' }
        }
      }
    }
  }
})
```

> NOTE 🚨: The conditions used in semantic tokens must be an at-rule or parent selector
> [condition](/docs/concepts/conditional-styles#reference).