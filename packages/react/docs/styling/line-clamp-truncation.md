---
title: "Line Clamp (Truncation)"
---

How to truncate multi-line text

```jsx
<div className={css({ lineClamp: 2 })}>Some long piece of text</div>

<div className={css({ lineClamp: 2 })}>Truncated text</div>
```

| Prop        | CSS Property        | Token Category |
| ----------- | ------------------- | -------------- |
| `lineClamp` | `webkit-line-clamp` | none           |
| `truncate`  | `text-overflow`     | none           |