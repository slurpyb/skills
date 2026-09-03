---
title: "Border Width"
---

### All sides

```jsx
<div className={css({ borderWidth: '1px' })} />
```

### Specific sides

Use the `border{Left|Right|Top|Bottom}Width` properties, to apply border width on a specific side of an element.

```jsx
<div className={css({ borderTopWidth: '1px' })} />
<div className={css({ borderLeftWidth: '1px' })} />
```

| Prop                                 | CSS Property                |
| ------------------------------------ | --------------------------- |
| `borderWidth`                        | `border-width`              |
| `borderTopWidth`                     | `border-top-width`          |
| `borderLeftWidth`                    | `border-left-width`         |
| `borderRightWidth`                   | `border-right-width`        |
| `borderBottomWidth`                  | `border-bottom-width`       |
| `borderXWidth` , `borderInlineWidth` | `border-{left+right}-width` |
| `borderYWidth` , `borderBlockWidth`  | `border-{top+bottom}-width` |

### Logical Properties

Panda also provides the logical properties for border width, which map to corresponding physical properties based on the
document's writing mode.

> For example, `borderStartWidth` will map to `border-left-width` in LTR mode, and `border-right-width` in RTL mode.

```jsx
<div className={css({ borderStartWidth: '1px' })} />
```

| Prop                                          | CSS Property               |
| --------------------------------------------- | -------------------------- |
| `borderStartWidth` , `borderInlineStartWidth` | `border-{start+end}-width` |
| `borderEndWidth` , `borderInlineEndWidth`     | `border-{start+end}-width` |