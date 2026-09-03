---
title: "Token Creators"
---

To help defining tokens in a type-safe way, you can use the following helpers:

### `defineTokens`

```ts
import { defineTokens } from '@pandacss/dev'

const theme = {
  tokens: defineTokens({
    colors: {
      primary: { value: '#ff0000' }
    }
  })
}
```

You can also use this function to define tokens in a separate file:

```ts filename="tokens/colors.ts"
import { defineTokens } from '@pandacss/dev'

export const colors = defineTokens.colors({
  primary: { value: '#ff0000' }
})
```

### `defineSemanticTokens`

```ts
import { defineSemanticTokens } from '@pandacss/dev'

const theme = {
  semanticTokens: defineSemanticTokens({
    colors: {
      primary: {
        value: { _light: '{colors.blue.400}', _dark: '{colors.blue.200}' }
      }
    }
  })
}
```

You can also use this function to define tokens in a separate file:

```ts filename="tokens/colors.semantic.ts"
import { defineSemanticTokens } from '@pandacss/dev'

export const colors = defineSemanticTokens.colors({
  primary: {
    value: { _light: '{colors.blue.400}', _dark: '{colors.blue.200}' }
  }
})
```