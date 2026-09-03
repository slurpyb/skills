---
title: "Template Literals"
---

Panda allows you to write styles using template literals.

Writing styles using template literals provides a similar experience to
[styled-components](https://styled-components.com/) and [emotion](https://emotion.sh/), except that Panda generates
atomic class names instead of a single unique class name.

> Emitting atomic class names allows Panda to generate smaller CSS bundles.

Panda provides two functions to write template literal styles: `css` and `styled`.