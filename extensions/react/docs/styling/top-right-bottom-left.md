---
title: "Top / Right / Bottom / Left"
---

Use the `top`, `right`, `bottom` and `left` utilities to set the position of an element.

Values can reference the `spacing` token category.

```jsx
<div className={css({ position: 'absolute', top: '0', left: '0' })} />
```

| Prop     | CSS Property | Token Category |
| -------- | ------------ | -------------- |
| `top`    | `top`        | `spacing`      |
| `right`  | `right`      | `spacing`      |
| `bottom` | `bottom`     | `spacing`      |
| `left`   | `left`       | `spacing`      |

### Logical Properties

Use the `inset{Start|End}` utilities to set the position of an element based on the writing mode.

> For example, `insetStart` will set the `left` property in `ltr` mode and `right` in `rtl` mode.

```jsx
<div className={css({ position: 'absolute', insetStart: '0' })} />
```

| Prop                                      | CSS Property         | Token Category |
| ----------------------------------------- | -------------------- | -------------- |
| `start`, `insetStart`, `insetInlineStart` | `inset-inline-start` | `spacing`      |
| `end` , `insetEnd`, `insetInlineEnd`      | `inset-inline-end`   | `spacing`      |
| `insetX`, `insetInline`                   | `inset-inline`       | `spacing`      |
| `insetY`, `insetBlock`                    | `inset-inline`       | `spacing`      |