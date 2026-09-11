---
title: "Recommendations"
---

- If your library code shouldn't be published on npm and App code uses Panda, use
  [ship build info](#ship-the-build-info-file) approach
- If your app code doesn't use Panda, use the [static css](#ship-a-static-css-file) file approach
- If your app code lives in a monorepo, use the [include src files](#include-the-src-files) approach
- If your library code doesn't ship components but only ships tokens, patterns or recipes, use the
  [ship preset](#ship-a-panda-preset) approach

> ⚠️ If you use the `include src files` or `ship build info` approach, you might also need to ship a `preset` if your
> library code has any custom tokens, patterns or recipes.