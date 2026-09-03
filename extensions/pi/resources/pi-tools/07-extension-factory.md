# The extension factory — registering tools and more

A tool definition does nothing on its own. It has to be *registered* from an **extension**, which is a module with a default-exported factory function. pi calls that factory with the `ExtensionAPI` object (conventionally named `pi`), and the factory wires everything up.

```ts
export type ExtensionFactory = (pi: ExtensionAPI) => void | Promise<void>;
```

The factory may be sync or async (return a Promise if you need to do async setup before registering).

## The minimal factory

```ts
import { defineTool, type ExtensionAPI } from "@earendil-works/pi-coding-agent";
import { Type } from "typebox";

const myTool = defineTool({ /* ... */ });

export default (pi: ExtensionAPI) => {
  pi.registerTool(myTool);
};
```

`registerTool` is generic and preserves your tool's parameter/detail types:

```ts
registerTool<TParams extends TSchema = TSchema, TDetails = unknown, TState = any>(
  tool: ToolDefinition<TParams, TDetails, TState>,
): void;
```

## Registering several tools from one file

Common and encouraged — group related tools (e.g. all the Panda-token tools) in one extension:

```ts
export default (pi: ExtensionAPI) => {
  pi.registerTool(resolveToken);
  pi.registerTool(listTokens);
  pi.registerTool(searchTokens);
};
```

Each `name` must be unique. One file, one `pi install`/`-e`, three tools.

## Beyond tools — the rest of `ExtensionAPI`

The same `pi` object can register more than tools. You won't need most of these for data tools, but they're here so you know the surface.

### `registerCommand` — a slash command

```ts
registerCommand(name, {
  description?: string,
  getArgumentCompletions?: (prefix) => AutocompleteItem[] | null | Promise<...>,
  handler: (args: string, ctx: ExtensionCommandContext) => Promise<void>,
}): void
```

Adds a `/name` command the *user* types (not the model). The handler gets an `ExtensionCommandContext` (a superset of `ExtensionContext` with session-control methods like `newSession`, `fork`, `reload`). Use this for author/operator actions — "reload my tools", "dump token catalog" — rather than model-callable behavior.

```ts
pi.registerCommand("tokens", {
  description: "Print the resolved token catalog.",
  async handler(_args, ctx) {
    ctx.ui.notify(`cwd: ${ctx.cwd}`, "info");
  },
});
```

### `registerFlag` — a CLI flag

```ts
registerFlag(name, { description?, type: "boolean" | "string", default? }): void
getFlag(name): boolean | string | undefined
```

Lets your extension take configuration from the command line:

```ts
export default (pi: ExtensionAPI) => {
  pi.registerFlag("token-source", { type: "string", default: "styled-system", description: "Where to read tokens from." });
  pi.registerTool(defineTool({
    name: "resolve_token",
    // ...
    async execute(_id, params) {
      const source = pi.getFlag("token-source") as string;
      // ...
    },
  }));
};
```

Invoke: `pi -e ./tokens.ts --token-source ./custom-system`.

### `registerShortcut` — a key binding

```ts
registerShortcut(shortcut: KeyId, { description?, handler: (ctx) => Promise<void> | void }): void
```

Interactive-mode keyboard shortcut. Niche; for operator conveniences.

### `pi.on(...)` — lifecycle events

The big one for advanced extensions: subscribe to agent/session/tool lifecycle events to observe or intervene. Covered in [08-events.md](08-events.md).

### Other notable methods

- `pi.exec(command, args, options?)` — run a shell command (see [06-context-and-ui.md](06-context-and-ui.md)).
- `pi.getActiveTools()` / `pi.setActiveTools(names)` / `pi.getAllTools()` — inspect and control which tools are active.
- `pi.sendMessage(...)` / `pi.sendUserMessage(...)` — inject messages into the session.
- `pi.registerProvider(...)` / `unregisterProvider(...)` — register custom model providers (advanced; full config documented in the type source).
- `pi.events` — a shared `EventBus` for extension-to-extension communication.

## Shape conventions

- **Co-locate the schema, tool, and factory** in one file for a small tool. Split into modules (schema, impl, factory) once a tool grows or you want to unit-test the impl in isolation.
- **Name the parameter `pi`.** It's the convention across the docs and examples; matching it makes your extensions read like everyone else's.
- **Keep the factory thin.** It should register, not implement. Put logic in `execute` (or helpers it calls), so the factory stays a one-glance manifest of what the extension provides.

```ts
// tokens.ts — a complete, idiomatic extension
import { defineTool, type ExtensionAPI } from "@earendil-works/pi-coding-agent";
import { Type } from "typebox";
import { resolveToken, listTokens } from "./impl.ts";

export default (pi: ExtensionAPI) => {
  pi.registerTool(resolveToken);
  pi.registerTool(listTokens);
};
```
