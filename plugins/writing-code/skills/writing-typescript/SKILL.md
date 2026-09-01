---
name: writing-typescript
description: Writes TypeScript services around parsed boundaries, owned dependencies, explicit outcomes, and tests. Use when implementing adapters, state or result handling, dependency orchestration, or async workflows.
metadata:
  version: "4.1.0"
  domain: language
  role: specialist
  scope: implementation
  output-format: code
---

# Writing TypeScript

## Workflow

Flow: inspect → decode → own → implement → prove → gate

1. **Inspect** TypeScript, lint, package, runtime, and agent configuration. Complete when every applicable command and constraint is identified.
2. **Decode** external JSON, YAML, environment, storage, and framework values with the repository schema library. Complete when every external value on the changed path becomes an owner type before application behavior.
3. **Own** changed values and dependencies with named contracts. Complete when each contract has one application or domain owner and representations remain in adapters.
4. **Implement** state transitions, side effects, failure, and concurrency explicitly. Complete when each behavior follows known value evidence and an owned contract.
5. **Prove** behavior with runtime tests and inference with compile-time fixtures. Complete when success, rejection, side-effect, and type-relationship paths are exercised where applicable.
6. **Gate** with repository lint and typecheck commands. Complete when applicable checks pass with zero owned-source errors and unchanged policy strength.

## Evidence

- Callable contracts use concrete owner types; top types remain inside purely type-level constraints.
- Parsing, construction, or inference establishes each value before use.
- An irreducible platform or library assertion carries an immediate `SAFETY:` invariant.
- Owned ports are called directly and tested through concrete fakes or in-memory implementations.

## Routes

- Load `references/type-guards.md` when external values cross an I/O boundary or a closed union needs narrowing.
- Load `references/patterns.md` when implementing Result APIs, lifecycle state, dependency ports, or asynchronous orchestration.

## Completion

Report ownership, boundary decisions, validation outcomes, and residual limitations. Every applicable workflow criterion must be satisfied.
