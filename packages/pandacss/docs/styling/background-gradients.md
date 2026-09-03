---
title: "Background Gradients"
---

Properties to create a background gradient based on color stops.

```jsx
<div
  className={css({
    bgGradient: 'to-r',
    gradientFrom: 'red.200',
    gradientTo: 'blue.200'
  })}
/>
```

Background and text gradients can be connected to design tokens. Here's how to define a gradient token in your theme.

```ts
const theme = {
  tokens: {
    gradients: {
      // string value
      simple: { value: 'linear-gradient(to right, red, blue)' },
      // composite value
      primary: {
        value: {
          type: 'linear',
          placement: 'to right',
          stops: ['red', 'blue']
        }
      }
    }
  }
}
```

These tokens can be used in the `bgGradient` or `textGradient` properties.

```jsx
<div
  className={css({
    bgGradient: "simple",
  })}
/>

<div
  className={css({
    bgGradient: "primary",
  })}
/>
```

| Prop           | CSS Property       | Token Category |
| -------------- | ------------------ | -------------- |
| `bgGradient`   | `background-image` | `gradients`    |
| `textGradient` | `background-image` | `gradients`    |
| `gradientFrom` | `--gradient-from`  | `colors`       |
| `gradientTo`   | `--gradient-to`    | `colors`       |
| `gradientVia`  | `--gradient-via`   | `colors`       |