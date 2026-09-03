# Lifecycle events — `pi.on(...)`

Tools are *pulled* by the model. Events are *pushed* by pi. An extension can subscribe to the agent's lifecycle to observe, modify, or block what happens — without the model ever choosing to call it. This is how you build guardrails, loggers, auto-formatters, and policy layers around the agent.

You won't need events for a plain data tool. Reach for them when you want behavior that fires automatically.

## The shape

```ts
pi.on(eventName, (event, ctx) => result | void | Promise<result | void>);
```

Each event name has its own `event` payload type and, for some, a `result` type you return to influence behavior. The handler also receives the `ExtensionContext`.

## The events you'll actually use

The full union is large (session lifecycle, provider requests, message streaming, model selection, tree navigation, …). The high-value ones for tool authors:

### `tool_call` — intercept before a tool runs (can block)

Fires before any tool executes. The payload's `input` is **mutable** — mutate it in place to patch arguments. Return `{ block: true, reason }` to stop the call entirely.

```ts
pi.on("tool_call", (event, _ctx) => {
  if (event.toolName === "write" && String(event.input.path).startsWith("/etc")) {
    return { block: true, reason: "Refusing to write outside the project." };
  }
});
```

To narrow a custom tool's input type, use the exported guard `isToolCallEventType` (built-in tools narrow by name automatically; custom tools need explicit type params):

```ts
import { isToolCallEventType } from "@earendil-works/pi-coding-agent";

pi.on("tool_call", (event) => {
  if (isToolCallEventType<"resolve_token", { path: string }>("resolve_token", event)) {
    event.input.path = event.input.path.trim(); // patch args in place
  }
});
```

> Note from the source: direct narrowing via `event.toolName === "bash"` doesn't work, because `CustomToolCallEvent.toolName` is `string` and overlaps every literal. Use the guard.

### `tool_result` — rewrite a result after a tool runs

Fires after a tool executes. Return `{ content?, details?, isError? }` to replace any of them. Use it to redact secrets, append context, or normalize output across tools.

```ts
pi.on("tool_result", (event) => {
  if (event.toolName === "bash") {
    const scrubbed = event.content.map((c) =>
      c.type === "text" ? { ...c, text: c.text.replace(/sk-[A-Za-z0-9]+/g, "[redacted]") } : c,
    );
    return { content: scrubbed };
  }
});
```

### `before_agent_start` — see/replace the prompt for a turn

Fires after the user submits but before the agent loop. You get the raw `prompt`, any `images`, and the fully assembled `systemPrompt`. Return `{ systemPrompt }` to replace it for this turn (multiple extensions chain), or `{ message }` to inject a custom message.

### `session_start` / `session_shutdown` — setup and teardown

`session_start` fires on startup, reload, new, resume, or fork (the `reason` tells you which). Good for initializing per-session state — e.g. loading a token catalog once. `session_shutdown` fires before teardown for cleanup.

```ts
let catalog: Record<string, string> = {};
pi.on("session_start", async (_event, ctx) => {
  catalog = await loadCatalog(ctx.cwd);
});
```

### `agent_start` / `agent_end`, `turn_start` / `turn_end`

Loop and turn boundaries. `turn_end` gives you the assistant message and its `toolResults` — handy for logging what happened each turn.

### `user_bash` — intercept `!`/`!!` shell commands

Fires when the user runs a command with the `!` (or `!!`, excluded-from-context) prefix. You can supply custom operations or fully replace execution.

## The full event list (for reference)

From the `ExtensionEvent` union: `project_trust`, `resources_discover`, `session_start`, `session_before_switch`, `session_before_fork`, `session_before_compact`, `session_compact`, `session_shutdown`, `session_before_tree`, `session_tree`, `context`, `before_provider_request`, `after_provider_response`, `before_agent_start`, `agent_start`, `agent_end`, `turn_start`, `turn_end`, `message_start`, `message_update`, `message_end`, `tool_execution_start`, `tool_execution_update`, `tool_execution_end`, `model_select`, `thinking_level_select`, `tool_call`, `tool_result`, `user_bash`, `input`.

Each has a typed payload and some have typed results (e.g. `ContextEventResult`, `ToolCallEventResult`, `ToolResultEventResult`, `BeforeAgentStartEventResult`). The `pi.on` overloads enforce the right handler type per event name, so your editor will guide you once deps resolve.

## When to use events vs. a tool

- **Tool** — the model decides to do something. Data lookups, actions, computations the agent invokes deliberately.
- **Event** — *you* decide something happens automatically, regardless of the model. Guardrails (`tool_call` block), redaction (`tool_result`), logging (`turn_end`), setup (`session_start`).

A token-resolver is a tool. A "never let the model write outside the repo" rule is a `tool_call` handler. They compose: one extension file can register tools *and* `pi.on` handlers.
