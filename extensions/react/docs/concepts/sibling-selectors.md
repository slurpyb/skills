---
title: "Sibling Selectors"
---

When you need to style an element based on its sibling element's state or attribute, you can add the `peer` class to the
sibling element, and use any of the `_peer*` modifiers on the target element.

```jsx
<div>
  <p className="peer">Hover me</p>
  <p className={css({ _peerHover: { bg: 'red.500' } })}>I'll change by bg</p>
</div>
```

> Note: This only works for when the element marked with `peer` is a previous siblings, that is, it comes before the
> element you want to start.