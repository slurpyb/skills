---
title: "Background Position"
---

Properties for controlling the src and position of a background image.

```jsx
<div
  className={css({
    bgImage: 'url(/images/bg.jpg)',
    bgPosition: 'center'
  })}
/>
```

| Prop                                   | CSS Property        | Token Category |
| -------------------------------------- | ------------------- | -------------- |
| `bgPosition`, `backgroundPosition`     | `background-image`  | none           |
| `bgPositionX`, `backgroundPositionX`   | `background-image`  | none           |
| `bgPositionY`, `backgroundPositionY`   | `background-image`  | none           |
| `bgAttachment` ,`backgroundAttachment` | `background-size`   | none           |
| `bgClip`, `backgroundClip`             | `background-size`   | none           |
| `bgOrigin`, `backgroundOrigin`         | `background-size`   | none           |
| `bgImage`, `backgroundImage`           | `background-size`   | assets         |
| `bgRepeat`, `backgroundRepeat`         | `background-repeat` | none           |
| `bgBlendMode`, `backgroundBlendMode`   | `background-size`   | none           |
| `bgSize`, `backgroundSize`             | `background-size`   | none           |