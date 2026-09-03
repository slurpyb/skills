---
title: "Using Style Props"
---

### JSX Element

Style props are just CSS properties that you can pass to your components as props. With the JSX runtime, you can use
`styled.<element>` syntax to create supercharged JSX elements that support style props.

```jsx
import { styled } from '../styled-system/jsx'

const Button = ({ children }) => (
  <styled.button bg="blue.500" color="white" py="2" px="4" rounded="md">
    {children}
  </styled.button>
)
```

### Property Renaming

<Callout type="warning">Due to the static nature of Panda, you can't rename properties at runtime.</Callout>

```tsx filename="App.tsx"
import { Circle, CircleProps } from '../styled-system/jsx'

type Props = {
  circleSize?: CircleProps['size']
}

const CustomCircle = (props: Props) => {
  const { circleSize = '3' } = props
  return (
    <Circle
      // ❌ Avoid: Panda can't know that you're mapping `circleSize` to `size`
      size={circleSize}
    />
  )
}

// ...

const App = () => {
  return (
    // In this case, you should keep the `size` naming
    <CustomCircle circleSize="4" />
  )
}
```

The same principles apply to all style props, recipe variants, and pattern props.

<Callout type="info">
  If you still need to rename properties at runtime, you can use `config.staticCss` as an escape-hatch to pre-generate
  the CSS anyway for the properties you need.
</Callout>

### Recipe

You can use recipe variants as JSX props to quickly change the styles of your components, as long as
[you're tracking those components in your recipe config](/docs/concepts/recipes#advanced-jsx-tracking).

```tsx
import { styled } from '../styled-system/jsx'
import { button, type ButtonVariantProps } from '../styled-system/recipes'

const Button = (props: ButtonVariantProps) => <button className={button(props)}>Button</button>

const App = () => <Button variant="secondary">Button</Button>
```