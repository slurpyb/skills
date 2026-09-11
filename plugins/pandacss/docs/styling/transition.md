---
title: "Transition"
---

A shorthand utility for defining common transition sets.

Values are `all`, `common`, `colors`, `opacity`, `shadow`, `transform`.

```jsx
<div className={css({ transition: 'all' })} />
<div className={css({ transitionTimingFunction: 'linear' })} />
<div className={css({ transitionDelay: 'fast' })} />
<div className={css({ transitionDuration: 'faster' })} />
```

| Prop                       | CSS Property                 | Token Category |
| -------------------------- | ---------------------------- | -------------- |
| `transitionTimingFunction` | `transition-timing-function	` | `easings`      |
| `transitionDelay`          | `transition-delay	`           | `durations`    |
| `transitionDuration`       | `transition-duration	`        | `durations`    |