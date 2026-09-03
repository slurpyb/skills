---
title: "ARIA Attribute"
---

You can style an element based on its `aria-{state}=true` attribute using the corresponding `_{state}` modifier:

```jsx
<div
  aria-expanded="true"
  className={css({
    _expanded: { bg: 'gray.500' }
  })}
>
  Hello
</div>
```

> Most of the `aria-{state}` attributes typically mirror the support ARIA states in the browser pseudo class. For
> example, `aria-checked=true` is styled with `_checked`, `aria-disabled=true` is styled with `_disabled`.