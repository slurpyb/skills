---
title: "Removing default utilities"
---

Use the `eject: true` property to remove all the default utilities.

Panda doesn't automatically know which tokens are valid for which CSS properties, so it is necessary to tell Panda that
my tokens from the "colors" category are valid for the CSS property "color".

```js
export default defineConfig({
  // ...
  eject: true,
  utilities: {
    color: {
      values: 'colors'
    }
  },
  theme: {
    tokens: {
      colors: {
        primary: { value: '#ff0000' }
      }
    }
  }
})
```

This makes `<p className={css({ color: 'primary' })}> Text </p>` work as expected.