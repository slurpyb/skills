---
title: "Grid"
---

Grid utilities offer control over various grid layout properties, providing a powerful system for creating layouts with
rows and columns.

### Grid Template Columns

The `gridTemplateColumns` utility defines the columns of a grid container.

```jsx
<div className={css({ gridTemplateColumns: 'repeat(3, minmax(0, 1fr))' })} />
```

### Grid Template Rows

The `gridTemplateRows` utility defines the rows of a grid container.

```jsx
<div className={css({ gridTemplateRows: 'repeat(3, minmax(0, 1fr))' })} />
```