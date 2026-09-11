---
title: "Use Panda as external package"
---

### Summary

- create a Panda [preset](/docs/customization/presets) so that you (and your users) can share the same design system
  tokens
- create a workspace package for your outdir (`@acme-org/styled-system`) and use that package name as the `importMap` in
  your app code
- have your component library (`@acme-org/components`) use the `@acme-org/styled-system` package as external