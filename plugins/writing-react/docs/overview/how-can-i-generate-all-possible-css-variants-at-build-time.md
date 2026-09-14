---
title: "How can I generate all possible CSS variants at build time?"
---

While it's possible to generate all variants, even unused ones, by using
[`config.staticCss`](https://panda-css.com/docs/guides/dynamic-styling#using-static-css), it's generally **not
recommended** to use it for more than a few values. However, keep in mind this approach compromises one of Panda's
strengths: lean, usage-based CSS generation.