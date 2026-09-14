# Testing Panda patterns

Test observable configuration and transform behavior. Source-text assertions are only appropriate for a deliberate static policy that cannot be observed through the pattern object.

## Required coverage

### Configuration

- The pattern is present under the expected registry key.
- `properties`, `defaultValues`, JSX metadata, `blocklist`, and `strict` match the public contract.
- A built-in extension remains present alongside inherited patterns rather than replacing the pattern collection.

### Transform behavior

- Each semantic prop changes the intended style property.
- Semantic props are removed from output.
- Unrelated style props survive through `...rest`.
- Default and explicit-value branches produce distinct expected output.
- Incompatible props follow the documented precedence.

### Values

- Token names resolve or serialize through the intended token category.
- CSS units and percentages remain literals.
- CSS variables and CSS functions remain valid when the public property accepts them.
- Values interpolated into `calc()` or shorthand strings include valid token fallbacks.

### Responsive behavior

- Pattern props support conditional values according to the contract.
- The transform uses `map` where responsive scalar transformation is required.
- Pattern props are tested at their top-level API position, not nested inside breakpoint style objects.

## Transform harness

A small helper object is usually enough for direct unit tests:

```ts
const helpers = {
  map: <T, U>(value: T, transform: (value: T) => U) => transform(value),
  isCssUnit: (value: string) => /^-?[\d.]+[a-z%]+$/i.test(value),
  isCssVar: (value: string) => value.startsWith('var('),
  isCssFunction: (value: string) => /^(calc|clamp|min|max|minmax)\(/i.test(value),
}
```

Direct tests prove transform decisions. Panda codegen or an integration fixture should additionally prove generated function/JSX types when public inference changes.

## Verification order

1. Run language-server diagnostics on changed files.
2. Run focused pattern tests.
3. Run Panda codegen when configured.
4. Run formatter, build, typecheck, lint, and full tests using commands discovered from the target repository.
5. Inspect generated output for the expected property names, conditions, and token references.

## Completion

Verification is complete when focused behavior tests, generated API checks when applicable, and the target repository's required quality commands all pass.
