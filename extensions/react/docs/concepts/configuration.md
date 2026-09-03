---
title: "Configuration"
---

By default, color palette generation is enabled and includes all colors defined in your theme.

You can control which colors are used to generate color palettes by configuring the `colorPalette` property in your
theme.

### Disable Color Palette

To completely disable color palette generation, set `enabled` to `false`:

```ts filename="panda.config.ts"
import { defineConfig } from '@pandacss/dev'

export default defineConfig({
  theme: {
    colorPalette: {
      enabled: false
    }
  }
})
```

### Include Specific Colors

To generate color palettes for only specific colors, use the `include` option:

```ts filename="panda.config.ts"
import { defineConfig } from '@pandacss/dev'

export default defineConfig({
  theme: {
    colorPalette: {
      include: ['gray', 'blue', 'red']
    }
  }
})
```

This will only generate color palettes for `gray`, `blue`, and `red` colors, even if you have other colors defined in
your theme.

**Glob patterns** are supported for nested tokens:

```ts filename="panda.config.ts"
colorPalette: {
  include: ['gray.*', 'blue.*'] // Includes all nested tokens
}
```

### Exclude Specific Colors

To exclude certain colors from color palette generation, use the `exclude` option:

```ts filename="panda.config.ts"
import { defineConfig } from '@pandacss/dev'

export default defineConfig({
  theme: {
    colorPalette: {
      exclude: ['yellow', 'orange']
    }
  }
})
```

This will generate color palettes for all colors except `yellow` and `orange`.

### Combination of Options

You can combine the `enabled`, `include`, and `exclude` options as needed:

```ts filename="panda.config.ts"
import { defineConfig } from '@pandacss/dev'

export default defineConfig({
  theme: {
    colorPalette: {
      enabled: true,
      include: ['gray', 'blue', 'red', 'green'],
      exclude: ['red'] // This will override the include for 'red'
    }
  }
})
```

In this example, color palettes will be generated for `gray`, `blue`, and `green`, but not for `red` (since it's
excluded).