---
title: "Aspect Ratio"
---

Use the `aspectRatio` utilities to set the desired aspect ratio of an element.

Values can reference the `aspectRatios` token category.

```jsx
<div className={css({ aspectRatio: 'square' })} />
```

> This uses the native CSS property `aspect-ratio` which is might not supported in all browsers. Consider using the
> [`AspectRatio` pattern](/docs/concepts/patterns#aspect-ratio) instead