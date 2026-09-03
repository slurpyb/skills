# Advanced types

Advanced types should encode an owned relationship that remains readable, testable, and measured.

A function-level generic output traces to a value token, constructor, schema, discriminator, or enclosing class.

```ts
type IsNever<Value> = [Value] extends [never] ? true : false;

type EventHandlers<Events> = {
  [
    Name in keyof Events as Name extends string
      ? `on${Capitalize<Name>}`
      : never
  ]: (event: Events[Name]) => void;
};

type Append<Values extends readonly unknown[], Value> = [...Values, Value];
```

- Naked conditional parameters distribute over unions; tuple wrapping tests the whole union.
- Template literals fit structured domain strings with a closed grammar.
- Variadic tuples preserve constructor, pipeline, and staged-argument relationships.
- Currying creates separate inference sites when one call fixes an owner and the next selects a key or operation.
- Shallow transformations are the default. Accumulator recursion responds to measured depth.
- Schemas generate large OpenAPI, GraphQL, database, and transport contracts.
- A cast needed to fulfill the implementation signals that the signature or evidence source should change.

## Completion

Every advanced type has a named owner and evidence source, positive and rejected-call fixtures pass, and measured compiler cost is acceptable.
