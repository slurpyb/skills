---
title: "Caveats"
---

The object literal syntax is the recommended way of writing styles. But, if you stick with the template literal syntax,
there are some caveats to be aware of:

- Patterns and recipes are not generated
- Dynamic interpolation or component targeting is not supported
- Lack of autocompletion for tokens within the template literal Our
  [Eslint plugin](https://github.com/chakra-ui/eslint-plugin-panda/blob/main/docs/rules/no-invalid-token-paths.md) can
  help you overcome this by detecting invalid tokens
- JSX Style props are not supported