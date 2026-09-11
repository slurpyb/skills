---
title: "Border Radius"
---

### All sides

```jsx
<div className={css({ borderRadius: 'md' })} />
<div className={css({ rounded: 'md' })} /> // shorthand
```

### Specific sides

Use the `border{Left|Right|Top|Bottom}Radius` properties, or the shorthand equivalent to apply border radius on a
specific side of an element.

```jsx
<div className={css({ borderTopRadius: 'md' })} />
<div className={css({ roundedTop: 'md' })} /> // shorthand

<div className={css({ borderLeftRadius: 'md' })} />
<div className={css({ roundedLeft: 'md' })} /> // shorthand
```

### Specific corners

Use the `border{Top|Bottom}{Left|Right}Radius` properties, or the shorthand equivalent to round a specific corner.

```jsx
<div className={css({ borderTopLeftRadius: 'md' })} />
<div className={css({ roundedTopLeft: 'md' })} /> // shorthand
```

| Prop                                     | CSS Property                        | Token Category |
| ---------------------------------------- | ----------------------------------- | -------------- |
| `rounded`,`borderRadius`                 | `border-radius`                     | `radii`        |
| `roundedTopLeft`,`borderTopLeftRadius`   | `border-top-left-radius`            | `radii`        |
| `roundedTopRight`,`borderTopRight`       | `border-top-right-radius`           | `radii`        |
| `roundedBottomRight`,`borderBottomRight` | `border-bottom-right-radius`        | `radii`        |
| `roundedBottomLeft`,`borderBottomLeft`   | `border-bottom-left-radius`         | `radii`        |
| `roundedTop`,`borderTopRadius`           | `border-top-{left+right}-radius`    | `radii`        |
| `roundedRight`,`borderRightRadius`       | `border-{top+bottom}-right-radius`  | `radii`        |
| `roundedBottom`,`borderBottomRadius`     | `border-bottom-{left+right}-radius` | `radii`        |
| `roundedLeft`,`borderLeftRadius`         | `border-{top+bottom}-left-radius`   | `radii`        |

### Logical Properties

Panda also provides the logical properties for border radius, which map to corresponding physical properties based on
the document's writing mode.

> For example, `borderStartRadius` will map to `border-left-radius` in LTR mode, and `border-right-radius` in RTL mode.

```jsx
<div className={css({ borderStartRadius: 'md' })} />
<div className={css({ roundedStart: 'md' })} /> // shorthand
```

| Prop                                         | CSS Property                      | Token Category |
| -------------------------------------------- | --------------------------------- | -------------- |
| `roundedStartStart`,`borderStartStartRadius` | `border-start-start-radius`       | `radii`        |
| `roundedStartEnd`,`borderStartEndRadius`     | `border-start-end-radius`         | `radii`        |
| `roundedStart`,`borderStartRadius`           | `border-{start+end}-start-radius` | `radii`        |
| `roundedEndStart`,`borderEndStartRadius`     | `border-end-start-radius`         | `radii`        |
| `roundedEndEnd`,`borderEndEndRadius`         | `border-end-end-radius`           | `radii`        |
| `roundedEnd` ,`borderEndRadius`              | `border-{start+end}-end-radius`   | `radii`        |