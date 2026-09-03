---
title: "Removing default tokens"
---

To remove the default design tokens injected by Panda, set the `presets` key to an empty array:

```js
export default defineConfig({
  // ...
  presets: []
})
```

This allows you to define your own tokens, without having to use the `extend` key in the theme.

```js
export default defineConfig({
  // ...
  theme: {
    tokens: {
      colors: {
        primary: { value: '#ff0000' }
      }
    }
  }
})
```