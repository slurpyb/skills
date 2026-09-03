---
title: "Polyfills"
---

In event that you need to support older browsers, you can use the following postcss plugin in your PostCSS config:

- [postcss-cascade-layers](https://www.npmjs.com/package/@csstools/postcss-cascade-layers): Adds support for CSS Cascade Layers.

Here is an example of a `postcss.config.js` file that uses these polyfills:

```js
module.exports = {
  plugins: ['@pandacss/dev/postcss', '@csstools/postcss-cascade-layers']
}
```

Since CSS `@layer`s have a lower priority than other CSS rules, this postcss plugin is also useful in cases where your styles are being overridden by some other stylesheets that you're not in total control of, since it will remove the `@layer` rules and still emulate their specificity.