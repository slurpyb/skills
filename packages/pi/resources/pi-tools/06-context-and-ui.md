# The `ctx` object — UI, shell, and session state

The fifth argument to `execute` is `ctx: ExtensionContext`. It's your tool's window into the running agent: ask the user a question, run a shell command, read the cwd and current model, abort, trigger compaction. This page covers the parts a tool author actually uses.

## What's on `ExtensionContext`

The fields most relevant to tools:

```ts
interface ExtensionContext {
  ui: ExtensionUIContext;        // dialogs, notifications, status, widgets
  mode: "tui" | "rpc" | "json" | "print";
  hasUI: boolean;                // true when dialog UI is available (TUI + RPC)
  cwd: string;                   // current working directory
  sessionManager: ReadonlySessionManager;
  modelRegistry: ModelRegistry;
  model: Model<any> | undefined; // current model, may be undefined
  signal: AbortSignal | undefined;
  isIdle(): boolean;
  isProjectTrusted(): boolean;
  abort(): void;
  hasPendingMessages(): boolean;
  shutdown(): void;
  getContextUsage(): ContextUsage | undefined;
  compact(options?): void;
  getSystemPrompt(): string;
}
```

### `cwd`
Where the agent is working. Resolve relative paths against this, not `process.cwd()`:

```ts
import { resolve } from "node:path";
const abs = resolve(ctx.cwd, params.path);
```

### `hasUI` and `mode`
Guard any interactive UI behind `ctx.hasUI`. In `print`/`json` modes there's no one to answer a dialog, so `ui.select`/`confirm`/`input` won't work — fall back to a default or return an error instead of hanging.

```ts
let choice = params.choice;
if (!choice && ctx.hasUI) {
  choice = await ctx.ui.select("Pick a theme", ["light", "dark"]);
}
choice ??= "light"; // fallback when headless
```

## `ctx.ui` — talking to the user

The dialog primitives (all return Promises; the optional-result ones resolve `undefined` if dismissed):

```ts
ui.select(title, options, opts?): Promise<string | undefined>
ui.confirm(title, message, opts?): Promise<boolean>
ui.input(title, placeholder?, opts?): Promise<string | undefined>
ui.notify(message, type?: "info" | "warning" | "error"): void
ui.setStatus(key, text | undefined): void   // footer/status-bar text
ui.editor(title, prefill?): Promise<string | undefined>  // multi-line editor
```

`opts` is `{ signal?, timeout? }` — a timeout auto-dismisses the dialog with a live countdown.

Example — confirm a destructive action before doing it:

```ts
async execute(_id, params, _signal, _onUpdate, ctx) {
  if (ctx.hasUI) {
    const ok = await ctx.ui.confirm("Overwrite file?", `${params.path} exists. Replace it?`);
    if (!ok) {
      return { content: [{ type: "text", text: "Cancelled by user." }], details: { wrote: false } };
    }
  }
  await write(params.path, params.content);
  return { content: [{ type: "text", text: `Wrote ${params.path}.` }], details: { wrote: true } };
}
```

`ui.notify` is fire-and-forget (returns `void`) — a toast, not a question. `ui.setStatus` parks persistent text in the footer (pass `undefined` to clear).

> The `ui` object has a large surface for building full custom components, footers, headers, editors, and overlays (`custom`, `setWidget`, `setFooter`, `setEditorComponent`, …). Those are for building interactive *extensions*, not data tools — out of scope here. A tool that needs the user to choose or confirm wants `select` / `confirm` / `input`, nothing more.

## Running shell commands — `pi.exec` vs. Node

The `ExtensionAPI` (the `pi` object in your factory, see [07-extension-factory.md](07-extension-factory.md)) exposes `exec`:

```ts
exec(command: string, args: string[], options?: ExecOptions): Promise<ExecResult>;
```

This is the agent-integrated way to run a process. If your tool needs to shell out (run a formatter, a typechecker, a build), prefer capturing the `pi` reference in your factory and using `pi.exec` so the run is consistent with pi's execution model. You *can* also use Node's `child_process`/`execFile` directly — just remember to honor `ctx.signal` and resolve paths against `ctx.cwd`.

```ts
export default (pi: ExtensionAPI) => {
  pi.registerTool(defineTool({
    name: "typecheck",
    label: "Typecheck",
    description: "Run tsc --noEmit and report diagnostics.",
    parameters: Type.Object({}),
    async execute(_id, _params, signal, _onUpdate, ctx) {
      const res = await pi.exec("tsc", ["--noEmit"], { cwd: ctx.cwd, signal });
      const clean = res.code === 0;
      return {
        content: [{ type: "text", text: clean ? "Typecheck clean." : res.stdout || res.stderr }],
        details: { code: res.code, clean },
      };
    },
  }));
};
```

(`ExecResult`/`ExecOptions` are exported types; the exact fields — `code`, `stdout`, `stderr` — come from pi's `exec` module. Check the result's `code` for success.)

## Session and model info

- `ctx.model` — the active `Model`, or `undefined`. Read its id/name if your tool's behavior depends on the model.
- `ctx.sessionManager` — read-only access to session entries. Rarely needed in a data tool.
- `ctx.getContextUsage()` — token usage of the active context window. Useful for a tool that reports or reacts to context pressure.
- `ctx.compact(opts?)` / `ctx.abort()` / `ctx.shutdown()` — control the loop. These belong in *control* tools, not data tools; use sparingly and only when the tool's job is to manage the session.

## The rule of least context

Most tools need only `ctx.cwd` (and maybe `ctx.signal`, which is also passed separately). Reach for `ctx.ui` when you genuinely need a human decision, and `pi.exec` when you must run a process. Everything else on `ctx` is for building richer extensions, not for the typical "do a bounded task and return data" tool.
