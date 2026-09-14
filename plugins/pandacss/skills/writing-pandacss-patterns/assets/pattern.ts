import { definePattern } from '@pandacss/dev'
import type { InferProps, PatternProperties } from '@pandacss/types'

const properties = {
  gap: { type: 'property', value: 'gap' },
  columns: { type: 'number' },
} satisfies PatternProperties

export type ExamplePatternProps = InferProps<typeof properties>

/** Replace this description with the reusable styling contract the pattern owns. */
export const examplePattern = definePattern({
  description: 'Replace with a concise public description',
  jsx: ['ExamplePattern'],
  properties,
  defaultValues: {
    gap: '1rem',
  },
  transform(props, { map }) {
    const { gap, columns, ...rest } = props

    return {
      display: 'grid',
      gap,
      gridTemplateColumns:
        columns == null
          ? undefined
          : map(columns, (value) => `repeat(${value}, minmax(0, 1fr))`),
      ...rest,
    }
  },
})
