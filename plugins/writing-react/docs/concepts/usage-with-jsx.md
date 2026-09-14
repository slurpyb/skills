---
title: "Usage with JSX"
---

To use the pattern in JSX, you need to set the `jsxFramework` property in the config. When this is set, Panda will emit
files for JSX elements based on the framework.

Every pattern can be used as a JSX element and imported from the `/jsx` entrypoint. By default, the pattern name is the
function name in PascalCase. You can override both the component name (with the `jsx` config property) and the element
rendered (with the `jsxElement` config property).

Learn more about pattern customization [here](/docs/customization/patterns).

```tsx
import { VStack, Center } from '../styled-system/jsx'

function App() {
  return (
    <VStack gap="6" mt="4">
      <div>First</div>
      <div>Second</div>
      <div>Third</div>
      <Center>4</Center>
    </VStack>
  )
}
```

### Advanced JSX Tracking

We recommend that you use the pattern functions in most cases, in design systems there might be a need to compose
existing components to create new components.

To track the usage of the patterns in these cases, you'll need to add the `jsx` hint for the pattern config

```js {12} filename="button.pattern.ts"
import { definePattern } from '@pandacss/dev'

const scrollable = definePattern({
  // ...
  // Add the jsx hint to track the usage of the pattern in JSX, you can also use a regex to match multiple components
  jsx: ['Scrollable', 'PageScrollable']
})
```

Then you can create a new component that uses the `PageScrollable` component and Panda will track the usage of the
`scrollable` pattern as well.

```tsx
const PageScrollable = (props: ButtonProps) => {
  const { children, size } = props
  return (
    <Scrollable {...props} size={size}>
      {children}
    </Scrollable>
  )
}
```