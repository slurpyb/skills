---
title: "Focus Visible Ring"
---

The `focusVisibleRing` utility only applies focus styles during keyboard navigation using the
`&:is(:focus-visible, [data-focus-visible])` selector:

```jsx
<button className={css({ focusVisibleRing: 'outside' })}>Only shows focus ring on keyboard navigation</button>
```

### Focus Ring vs. Focus Visible Ring

The Focus Visible Ring functions similarly to the Focus Ring, but with a key difference: it only applies focus indicator
styles when an element receives keyboard focus.

This ensures that the focus ring is visible only when navigating via keyboard, improving accessibility without affecting
mouse interactions.