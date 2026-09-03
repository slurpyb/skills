---
title: "Why are my styles not applied?"
---

Check that the [`@layer` rules](/docs/concepts/cascade-layers#layer-css) are set and the corresponding `.css` file is
included. [If you're not using `postcss`](/docs/installation/cli), ensure that `styled-system/styles.css` is imported
and that the `panda` command has been run (or is running with `--watch`).