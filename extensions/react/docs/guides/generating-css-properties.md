---
title: "Generating CSS Properties"
---

The `css` property is an array of CSS properties you want to generate with their `conditions`.

You can specify the following options:

- `properties`: the CSS properties you want to generate
- `conditions`: the CSS conditions or selectors you want to generate in addition to the default values. Values can be
  `light, dark`, etc.
- `responsive`: whether or not to generate responsive classes
- `values`: the values you want to generate for the CSS property. When set to `*`, all values defined in the tokens will
  be included. When set to an array, only the values in the array will be generated.

```js
export default {
  staticCss: {
    css: [
      {
        properties: {
          margin: ['*'],
          padding: ['*', '50px', '80px']
        },
        responsive: true
      },
      {
        properties: {
          color: ['*'],
          backgroundColor: ['green.200', 'red.400']
        },
        conditions: ['light', 'dark']
      }
    ]
  }
}
```