---
title: "Re-using Panda presets"
---

Panda offers 2 presets:

- `@pandacss/preset-base`: This is a relatively unopinionated set of utilities for mapping CSS properties to values
  (almost everyone will want these)

You can use these presets by installing them via npm and adding them to your `presets` key:

```js
export default defineConfig({
  // ...
  presets: ['@pandacss/preset-base']
})
```

- `@pandacss/preset-panda` as an opinionated set of tokens if you don't want to define your own colors/spacing/fonts
  etc.

```js
export default defineConfig({
  // ...
  presets: ['@pandacss/preset-panda']
})
```

> Note: You don't need to install `@pandacss/preset-base` or `@pandacss/preset-panda`. Panda will automatically resolve
> them for you.