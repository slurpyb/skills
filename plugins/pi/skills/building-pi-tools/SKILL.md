---
name: building-pi-tools
description: Designs and tests model-callable Pi tools with TypeBox schemas, honest results, progress, and cancellation. Use when writing defineTool definitions, customTools for the Pi SDK, tool schemas, execute implementations, or direct tool tests.
metadata:
  version: "0.1.0"
---

# Building Pi Tools

Build the contract before the implementation. This skill targets SDK `customTools`; packaging tools through extensions is intentionally deferred.

## Workflow

1. Define the trigger, side effects, expected failures, and exact `details` contract. **Complete when:** a caller can tell when the tool applies and what proves success.
2. Read `references/contracts.md` and write a named TypeBox schema. **Complete when:** the top level is `Type.Object`, fields guide the model, and invalid states are not representable.
3. Write a red direct-`execute()` test using `references/testing.md`. **Complete when:** success, expected failure, and relevant cancellation/progress paths fail for the intended reason.
4. Implement `defineTool`; resolve paths from `ctx.cwd`, return recoverable failures as content, and throw unexpected failures. **Complete when:** `details` is exact and `content` tells the model the full truth.
5. Pass typecheck and tests, then add the definition to SDK `customTools` and any explicit `tools` allowlist. **Complete when:** the SDK session exposes the tool by name.
6. Run one trigger smoke and one non-trigger smoke. **Complete when:** the model calls the tool only for the intended branch.

## Guardrails

- Secrets enter through environment/config boundaries, never schema defaults or fixtures.
- Slow work honors `signal` and emits bounded `onUpdate` progress.
- Interactive behavior has a headless path.
- CLI/discovery registration, lifecycle hooks, TUI, and commands belong to extension work and are out of scope.

## References

- `references/contracts.md` — schemas, results, execution, and context
- `references/testing.md` — direct execution harness and trigger evaluation
