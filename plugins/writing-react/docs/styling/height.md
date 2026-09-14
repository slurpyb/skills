---
title: "Height"
---

Use the `height` or `h` property to set the height of an element.

```jsx
<div className={css({ height: '5' })} />
<div className={css({ h: '5' })} /> // shorthand
```

### Fractional height

Use can set fractional heights using the `height` or `h` property.

Values can be within the following ranges:

- Thirds: `1/3` to `2/3`
- Fourths: `1/4` to `3/4`
- Fifths: `1/5` to `4/5`
- Sixths: `1/6` to `5/6`

```jsx
<div className={css({ height: '1/2' })} />
<div className={css({ h: '1/2' })} /> // shorthand
```

### Relative heights

You can use the modern relative height values `dvh`, `svh`, `lvh`.

```jsx
<div className={css({ height: 'dvh' })} />
<div className={css({ h: 'dvh' })} /> // shorthand
```

### Max height

Use the `maxHeight` or `maxH` property to set the maximum height of an element.

```jsx
<div className={css({ maxHeight: '5' })} />
<div className={css({ maxH: '5' })} /> // shorthand
```

### Min height

Use the `minHeight` or `minH` property to set the minimum height of an element.

```jsx
<div className={css({ minHeight: '5' })} />
<div className={css({ minH: '5' })} /> // shorthand
```

| Prop                | CSS Property | Token Category |
| ------------------- | ------------ | -------------- |
| `h`, `height`       | `height`     | `sizes`        |
| `maxH`, `maxHeight` | `max-height` | `sizes`        |
| `minH`, `minHeight` | `min-height` | `sizes`        |

### Size

Use the `boxSize` property to set the width and height of an element.

```jsx
<div className={css({ boxSize: '24' })} />
```

| Prop      | CSS Property    | Token Category |
| --------- | --------------- | -------------- |
| `boxSize` | `width, height` | `sizes`        |