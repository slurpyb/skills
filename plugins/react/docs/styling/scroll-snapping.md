---
title: "Scroll Snapping"
---

Scroll snapping utilities provide control over the scroll snap behavior.

### Scroll Snap Margin

| Prop                     | CSS Property           | Token Category |
| ------------------------ | ---------------------- | -------------- |
| `scrollSnapMargin`       | `scroll-margin`        | `spacing`      |
| `scrollSnapMarginTop`    | `scroll-margin-top`    | `spacing`      |
| `scrollSnapMarginBottom` | `scroll-margin-bottom` | `spacing`      |
| `scrollSnapMarginLeft`   | `scroll-margin-left`   | `spacing`      |
| `scrollSnapMarginRight`  | `scroll-margin-right`  | `spacing`      |

### Scroll Snap Strictness

It's values can be `mandatory` or `proximity` values, and maps to `var(--scroll-snap-strictness)`.

```jsx
<div className={css({ scrollSnapStrictness: 'proximity' })}>Scroll container with proximity scroll snap</div>
```

### Scroll Snap Type

Supported values

| Value  |                                      |
| ------ | ------------------------------------ |
| `none` | `none`                               |
| `x`    | `x var(--scroll-snap-strictness)`    |
| `y`    | `y var(--scroll-snap-strictness)`    |
| `both` | `both var(--scroll-snap-strictness)` |