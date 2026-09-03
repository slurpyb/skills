---
title: "Pre-rendering"
---

If you use some way to pre-render your components to static HTML, for example using Astro or RSC, the `styled-system`
functions like `css` and others will be removed at build-time and replaced by the generated class names, so that you
don't have to ship the runtime to your users.