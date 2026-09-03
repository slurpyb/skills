---
title: "Usage"
---

To generate a static set of CSS classes, add them to your `panda.config.js` file:

```js
export default {
  staticCss: {
    // the css properties you want to generate
    css: [],
    // the recipes you want to generate
    recipes: {}
  }
}
```

The `static` property supports two properties:

- `css` - an array of CSS properties you want to generate with their `conditions`
- `recipes` - the component recipes you want to generate