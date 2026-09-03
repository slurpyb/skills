---
title: "Scale"
---

Control the scale property. Supported value is `auto`

```jsx
<div className={css({ scale: 'auto' })} /> // => 'var(--scale-x) var(--scale-y)'
```

### Scale X

Control the scaleX property.

```jsx
<div className={css({ scaleX: '1.3' })} /> // => --scale-x: 1.3;
```

### Scale Y

Control the scaleY property.

```jsx
<div className={css({ scaleY: '0.4' })} /> // => --scale-y: 0.4;
```