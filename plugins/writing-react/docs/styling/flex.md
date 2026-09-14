---
title: "Flex"
---

Flex utilities are designed to control the layout and behavior of flex containers and items.

### Flex Basis

The `flexBasis` utility sets the initial main size of a flex item, distributing the available space along the main axis.
It supports `spacing` tokens and fractional literal values like “1/2”, “2/3", etc.

```jsx
<div className={css({ basis: '1/2' })} />
```

### Flex

The `flex` utility defines the flexibility of a flex container or item. Supported values:

| Value     |            |
| --------- | ---------- |
| `1`       | `1 1 0%`   |
| `auto`    | `1 1 auto` |
| `initial` | `0 1 auto` |
| `none`    | `none`     |

### Flex Direction

The `flexDirection` utility sets the direction of the main axis in a flex container. It's shorthand is `flexDir`.

```jsx
<div className={css({ flexDir: 'column' })} />
```