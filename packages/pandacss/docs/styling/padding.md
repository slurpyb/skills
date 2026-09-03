---
title: "Padding"
---

### All sides

Use the `padding` property to apply padding on all sides of an element

```jsx
<div className={css({ padding: '4' })} />
<div className={css({ p: '4' })} /> // shorthand
```

### Specific sides

Use the `padding{Left|Right|Top|Bottom}` to apply padding on one side of an element

```jsx
<div className={css({ paddingLeft: '3' })} />
<div className={css({ pl: '3' })} /> // shorthand

<div className={css({ paddingTop: '3' })} />
<div className={css({ pt: '3' })} /> // shorthand
```

### Horizontal and Vertical padding

Use the `padding{X|Y}` properties to apply padding on the horizontal and vertical axis of an element

```jsx
<div className={css({ paddingX: '8' })} />
<div className={css({ px: '8' })} /> // shorthand

<div className={css({ paddingY: '8' })} />
<div className={css({ py: '8' })} /> // shorthand
```

| Prop                  | CSS Property     | Token Category |
| --------------------- | ---------------- | -------------- |
| `p`,`padding`         | `padding`        | `spacing`      |
| `pl`, `paddingLeft`   | `padding-left`   | `spacing`      |
| `pr`, `paddingRight`  | `padding-right`  | `spacing`      |
| `pt`, `paddingTop`    | `padding-top`    | `spacing`      |
| `pb`, `paddingBottom` | `padding-bottom` | `spacing`      |
| `px`, `paddingX`      | `padding-inline` | `spacing`      |
| `py`, `paddingY`      | `padding-block`  | `spacing`      |

### Logical properties

Use the `padding{Start|End}` properties to apply padding on the logical axis of an element based on the text direction.

```jsx
<div className={css({ paddingStart: '8' })} />
<div className={css({ ps: '8' })} /> // shorthand

<div className={css({ paddingEnd: '8' })} />
<div className={css({ pe: '8' })} /> // shorthand
```

| Prop                 | CSS Property           | Token Category |
| -------------------- | ---------------------- | -------------- |
| `ps`, `paddingStart` | `padding-inline-start` | `spacing`      |
| `pe`, `paddingEnd`   | `padding-inline-end`   | `spacing`      |