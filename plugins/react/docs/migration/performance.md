---
title: "Performance"
---

Theme UI relies on `@emotion/styled` to style components. This means that every time you use the `sx` prop, runtime
CSS-in-JS is required to compute the styles in the browser. This can lead to performance issues in larger applications.

Panda relies on `postcss` and converts CSS-in-JS styles to static CSS at build-time, leading to better performance in
larger applications.