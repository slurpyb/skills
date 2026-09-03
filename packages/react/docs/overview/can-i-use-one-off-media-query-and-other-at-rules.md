---
title: "Can I use one-off media query and other at rules?"
---

Yes, you can! You can apply one-off media queries and other at rules (such as `@container`, `@supports`) in your CSS as
shown below:

```javascript
css({
  containerType: 'size',
  '@media (min-width: 10px)': {
    fontSize: 'xl',
    color: 'blue.300'
  },
  '@container (min-width: 10px)': {
    fontSize: '2xl',
    color: 'green.300'
  },
  '@supports (display: flex)': {
    fontSize: '3xl',
    color: 'red.300'
  }
})
```