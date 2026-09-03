---
title: "Customization"
---

You can customize focus ring appearance with additional utilities:

```jsx
<button
  className={css({
    focusRing: 'outside',
    focusRingColor: 'blue.500',
    focusRingWidth: '3px',
    focusRingStyle: 'dashed',
    focusRingOffset: '4px'
  })}
>
  Custom focus ring
</button>
```

| Prop               | CSS Property     | Token Category | Description              |
| ------------------ | ---------------- | -------------- | ------------------------ |
| `focusRing`        | Multiple         | Enum           | Focus ring variant       |
| `focusVisibleRing` | Multiple         | Enum           | Keyboard-only focus ring |
| `focusRingColor`   | `outline-color`  | `colors`       | Focus ring color         |
| `focusRingWidth`   | `outline-width`  | `borderWidths` | Focus ring thickness     |
| `focusRingStyle`   | `outline-style`  | `borderStyles` | Focus ring style         |
| `focusRingOffset`  | `outline-offset` | `spacing`      | Distance from element    |

### Ring Color

To change the focus ring color for a specific component, use the `focusRingColor` prop:

```jsx
<button className={css({ focusRing: 'outside', focusRingColor: 'red.500' })}>Red focus ring</button>
```