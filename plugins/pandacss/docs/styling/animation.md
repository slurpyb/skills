---
title: "Animation"
---

Control the animation property. It supports the `animations` token category.

```jsx
<div className={css({ animation: 'bounce' })} />
<div className={css({ animationName: 'pulse' })} />
<div className={css({ animationDelay: 'fast' })} />
```

| Prop             | CSS Property      | Token Category |
| ---------------- | ----------------- | -------------- |
| `animation`      | `animation-name	`  | animations     |
| `animationName`  | `animation-name	`  | animationName  |
| `animationDelay` | `animation-delay	` | durations      |