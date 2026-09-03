---
description: PandaCSS build hooks — apply when intercepting Panda's compiler lifecycle (config resolution, token mutation, codegen, parser results, CSS emission) from panda.config.ts or a plugin
paths:
  - "**/panda.config.ts"
  - "**/panda-preset*/**/*.ts"
  - "**/panda-plugins/**/*.ts"
---

# PandaCSS — Integration Hooks

`hooks` in `panda.config.ts` lets you tap into Panda's build pipeline. Use sparingly — most needs are better served by `theme`, `presets`, `patterns`, or `recipes`.

## Form

```ts
import { defineConfig } from "@pandacss/dev"

export default defineConfig({
  hooks: {
    "config:resolved": ({ config }) => {
      // mutate or validate resolved config before codegen
    },
    "tokens:created": ({ configure }) => {
      configure({
        formatTokenName: (path) => "$" + path.join("-"),
      })
    },
    "parser:before": ({ filePath, content }) => {
      // transform source before extraction
      return content
    },
    "cssgen:done": ({ artifact, content }) => {
      // post-process generated CSS
      return content
    },
  },
})
```

## Common hooks

- `config:resolved` — final config inspection / mutation
- `tokens:created` — rename or prefix tokens
- `context:created` — access build context after init
- `parser:before` / `parser:after` — source transformation around extraction
- `codegen:prepare` — modify codegen artifacts before write
- `cssgen:done` — post-process emitted CSS (strip selectors, inject layers, etc.)

## Rules

- Reach for hooks only after `theme`, `presets`, and `utilities` cannot solve the problem.
- Hook callbacks run on every build — keep them cheap and pure.
- Mutating tokens in `tokens:created` requires regenerating types: `panda codegen` after config changes.
- Plugins should ship hooks bundled in a preset, not as a separate hook block consumers must wire up.

## See also

- [Styled system](styled-system.md)
- [Architecture flow](../debugging/architecture.md)
