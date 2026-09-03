---
title: "Translate"
---

Control the translate property. Supported value is `auto`

```jsx
<div className={css({ translate: 'auto' })} /> // => 'var(--translate-x) var(--translate-y)'
```

### Translate X

Control the translateX property.

```jsx
<div className={css({ translateX: '50%' })} /> // => --translate-x: 50%;
<div className={css({ x: '20px' })} /> // shorthand
```

### Translate Y

Control the translateY property.

```jsx
<div className={css({ translateY: '-40%' })} /> // => --translate-y: -40%;
<div className={css({ y: '4rem' })} /> // shorthand
```