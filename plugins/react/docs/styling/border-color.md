---
title: "Border Color"
---

The border color utilities are used to set the border color of an element. It references the `colors` token category.

### All sides

```jsx
<div className={css({ borderColor: 'primary' })} />
```

### Specific sides

Use the `border{Left|Right|Top|Bottom}Color` properties to apply border color on a specific side of an element.

```jsx
<div className={css({ borderTopColor: 'primary' })} />
<div className={css({ borderLeftColor: 'primary' })} />
```

| Prop                | CSS Property          | Token Category |
| ------------------- | --------------------- | -------------- |
| `borderColor`       | `border-color`        | `colors`       |
| `borderTopColor`    | `border-top-color`    | `colors`       |
| `borderLeftColor`   | `border-left-color`   | `colors`       |
| `borderRightColor`  | `border-right-color`  | `colors`       |
| `borderBottomColor` | `border-bottom-color` | `colors`       |

### Logical Properties

Panda also provides the logical properties for border color, which map to corresponding physical properties based on the
document's writing mode.

> For example, `borderInlineStartColor` will map to `border-left-color` in LTR mode, and `border-right-color` in RTL
> mode.

```jsx
<div className={css({ borderInlineStartColor: 'red.500' })} />
```

| Prop                                          | CSS Property               | Token Category |
| --------------------------------------------- | -------------------------- | -------------- |
| `borderStartColor` , `borderInlineStartColor` | `border-{start+end}-color` | `colors`       |
| `borderEndColor` , `borderInlineEndColor`     | `border-{start+end}-color` | `colors`       |
| `borderXColor`, `borderInlineColor`           | `border-inline-color`      | `colors`       |
| `borderYColor`, `borderBlockColor`            | `border-block-color`       | `colors`       |