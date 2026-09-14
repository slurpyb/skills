---
title: "Troubleshooting"
---

- **Global styles aren't applied:** Confirm `preflight` is enabled (if you expect reset), and ensure your selector
  (`html`, `:root`, `.dark`, etc.) matches the element where variables are set.

- **Global styles are overridden by utilities or component styles:** Verify layer order and specificity. Ensure
  `@layer reset` and `@layer base` are emitted before utilities. If you customize insertion or injection order (SSR,
  framework plugins), preserve `@layer` order so globals are not overridden.