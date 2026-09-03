---
title: "Margin"
---

### All sides

Use the `margin` property to apply margin on all sides of an element

```jsx
<div className={css({ margin: '5' })} />
<div className={css({ m: '5' })} /> // shorthand
```

### Specific sides

Use the `margin{Left|Right|Top|Bottom}` to apply margin on one side of an element

```jsx
<div className={css({ marginLeft: '3' })} />
<div className={css({ ml: '3' })} /> // shorthand

<div className={css({ marginTop: '3' })} />
<div className={css({ mt: '3' })} /> // shorthand
```

### Horizontal and Vertical margin

Use the `margin{X|Y}` properties to apply margin on the horizontal and vertical axis of an element

```jsx
<div className={css({ marginX: '8' })} />
<div className={css({ mx: '8' })} /> // shorthand

<div className={css({ marginY: '8' })} />
<div className={css({ my: '8' })} /> // shorthand
```

| Prop                 | CSS Property    | Token Category |
| -------------------- | --------------- | -------------- |
| `m`,`margin`         | `margin`        | `spacing`      |
| `ml`, `marginLeft`   | `margin-left`   | `spacing`      |
| `mr`, `marginRight`  | `margin-right`  | `spacing`      |
| `mt`, `marginTop`    | `margin-top`    | `spacing`      |
| `mb`, `marginBottom` | `margin-bottom` | `spacing`      |
| `mx`, `marginX`      | `margin-left`   | `spacing`      |
| `my`, `marginY`      | `margin-top`    | `spacing`      |

### Logical properties

Use the `margin{Start|End}` properties to apply margin on the logical axis of an element based on the text direction.

```jsx
<div className={css({ marginStart: '8' })} />
<div className={css({ ms: '8' })} /> // shorthand

<div className={css({ marginEnd: '8' })} />
<div className={css({ me: '8' })} /> // shorthand
```

| Prop                | CSS Property          | Token Category |
| ------------------- | --------------------- | -------------- |
| `ms`, `marginStart` | `margin-inline-start` | `spacing`      |
| `me`, `marginEnd`   | `margin-inline-end`   | `spacing`      |