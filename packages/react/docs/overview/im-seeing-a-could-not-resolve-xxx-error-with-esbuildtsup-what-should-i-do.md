---
title: "I'm seeing a \"Could not resolve xxx\" error with esbuild/tsup. What should I do?"
---

In such a case, check the [`outExtension`](/docs/references/config#outextension) in your `panda.config` and set it to
"js". This will ensure your modules are resolved correctly.