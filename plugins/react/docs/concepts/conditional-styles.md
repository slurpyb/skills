---
title: "Conditional Styles"
---

Learn how to use conditional and responsive styles in Panda.

When writing styles, you might need to apply specific changes depending on a specific condition, whether it's based on
breakpoint, css pseudo state, media query or custom data attributes.

Panda allows you to write conditional styles, and provides common condition shortcuts to make your life easier. Let's
say you want to change the background color of a button when it's hovered. You can do it like this:

```jsx
<button
  className={css({
    bg: 'red.500',
    _hover: { bg: 'red.700' }
  })}
>
  Hover me
</button>
```