# Advanced types

Load when generics, conditional types, mapped types, template literals, or tuples encode real relationships. Why: clever typing is valuable when it preserves ownership and remains testable.

Treat “a type parameter should appear twice” as a smell detector, not a law. A function-level output-only generic is unsafe unless a value token, constructor, schema, or enclosing class establishes it.

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

- Naked conditional parameters distribute over unions; wrap both sides in tuples when the whole union should be tested.
- Use template literals for structured domain strings, not to overfit open external formats.
- Variadic tuples preserve constructors, pipelines, and staged argument relationships. A top type inside a purely type-level constraint is acceptable when no callable contract exposes it.
- Currying can create separate inference sites: one call fixes an owner type, the next infers a key or operation.
- Prefer shallow readable transformations. Use accumulator-style recursion only when measured depth requires it.
- Generate large OpenAPI, GraphQL, database, or schema contracts; do not hand-maintain hundreds of inferred fields.
- Test expected inference and rejected calls. If implementation requires an unsupported cast to fulfill its signature, simplify the signature or move the relationship to a class/token/schema that proves it.

Next: load `type-testing.md` or `event-contracts.md` for the consuming pattern, or use `designing-typescript-objects` for construction APIs; otherwise this step ends here.
