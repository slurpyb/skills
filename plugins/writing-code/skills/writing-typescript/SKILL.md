---
name: writing-typescript
description: Implements and refactors TypeScript runtime behavior with parsed boundaries, owned contracts, explicit outcomes, tests, and repository validation. Use when changing .ts or .tsx application behavior, integrating external values, wiring dependencies, handling state or results, or reviewing implementation type safety.
metadata:
  version: "4.0.0"
  domain: language
  role: specialist
  scope: implementation
  output-format: code
---

# Writing TypeScript

## Workflow

Flow: inspect → decode → own → implement → prove → gate

1. **Inspect** TypeScript, lint, package, runtime, and agent configuration. Complete when the applicable commands and constraints are identified.
2. **Decode** external JSON, YAML, environment, storage, and framework values with the repository schema library. Complete when only parsed owner types enter application behavior.
3. **Own** values and dependencies with named contracts. Complete when each abstraction has one domain or application owner.
4. **Implement** explicit state transitions, results, side effects, and concurrency. Complete when behavior follows owner contracts without reflective dispatch or fabricated types.
5. **Prove** success, rejection, and side-effect paths with runtime tests. Add compile-time fixtures when inference is part of the contract.
6. **Gate** with repository lint and typecheck commands. Complete at zero owned-source errors without policy weakening.

## Evidence policy

- Expose named domain types in callable contracts. Keep explicit `any`, bare `object`, top-type parameters or returns, and unsafe dictionaries outside them.
- Parse representations once at I/O boundaries; narrow closed domain unions by discriminant afterward.
- Establish values through parsing, construction, or inference. An irreducible platform or library assertion carries an immediate `SAFETY:` invariant.
- Preserve evidence with inference, `as const`, and `satisfies`.
- Inject owned ports and concrete test implementations. Call them directly.
- Use loops, collection operators, classes, or functions according to ownership and clarity rather than ideology.

```ts
const command = createOrderSchema.parse(requestBody);
const result = await orderService.create(command);
```

The schema establishes the command contract once; downstream behavior receives an owned value.

## Routes

- Load `references/type-guards.md` for schema boundaries, typed predicates, and exhaustive narrowing.
- Load `references/patterns.md` for Result APIs, state handling, dependency ports, and asynchronous orchestration.

## Completion

Report implementation ownership, boundary decisions, validation commands and outcomes, and residual limitations. Every applicable workflow criterion must be satisfied.
