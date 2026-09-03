# Tool contracts

```ts
import { defineTool } from "@earendil-works/pi-coding-agent";
import { Type, type Static } from "typebox";
```

A definition requires `name`, `label`, `description`, `parameters`, and `execute`. Use a unique lowercase tool name. The description is routing: state capability, trigger, and material constraints. `promptSnippet` advertises the tool in the default prompt's tool list; function calling still exposes a tool without it.

## Schema

Name the schema and derive its type with `Static<typeof Params>`. The call envelope is always `Type.Object({ ... })`; use `Type.Object({})` for no arguments.

- Keys are required unless wrapped in `Type.Optional`.
- Fixed choices use unions of literals.
- Runtime-derived value spaces stay strings with descriptions.
- Use `Type.Unknown()` plus narrowing for a genuinely open boundary; avoid `Type.Any()`.
- Keep argument objects shallow and describe non-obvious fields.

Pi validates parameters before `execute`; validate data loaded from files, processes, or networks separately.

## Result

Every result has:

- `content`: text/image blocks the model reads
- `details`: exact structured evidence for logs, UI, and tests
- optional `terminate`: a batch-consensus stop hint, reserved for completion tools

Expected not-found or user-caused failures return actionable text and structured failure details. Unexpected bugs and I/O failures may throw. Empty content is not an answer. Partial or cancelled work says so in both channels.

## Execution

The full signature is `(toolCallId, params, signal, onUpdate, ctx)`. Resolve paths against `ctx.cwd`. Pass `signal` to compatible APIs and check it in loops. `onUpdate?.(...)` receives a full partial result but does not become model context; the final return does.

Guard dialogs with `ctx.hasUI` and define a headless fallback. SDK sessions receive definitions through `customTools`; if a `tools` allowlist is present, include the custom name.

## Completion

The contract is complete when schema validation, routing text, structured evidence, failure recovery, cancellation, and headless behavior are each either tested or explicitly inapplicable.
