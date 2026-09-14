---
title: "Tokens"
---

### Colors

Use the `colors` key in the `token` section of your Panda config file to customize the default color values.

> We recommend using numeric ranges from `50` to `900`

```ts filename="panda.config.ts"
import { defineConfig } from '@pandacss/dev'

export default defineConfig({
  theme: {
    extend: {
      tokens: {
        colors: {
          brand: { value: '#EA8433' }
        }
      }
    }
  }
})
```

Panda comes with a handful of colors picked from the amazing Tailwind color palette

<TokenDocs type="colors" />

### Spacing

Use the `spacing` key in the theme section of your Panda config file to customize the default spacing values.

```ts filename="panda.config.ts"
import { defineConfig } from '@pandacss/dev'

export default defineConfig({
  theme: {
    extend: {
      tokens: {
        spacing: {
          gutter: { value: '32px' }
        }
      }
    }
  }
})
```

Panda ships with the following spacing tokens by default:

<TokenDocs type="spacing" />

### Border Radius

Use the `radii` key in the theme section of your Panda config file to customize the default border radius values.

<TokenDocs type="radii" />

### Shadows

Use the `shadows` key in the theme section of your Panda config file to customize the default box shadows values.

Panda ships with the following shadows by default:

<TokenDocs type="shadows" />

### Sizing

Use the `sizes` key in the theme section of your Panda config file to customize the default sizing values.

```ts filename="panda.config.ts"
import { defineConfig } from '@pandacss/dev'

export default defineConfig({
  theme: {
    extend: {
      tokens: {
        sizes: {
          icon: { value: '24px' }
        }
      }
    }
  }
})
```

Panda ships with the following sizing tokens by default, in addition with the values from the default Panda
[spacing](#spacing) tokens:

<TokenDocs type="sizing" />

### Fonts

Use the `fonts` key in the theme object to customize the default font families.

```ts filename="panda.config.ts"
import { defineConfig } from '@pandacss/dev'

export default defineConfig({
  theme: {
    extend: {
      tokens: {
        fonts: {
          marketing: { value: 'Inter Variable' }
        }
      }
    }
  }
})
```

Panda ships with the following font families tokens by default:

<TokenDocs type="fonts" />

### Font Sizes

Use the `fontSizes` key in the theme object to customize the default font sizes.

```ts filename="panda.config.ts"
import { defineConfig } from '@pandacss/dev'

export default defineConfig({
  theme: {
    extend: {
      tokens: {
        fontSizes: {
          big: { value: '80px' }
        }
      }
    }
  }
})
```

Panda ships with the following font size tokens by default:

<TokenDocs type="fontSizes" />