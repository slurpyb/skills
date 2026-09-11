---
title: "Responsive Design"
---

How to write mobile responsive designs in your CSS in Panda

Responsive design is a fundamental aspect of modern web development, allowing websites and applications to adapt
seamlessly to different screen sizes and devices.

Panda provides a comprehensive set of responsive utilities and features to facilitate the creation of responsive
layouts. It lets you do this through conditional styles for different breakpoints.

Let's say you want to change the font weight of a text on large screens, you can do it like this:

```jsx
<span
  className={css({
    fontWeight: 'medium',
    lg: { fontWeight: 'bold' }
  })}
>
  Text
</span>
```

> Panda uses a mobile-first breakpoint system and leverages min-width media queries `@media(min-width)` when you write
> responsive styles.

Panda provides five breakpoints by default:

```ts
const breakpoints = {
  sm: '640px',
  md: '768px',
  lg: '1024px',
  xl: '1280px',
  '2xl': '1536px'
}
```