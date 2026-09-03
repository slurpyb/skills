---
title: "Screen Reader-Only Content"
---

The srOnly utility class hides content visually while keeping it accessible to screen readers. It is particularly useful
when you want to provide information to screen readers without displaying it on the screen.

```jsx
<div className={css({ srOnly: true })}>Accessible only to screen readers</div>
```