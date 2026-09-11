---
title: "Why is my base condition not working in this example?"
---

```ts
css({ color: { _base: 'red.600', _dark: 'white' } })
```

You used `_base` instead of `base`, there is no underscore `_`.