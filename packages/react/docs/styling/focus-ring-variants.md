---
title: "Focus Ring Variants"
---

The `focusRing` utility applies focus styles using the `&:is(:focus, [data-focus])` selector and supports four variants:

```jsx
// Outside focus ring (default 2px offset)
<button className={css({ focusRing: 'outside' })}>
  Click me
</button>

// Inside focus ring (no offset, with border)
<button className={css({ focusRing: 'inside' })}>
  Click me
</button>

// Mixed focus ring (semi-transparent with border)
<button className={css({ focusRing: 'mixed' })}>
  Click me
</button>

// No focus ring
<button className={css({ focusRing: 'none' })}>
  Click me
</button>
```