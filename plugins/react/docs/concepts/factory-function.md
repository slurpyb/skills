---
title: "Factory Function"
---

You can also use the `styled` function to create a styled component from any component or JSX intrinsic element (like
"a", "button").

```jsx
import { styled } from '../styled-system/jsx'
import { Button } from 'component-library'

const StyledButton = styled(Button)

const App = () => (
  <StyledButton bg="blue.500" color="white" py="2" px="4" rounded="md">
    Button
  </StyledButton>
)
```

> You can configure the `styled` function name using the [`config.jsxFactory`](/docs/references/config#jsxfactory)
> option.

### Factory Recipe

You can define a recipe for your component using the `styled` function. This is useful when you want to create a
component that has a specific set of style props.

```jsx
import { styled } from '../styled-system/jsx'

const Button = styled('button', {
  base: {
    py: '2',
    px: '4',
    rounded: 'md'
  },
  variants: {
    variant: {
      primary: {
        bg: 'blue.500',
        color: 'white'
      },
      secondary: {
        bg: 'gray.500',
        color: 'white'
      }
    }
  }
})

const App = () => (
  <Button variant="secondary" mt="10px">
    Button
  </Button>
)
```

### Factory Options

There's a few options you can pass to the `styled` function to customize the behavior of the generated component.

```ts
interface FactoryOptions<TProps extends Dict> {
  dataAttr?: boolean
  defaultProps?: TProps
  shouldForwardProp?(prop: string, variantKeys: string[]): boolean
}
```

#### `dataAttr`

Setting `dataAttr` to true will add a `data-recipe="{recipeName}"` attribute to the element with the recipe name. This
is useful for testing and debugging.

```jsx
import { styled } from '../styled-system/jsx'
import { button } from '../styled-system/recipes'

const Button = styled('button', button, { dataAttr: true })

const App = () => <Button variant="secondary">Button</Button>
// => <button data-recipe="button" class="btn btn--variant_purple">Button</button>
```

#### `defaultProps`

allows you to skip writing wrapper components just to set a few props. It also allows you to locall override the default
variants or base styles of a recipe.

```jsx
import { styled } from '../styled-system/jsx'
import { button } from '../styled-system/recipes'

const Button = styled('button', button, {
  defaultProps: {
    variant: 'secondary',
    px: '10px'
  }
})

const App = () => <Button>Button</Button>
// => <button class="btn btn--variant_secondary px_10px">Button</button>
```

#### `shouldForwardProp`

Used to customize which props are forwarded to the underlying element. By default, all props except recipe variants and
style props are forwarded.

For example, you could use it to integrate with [Framer Motion](https://www.framer.com/motion/).

```jsx
import { styled } from '../styled-system/jsx'
import { button } from '../styled-system/recipes'
import { motion, isValidMotionProp } from 'framer-motion'

const StyledMotion = styled(
  motion.div,
  {},
  {
    shouldForwardProp: (prop, variantKeys) =>
      isValidMotionProp(prop) || (!variantKeys.includes(prop) && !isCssProperty(prop))
  }
)
```

### Unstyled prop

All styled components accept an `unstyled` prop that allows you to disable the recipe styles. This is useful when you
want to use a component's structure but apply completely custom styling.

```jsx
import { styled } from '../styled-system/jsx'
import { button } from '../styled-system/recipes'

const Button = styled('button', button)

const App = () => (
  <>
    {/* With recipe styles */}
    <Button>Styled Button</Button>

    {/* Without recipe styles, but inline styles still work */}
    <Button unstyled bg="red.500" color="white">
      Unstyled Button
    </Button>
  </>
)
```

### Reducing the allowed style props

You can reduce the allowed JSX properties on the factory using
[`config.jsxStyleProps`](/docs/references/config#jsxstyleprops):

- When set to 'all', all style props are allowed.
- When set to 'minimal', only the `css` prop is allowed.
- When set to 'none', no style props are allowed and therefore the `jsxFactory` will not be usable as a component:
  - `<styled.div />` and `styled("div")` aren't valid
  - but the recipe usage is still valid `styled("div", { base: { color: "red.300" }, variants: { ...} })`

> Removing style props (from `all` to either `minimal` or `none`) will reduce the size of the generated code due to not
> having to check which props are style props at runtime.