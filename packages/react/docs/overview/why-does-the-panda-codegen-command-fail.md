---
title: "Why does the panda codegen command fail ?"
---

If you run into any error related to "Transforming const to the configured target environment ("es5") is not supported
yet", update your tsconfig to use es6 or higher:

```json filename="tsconfig.json"
{
  "compilerOptions": {
    "target": "es6"
  }
}
```