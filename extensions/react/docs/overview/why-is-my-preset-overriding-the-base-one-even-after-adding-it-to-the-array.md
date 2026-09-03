---
title: "Why is my preset overriding the base one, even after adding it to the array?"
---

You might have forgotten to include the `extend` keyword in your config. Without `extend`, your preset will completely
replace the base one, instead of merging with it.