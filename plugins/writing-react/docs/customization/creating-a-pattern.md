---
title: "Creating a Pattern"
---

To create a pattern, you can use the `patterns` property in the config. Let's say we want to create a "Scrollable"
pattern that applies preset styles to a container that allows for scrolling.

```js
const config = {
  patterns: {
    extend: {
      scrollable: {
        description: 'A container that allows for scrolling',
        defaultValues: {
          direction: 'vertical',
          hideScrollbar: true
        },
        properties: {
          // The direction of the scroll
          direction: { type: 'enum', value: ['horizontal', 'vertical'] },
          // Whether to hide the scrollbar
          hideScrollbar: { type: 'boolean' }
        },
        // disallow the `overflow` property (in TypeScript)
        blocklist: ['overflow'],
        transform(props) {
          const { direction, hideScrollbar, ...rest } = props
          return {
            overflow: 'auto',
            height: direction === 'horizontal' ? '100%' : 'auto',
            width: direction === 'vertical' ? '100%' : 'auto',
            scrollbarWidth: hideScrollbar ? 'none' : 'auto',
            WebkitOverflowScrolling: 'touch',
            '&::-webkit-scrollbar': {
              display: hideScrollbar ? 'none' : 'auto'
            },
            ...rest
          }
        }
      }
    }
  }
}
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

Now you can import the pattern and use it in your application:

```js
import { scrollable } from '../styled-system/patterns'

const App = () => {
  return (
    <div className={scrollable({ direction: 'vertical', hideScrollbar: true })}>
      <div>Scrollable content</div>
    </div>
  )
}
```