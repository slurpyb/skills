---
title: "Background Colors"
---

```jsx
<div className={css({ bg: 'red.200' })} />
<div className={css({ bg: 'blue.200/30' })} /> // with alpha
```

| Prop                         | CSS Property       | Token Category |
| ---------------------------- | ------------------ | -------------- |
| `bg`, `background`           | `background`       | `colors`       |
| `bgColor`, `backgroundColor` | `background-color` | `colors`       |
| `bgGradient`                 | `background-image` | `gradients`    |