# Anatomy of a tool — `ToolDefinition` field by field

This is the full shape passed to `defineTool(...)`, taken from `ToolDefinition<TParams, TDetails, TState>` in the extension types. Required fields first, then the optional ones, then the execute signature in detail.

```ts
export interface ToolDefinition<TParams extends TSchema = TSchema, TDetails = unknown, TState = any> {
  name: string;
  label: string;
  description: string;
  promptSnippet?: string;
  promptGuidelines?: string[];
  parameters: TParams;
  renderShell?: "default" | "self";
  prepareArguments?: (args: unknown) => Static<TParams>;
  executionMode?: ToolExecutionMode; // "sequential" | "parallel"
  execute(toolCallId, params, signal, onUpdate, ctx): Promise<AgentToolResult<TDetails>>;
  renderCall?: (...) => Component;
  renderResult?: (...) => Component;
}
```

## Required fields

### `name: string`
The identifier the LLM uses in tool calls. Keep it short, lowercase, snake_case or kebab — it appears in the model's function-calling interface. Must be unique across all active tools; a collision with a built-in (`bash`, `read`, `edit`, `write`, `grep`, `find`, `ls`) or another extension's tool is a problem.

### `label: string`
Human-readable name for the TUI. Shown in the tool-execution row. This is for the *person* watching, not the model.

### `description: string`
The single most important field. This is the model's *entire* basis for deciding whether and how to call your tool. Write it as instructions: what the tool does, **when to reach for it**, and any constraints. A vague description means the tool gets ignored or misused. Compare:

```ts
description: "Resolve tokens.",                      // bad — model won't know when
description:
  "Resolve a Panda CSS design token (e.g. 'colors.brand.500') to its raw value. " +
  "Use whenever you need the concrete value behind a token name before writing CSS.",
```

### `parameters: TParams`
A TypeBox schema describing the arguments. `Type.Object({...})` in the common case. The model fills these; pi validates against the schema before your `execute` runs, so inside `execute` the `params` are already typed and valid. Full cookbook in [03-typebox-schemas.md](03-typebox-schemas.md). Use `Type.Object({})` for a no-argument tool.

### `execute(...)`
The implementation. Detailed below.

## Optional fields

### `promptSnippet?: string`
A one-line entry for the "Available tools" section of the default system prompt. **If you omit this, your custom tool is left out of that section entirely** — the model still sees the tool via the function-calling schema, but it won't be summarized in the prompt's tool list. Provide a snippet when you want the tool advertised up front.

### `promptGuidelines?: string[]`
Bullet points appended to the system prompt's Guidelines section *when this tool is active*. Use for usage rules that should always be in the model's context, e.g. `["Prefer resolve_token over guessing hex values.", "Never invent token names; list_tokens first."]`.

### `renderShell?: "default" | "self"`
Whether pi draws its standard colored execution shell around your tool's output (`"default"`) or you take over the framing yourself via `renderResult` (`"self"`). Leave unset for the normal look.

### `prepareArguments?: (args: unknown) => Static<TParams>`
A compatibility shim that runs on the **raw** arguments *before* schema validation. Use it to massage malformed model output into the expected shape (e.g. coercing a stringified JSON, renaming a legacy key). Must return an object conforming to `TParams`. No re-validation is skipped — the result still goes through the schema.

### `executionMode?: "sequential" | "parallel"`
Per-tool override of how this tool runs relative to other tool calls in the same batch. `"sequential"` forces it to run alone; `"parallel"` lets it run concurrently. Omit to inherit the default. Use `"sequential"` if your tool mutates shared state or must not interleave (e.g. it writes a file other tools read).

### `renderCall` / `renderResult`
Custom TUI components for how the call and its result are drawn. These pull in `@earendil-works/pi-tui` `Component` types and are an advanced, interactive-mode-only concern. You rarely need them — the default rendering of `content` is fine for almost every tool. Out of scope for this reference.

## The `execute` signature in full

```ts
execute(
  toolCallId: string,
  params: Static<TParams>,
  signal: AbortSignal | undefined,
  onUpdate: AgentToolUpdateCallback<TDetails> | undefined,
  ctx: ExtensionContext,
): Promise<AgentToolResult<TDetails>>;
```

- **`toolCallId`** — unique id for this invocation, stable across the call/result lifecycle. Useful as a key in logs or if you maintain per-call state.
- **`params`** — the validated, typed arguments. `Static<TParams>` means "the TypeScript type TypeBox infers from your schema", so if `parameters` is `Type.Object({ name: Type.String() })`, then `params.name` is `string`. No manual parsing.
- **`signal`** — an `AbortSignal | undefined`. The user (or pi) can cancel a running tool. Long-running work should check `signal?.aborted` and/or pass `signal` to `fetch`/`exec`. See [05-streaming-updates.md](05-streaming-updates.md).
- **`onUpdate`** — optional callback to stream partial results while you work. `(partialResult: AgentToolResult<TDetails>) => void`. See [05-streaming-updates.md](05-streaming-updates.md).
- **`ctx`** — the `ExtensionContext`: UI prompts, shell `exec`, session/model info, cwd, abort, compaction. See [06-context-and-ui.md](06-context-and-ui.md).

Return a `Promise<AgentToolResult<TDetails>>` — see [04-results.md](04-results.md).

## Minimal vs. fully-specified

Minimal (everything optional omitted):

```ts
defineTool({
  name: "ping",
  label: "Ping",
  description: "Reply 'pong'. A liveness check.",
  parameters: Type.Object({}),
  async execute() {
    return { content: [{ type: "text", text: "pong" }], details: {} };
  },
});
```

Fully specified:

```ts
defineTool({
  name: "resolve_token",
  label: "Resolve token",
  description:
    "Resolve a Panda CSS design token to its raw value. Use before writing any CSS that references a token.",
  promptSnippet: "resolve_token — turn a Panda token path into its concrete value",
  promptGuidelines: ["Never hardcode a hex value a token already defines; resolve_token first."],
  parameters: Type.Object({
    path: Type.String({ description: "Dot path, e.g. 'colors.brand.500'." }),
  }),
  executionMode: "parallel",
  async execute(_id, params, signal, _onUpdate, ctx) {
    // ...resolve against styled-system, honoring `signal`, using ctx if needed...
    return { content: [{ type: "text", text: "#5b8def" }], details: { path: params.path, value: "#5b8def" } };
  },
});
```
