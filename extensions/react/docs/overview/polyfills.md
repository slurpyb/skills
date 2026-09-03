---
title: "Polyfills"
---

In event that you need to support older browsers, you can use the following polyfills in your PostCSS config:

- [autoprefixer](https://github.com/postcss/autoprefixer): Adds vendor prefixes to CSS rules using values from
  [Can I Use](https://caniuse.com/).
- [postcss-cascade-layers](https://www.npmjs.com/package/@csstools/postcss-cascade-layers): Adds support for CSS Cascade
  Layers.

Here is an example of a `postcss.config.js` file that uses these polyfills:

```js
module.exports = {
  plugins: ['@pandacss/dev/postcss', 'autoprefixer', '@csstools/postcss-cascade-layers']
}
```