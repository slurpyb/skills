---
title: "How does Panda work?"
---

When running `pnpm panda`, here's what's happening under the hood:

- **Load Panda context**:
  - Find and evaluate app config, merge result with presets.
  - Create panda context: prepare code generator from config, parse user's file as AST.
- **Generating artifacts**:
  - Write lightweight JS runtime and types to output directory
- **Extracting used styles in app code**:
  - Run parser on each user's file: identify and extract styles, compute CSS, write to styles.css.