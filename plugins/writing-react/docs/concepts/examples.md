---
title: "Examples"
---

### Prefixing token names

This is especially useful when migrating from other css-in-js libraries, [like Stitches.](/docs/migration/stitches)

```ts
import { defineConfig } from '@pandacss/dev'

export default defineConfig({
  // ...
  hooks: {
    'tokens:created': ({ configure }) => {
      configure({
        formatTokenName: path => '$' + path.join('-')
      })
    }
  }
})
```

### Customizing the hash function

When using the [`hash: true`](/docs/concepts/writing-styles) config property, you can customize the function used to
hash the classnames.

```ts
export default defineConfig({
  // ...
  hash: true,
  hooks: {
    'utility:created': ({ configure }) => {
      configure({
        toHash: (paths, toHash) => {
          const stringConds = paths.join(':')
          const splitConds = stringConds.split('_')
          const hashConds = splitConds.map(toHash)
          return hashConds.join('_')
        }
      })
    }
  }
})
```

### Modifying the config

Here's an example of how to leveraging the provided `utils` functions in the `config:resolved` hook to remove the
`stack` pattern from the resolved config.

```ts
import { defineConfig } from '@pandacss/dev'

export default defineConfig({
  // ...
  hooks: {
    'config:resolved': ({ config, utils }) => {
      return utils.omit(config, ['patterns.stack'])
    }
  }
})
```

### Modifying presets

You can use the `preset:resolved` hook to modify presets after they are resolved. This is useful for customizing or
filtering out parts of a preset.

```ts
import { defineConfig } from '@pandacss/dev'

export default defineConfig({
  // ...
  hooks: {
    'preset:resolved': ({ utils, preset, name }) => {
      if (name === '@pandacss/preset-panda') {
        return utils.omit(preset, ['theme.tokens.colors', 'theme.semanticTokens.colors'])
      }
      return preset
    }
  }
})
```

### Configuring JSX extraction

Use the `matchTag` / `matchTagProp` functions to customize the way Panda extracts your JSX.

This can be especially useful when working with libraries that have properties that look like CSS properties but are not
and should be ignored.

Let's see a Radix UI example where the `Select.Content` component has a `position` property that should be ignored:

```js
// Here, the `position` property will be extracted because `position` is a valid CSS property, but we don't want that
<Select.Content position="popper" sideOffset={5}>
```

```ts
export default defineConfig({
  // ...
  hooks: {
    'parser:before': ({ configure }) => {
      configure({
        // ignore the Select.Content entirely
        matchTag: tag => tag !== 'Select.Content',
        // ...or specifically ignore the `position` property
        matchTagProp: (tag, prop) => tag === 'Select.Content' && prop !== 'position'
      })
    }
  }
})
```

### Remove unused variables from final css

Here's an example of how to transform the generated css in the `cssgen:done` hook.

```ts file="panda.config.ts"
import { defineConfig } from '@pandacss/dev'
import { removeUnusedCssVars } from './remove-unused-css-vars'
import { removeUnusedKeyframes } from './remove-unused-keyframes'

export default defineConfig({
  // ...
  hooks: {
    'cssgen:done': ({ artifact, content }) => {
      if (artifact === 'styles.css') {
        return removeUnusedCssVars(removeUnusedKeyframes(content))
      }
    }
  }
})
```

Get the snippets for the removal logic from our Github Sandbox in the
[remove-unused-css-vars](https://github.com/chakra-ui/panda/blob/main/sandbox/vite-ts/remove-unused-css-vars.ts) and
[remove-unused-keyframes](https://github.com/chakra-ui/panda/blob/main/sandbox/vite-ts/remove-unused-keyframes.ts)
files.

> Note: Using this means you can't use the JS function [`token.var`](/docs/guides/dynamic-styling#using-tokenvar) (or
> [token(xxx)](/docs/guides/dynamic-styling#using-token) where `xxx` is the path to a
> [semanticToken](/docs/theming/tokens#semantic-tokens)) from `styled-system/tokens` as the CSS variables will be
> removed based on the usage found in the generated CSS