---
title: "Hiding Elements"
---

Panda provides shortcut properties for hiding elements from and below a specific breakpoint.

### Hide From

```jsx
<div className={css({ display: 'flex', hideFrom: 'md' })} />
```

### Hide Below

```jsx
<div className={css({ display: 'flex', hideBelow: 'md' })} />
```

| Prop        | CSS Property | Token Category |
| ----------- | ------------ | -------------- |
| `hideFrom`  | `display`    | `breakpoints`  |
| `hideBelow` | `display`    | `breakpoints`  |