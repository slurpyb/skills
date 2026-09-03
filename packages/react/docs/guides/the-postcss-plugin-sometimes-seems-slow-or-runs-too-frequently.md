---
title: "The postcss plugin sometimes seems slow or runs too frequently"
---

This is mostly specific to the host bundler (`vite`, `webpack` etc) you're using, it is up to them to decide when to run
the postcss plugin again, and sometimes it can be more than needed for your usage. We do our best to cache the results
of the postcss plugin by checking if the filesystem or your config have actually changed, but sometimes it might not be
enough.

In those rare cases, you might want to swap to using the [CLI](/docs/installation/cli) instead, as it will always be
more performant than the postcss alternative since we directly watch for filesystem changes and only run the
extract/codegen steps when needed.

If you want to keep the convenience of having just one command to run, you can use something like `concurrently` for
that:

```json file="package.json"
{
  "scripts": {
    "dev": "concurrently \"next dev\" \"panda --watch\""
  }
}
```