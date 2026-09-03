---
title: "Troubleshooting"
---

If you're not getting import autocomplete in your IDE, you may need to include the `styled-system` directory in your
`tsconfig.json` file:

```json filename="tsconfig.json"
{
  // ...
  "include": ["src", "styled-system"]
}
```