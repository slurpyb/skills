# Application patterns

Application patterns make ownership visible across outcomes, state, dependencies, and concurrency.

## Outcomes

Use discriminated results and exhaustive handling:

```ts
type Result<Value, Failure = Error> =
  | { ok: true; value: Value }
  | { ok: false; error: Failure };

function resultMessage(result: Result<string>): string {
  switch (result.ok) {
    case true:
      return result.value;
    case false:
      return result.error.message;
  }
}
```

## Ownership

- Put invariant-preserving transitions on aggregates or domain services.
- Use unions to enumerate finite state and owners to perform transitions.
- Use `async`/`await` for sequential orchestration and explicit promise combinators for deliberate concurrency.
- Choose loops, collection operators, or methods by clarity and ownership.
- Inject clocks, repositories, factories, transports, and loggers through owned interfaces.
- Parse transport responses before constructing domain objects.
- Reserve reflective dispatch for an explicit platform contract; use direct calls for owned ports.

## Completion

Every changed outcome is exhaustive, each transition and dependency has one owner, concurrency is deliberate, and success, rejection, and side-effect paths are exercised.
