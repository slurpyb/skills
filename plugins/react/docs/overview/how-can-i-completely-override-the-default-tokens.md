---
title: "How can I completely override the default tokens?."
---

If you want to **completely override all** of the default presets theme tokens, you can omit the `extends` keyword from
your `theme` config object.

If you want to **keep some of the defaults**, you can install the `@pandacss/preset-panda` package, import it, then
specifically pick what you need in there (or use the JS spread operator `...` and override the other keys).