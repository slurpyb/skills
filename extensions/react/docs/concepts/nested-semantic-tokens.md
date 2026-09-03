---
title: "Nested Semantic Tokens"
---

If nested tokens show as raw paths (e.g., `colors.base.accent`) instead of CSS variables, use glob patterns:

```ts filename="panda.config.ts"
semanticTokens: {
  colors: {
    button: {
      primary: {
        DEFAULT: { value: '{colors.blue.500}' },
        hover: { value: '{colors.blue.600}' }
      }
    }
  }
},
colorPalette: {
  include: ['button.*']  // Include all nested paths
}
```

Usage:

```tsx
className={css({
  colorPalette: 'button.primary',
  bg: 'colorPalette',
  _hover: { bg: 'colorPalette.hover' }
})}
```