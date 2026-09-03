---
title: "How does it work?"
---

When running the `panda` command or with the postcss plugin, here's what's happening under the hood:

1. **Load Panda context**:

- Find and evaluate app config, merge result with presets.
- Create panda context: prepare code generator from config, parse user's file as AST.

2. **Generating artifacts**:

- Write lightweight JS runtime and types to output directory

3. **Extracting used styles in app code**:

- Run parser on each user's file: identify and extract styles, compute CSS, write to styles.css.

That `2. Generating artifacts` step is where the `styled-system` folder is generated, using the resolved config that
contains all your tokens, patterns, recipes, utilities etc. We generate a tailored runtime for your app, so that it only
contains enough code (and types!) to support the styles you're using.