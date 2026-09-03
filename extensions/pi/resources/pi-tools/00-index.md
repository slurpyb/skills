# Authoring pi tools — boilerplate & examples

This is a hand-written reference for building **tools and extensions** for the pi coding agent (`@earendil-works/pi-coding-agent`, the same lineage as Flue). Every type and signature here was read straight out of the installed package's `.d.ts` files (v0.79.8), not invented. Where the source has a comment worth keeping, it's quoted.

A "tool" is a function the LLM can call. You describe it with `defineTool(...)`, register it from an extension factory, and load that extension into pi. That's the whole game. Everything else — schemas, streaming, UI, lifecycle events — is detail layered on top.

## The pages

1. **[01-quickstart.md](01-quickstart.md)** — the smallest tool that works, loaded with `pi -e`, start to finish.
2. **[02-anatomy.md](02-anatomy.md)** — `ToolDefinition` field by field. The full reference for what a tool *is*.
3. **[03-typebox-schemas.md](03-typebox-schemas.md)** — writing the `parameters` schema in TypeBox. A cookbook of the shapes you'll actually use.
4. **[04-results.md](04-results.md)** — `AgentToolResult`: `content`, `details`, `terminate`, and how to return errors.
5. **[05-streaming-updates.md](05-streaming-updates.md)** — `onUpdate` for long-running tools that report progress.
6. **[06-context-and-ui.md](06-context-and-ui.md)** — the `ctx` object: asking the user questions, running shell commands, reading session state.
7. **[07-extension-factory.md](07-extension-factory.md)** — the default export. Registering one tool, many tools, commands, flags, and shortcuts.
8. **[08-events.md](08-events.md)** — `pi.on(...)` lifecycle hooks. Blocking tool calls, rewriting results, reacting to sessions.
9. **[09-testing.md](09-testing.md)** — TDD: calling `execute()` directly from vitest, no pi boot. The red-green loop.
10. **[10-loading-and-distribution.md](10-loading-and-distribution.md)** — `-e`, the discovery directory, `pi install`, and how imports/typecheck resolve.
11. **[11-recipes.md](11-recipes.md)** — three complete, worked tools you can paste and adapt.
12. **[12-patterns-and-pitfalls.md](12-patterns-and-pitfalls.md)** — conventions, gotchas, and the TypeScript rules that keep tools honest.
13. **[13-mcp-reconstruction.md](13-mcp-reconstruction.md)** — using mcporter (and friends) to reconstruct existing MCP servers into native pi tools.

## The one-minute mental model

```ts
import { defineTool, type ExtensionAPI } from "@earendil-works/pi-coding-agent";
import { Type } from "typebox";

// A tool: name + description (for the LLM) + parameters (TypeBox) + execute().
const greet = defineTool({
  name: "greet",
  label: "Greet",
  description: "Return a friendly greeting for a given name.",
  parameters: Type.Object({ name: Type.String() }),
  async execute(_toolCallId, params) {
    return {
      content: [{ type: "text", text: `Hello, ${params.name}.` }],
      details: { name: params.name },
    };
  },
});

// An extension: a default-exported factory that registers the tool.
export default (pi: ExtensionAPI) => {
  pi.registerTool(greet);
};
```

Load it: `pi -e ./greet.ts`. The LLM can now call `greet`.

That is the entire surface in miniature. The rest of these pages expand each piece.

## Verified facts to anchor on

- Public entry point is `@earendil-works/pi-coding-agent`. `defineTool`, `CustomEditor`, the SDK helpers, and every type below are exported from its package root.
- The parameters schema library is **`typebox`** — import `{ Type }` from `"typebox"`, *not* `@sinclair/typebox`.
- `execute` signature is `(toolCallId, params, signal, onUpdate, ctx) => Promise<AgentToolResult<TDetails>>`.
- Extensions load via the `-e` / `--extension` flag (repeatable), or by discovery from `~/.pi/agent/tools/` and project-local `.pi/`. `-ne` / `--no-extensions` disables them.
- typebox lives nested inside pi's own `node_modules`, which is why a standalone extension file needs its own local copy to typecheck (see page 10).
