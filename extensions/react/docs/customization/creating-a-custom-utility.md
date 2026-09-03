---
title: "Creating a custom utility"
---

Let's say we want to create new property `br` that applies a border radius to an element.

```ts filename="panda.config.ts"
import { defineConfig } from '@pandacss/dev'

export default defineConfig({
  utilities: {
    extend: {
      br: {
        className: 'rounded', // css({ br: "sm" }) => rounded-sm
        values: 'radii', // connect values to the radii tokens
        transform(value) {
          return { borderRadius: value }
        }
      }
    }
  }
})
```

Then you can run the following command to generate the pattern JS code:

<Tabs items={['pnpm', 'npm', 'yarn', 'bun']}>
  {/* <!-- prettier-ignore-start --> */}
    <Tab>
      ```bash
      pnpm panda codegen
      ```
    </Tab>
    <Tab>
      ```bash
      npm panda codegen
      ```
    </Tab>
    <Tab>
      ```bash
      yarn panda codegen
      ```
    </Tab>
    <Tab>
      ```bash
      bun panda codegen
      ```
    </Tab>
  {/* <!-- prettier-ignore-end --> */}
</Tabs>

Now, we can use the `br` property in our components.

```jsx
import { css } from '../styled-system/css'

function App() {
  return <div className={css({ br: 'sm' })} />
}
```

or use in JSX style props

```jsx
import { styled } from '../styled-system/jsx'

function App() {
  return <styled.div br="sm" />
}
```

### Using enum values

Let's say we want to create a new property `borderX` that applies a limited set of inline border to an element and
automatically applies the border color.

```ts filename="panda.config.ts"
import { defineConfig } from '@pandacss/dev'

export default defineConfig({
  utilities: {
    extend: {
      borderX: {
        values: ['1px', '2px', '4px'],
        shorthand: 'bx', // `bx` or `borderX` can be used
        transform(value, { token }) {
          return {
            borderInlineWidth: value,
            borderColor: token('colors.red.200') // read the css variable for red.200
          }
        }
      }
    }
  }
})
```

Now, we can use the `borderX` or `bx` property in our components.

```jsx
import { css } from '../styled-system/css'

function App() {
  return <div className={css({ borderX: '2px' })} />
}
```

### Using mapped values

```ts filename="panda.config.ts"
import { defineConfig } from '@pandacss/dev'

export default defineConfig({
  utilities: {
    extend: {
      borderX: {
        values: { small: '2px', medium: '5px' },
        shorthand: 'bx',
        transform(value, { token }) {
          return {
            borderTopWidth: value,
            borderTopColor: token('colors.gray.400')
          }
        }
      }
    }
  }
})
```

### Using boolean values

```ts filename="panda.config.ts"
import { defineConfig } from '@pandacss/dev'

export default defineConfig({
  utilities: {
    extend: {
      truncate: {
        className: 'truncate',
        values: { type: 'boolean' },
        transform(value) {
          if (!value) return {}
          return {
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap'
          }
        }
      }
    }
  }
})
```