# Application patterns

Load when designing results, lifecycle state, dependency boundaries, or asynchronous orchestration. Why: application patterns should make ownership visible and remain compatible with richer class architecture.

Use discriminated results and exhaustive handling:

```ts
type Result<Value, Failure = Error> =
  { ok: true; value: Value } | { ok: false; error: Failure };

function resultMessage(result: Result<string>): string {
  switch (result.ok) {
    case true:
      return result.value;
    case false:
      return result.error.message;
  }
}
```

Guidelines:

- Put invariant-preserving transitions on aggregates or domain services; use unions to describe finite state, not to force all behavior into functions.
- Use `async`/`await` for sequential orchestration and explicit promise combinators for deliberate concurrency.
- Choose loops, collection operators, or methods by clarity and ownership—not functional-versus-OOP ideology.
- Inject clocks, repositories, factories, transports, and loggers through owned interfaces.
- Parse transport responses before constructing domain objects.
- Do not use module mocks, reflective dispatch, fabricated generic returns, or broad configuration bags.

Next: use `designing-typescript-objects` when the behavior requires object architecture, persistence ports, or construction patterns; otherwise this step ends here.
