---
title: "Panda Integration Hooks"
---

Leveraging hooks in Panda to create custom functionality.

Panda hooks can be used to add new functionality or modify existing behavior during certian parts of the compiler
lifecycle.

Hooks are mostly callbacks that can be added to the panda config via the `hooks` property, or installed via `plugins`.

Here are some examples of what you can do with hooks:

- modify the resolved config (`config:resolved`), like strip out tokens or keyframes.
- modify presets after they are resolved (`preset:resolved`), like removing specific tokens or theme properties from a
  preset.
- tweak the design token or classname engine (`tokens:created`, `utility:created`), like prefixing token names, or
  customizing the hashing function
- transform a source file to a `tsx` friendly syntax before it's parsed (`parser:before`) so that Panda can
  automatically extract its styles usage
- create your own styles parser (`parser:before`, `parser:after`) using the file's content so that Panda could be used
  with any templating language
- alter the generated JS and DTS code (`codegen:prepare`)
- modify the generated CSS (`cssgen:done`), allowing all kinds of customizations like removing the unused CSS variables,
  etc.
- restrict `strictTokens` to a specific set of token categories, ex: only affect `colors` and `spacing` tokens and
  therefore allow any value for `fontSizes` and `lineHeights`