---
title: "Using Panda in a Component Library"
---

How to set up Panda in a component library

When creating a component library that uses Panda which can be used in a variety of different projects, you have four
options:

1. Ship a Panda [preset](/docs/customization/presets)
2. Ship a static CSS file
3. Use Panda as external package, and ship the src files
4. Use Panda as external package, and ship the build info file

> In the examples below, we use `tsup` as the build tool. You can use any other build tool.