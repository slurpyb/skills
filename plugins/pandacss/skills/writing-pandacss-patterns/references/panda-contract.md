# Panda pattern contract

## Pattern shape

A Panda pattern may define:

- `description`
- `properties`
- `defaultValues` as an object or function of incoming props
- `transform(props, helpers)` returning a system style object
- `jsx`, `jsxName`, and `jsxElement`
- `blocklist`
- `strict`

`definePattern` preserves the configuration while Panda generates function and JSX APIs from it.

## Property definitions

```ts
const properties = {
  gap: { type: 'property', value: 'gap' },
  minimum: { type: 'token', value: 'sizes', property: 'width' },
  direction: { type: 'enum', value: ['horizontal', 'vertical'] },
  intrinsic: { type: 'boolean' },
  limit: { type: 'number' },
} satisfies PatternProperties
```

Patterns accept semantic pattern props and ordinary Panda style props. The transform consumes semantic props and forwards the rest.

## Helpers

- `map(value, transform)` maps scalar and conditional values.
- `isCssUnit(value)` recognizes CSS dimensions and percentages.
- `isCssVar(value)` recognizes `var(...)` input.
- `isCssFunction(value)` recognizes CSS function input such as `calc(...)`, `min(...)`, or `clamp(...)`.

Use helpers before interpolating values into strings. Direct style properties can usually rely on Panda's normal token resolution.

## Extension semantics

`patterns.extend` deep-merges pattern definitions with preset values. Omitting `extend` can replace the inherited pattern collection.

```ts
export default definePreset({
  patterns: {
    extend: {
      grid,
      customLayout,
    },
  },
})
```

Panda's base preset supplies utilities, conditions, and built-in patterns. Its theme preset supplies design tokens and theme values. Explicit preset arrays may require the theme preset to be included explicitly, while the base preset remains automatic unless ejected.

## Responsive semantics

Responsive values belong on pattern props:

```tsx
<Grid columns={{ base: 1, md: 2 }} />
```

Nesting a semantic pattern prop inside a breakpoint style object bypasses the pattern transform. A new property therefore needs a deliberate conditional-value strategy rather than an accidental truthiness check.

## Portable implementation shape

```ts
import { definePattern } from '@pandacss/dev'
import type { InferProps, PatternProperties } from '@pandacss/types'

const properties = {
  gap: { type: 'property', value: 'gap' },
} satisfies PatternProperties

export type ExampleProps = InferProps<typeof properties>

export const example = definePattern({
  properties,
  defaultValues: { gap: '1rem' },
  transform(props) {
    const { gap, ...rest } = props
    return {
      display: 'grid',
      gap,
      ...rest,
    }
  },
})
```

## Version evidence

When exact parity matters, inspect the installed `@pandacss/preset-base` source or resolved preset object. Official references:

- https://panda-css.com/docs/concepts/patterns
- https://panda-css.com/docs/customization/patterns
- https://panda-css.com/docs/concepts/extend
- https://panda-css.com/docs/customization/presets

## Completion

Contract review is complete when the pattern fields, property definitions, helper behavior, extension semantics, and responsive strategy needed by the task are explicit.
