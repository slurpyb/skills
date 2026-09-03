# Patterns & pitfalls

The conventions that make pi tools good, and the traps that make them flaky. Distilled from the API and from the TypeScript rules this repo holds itself to.

## Patterns worth adopting

**The `description` is the API.** The model only has the `description` (and field descriptions) to decide when and how to call your tool. Spend real effort there. State *when to use it*, not just what it does. A perfect implementation with a vague description is a tool that never gets called.

**`details` is the contract; `content` is prose.** Put the exact, machine-readable result in `details` and pin it in tests. Write `content` for a reader and assert only structure/substrings on it. This keeps tests stable when you reword messages. See [04-results.md](04-results.md).

**Keep logic out of the factory.** The factory registers; helpers/`impl` modules implement. Logic that doesn't import pi is logic you can unit-test directly and reuse (e.g. wrapping the MCP tools in [11-recipes.md](11-recipes.md)).

**Resolve paths against `ctx.cwd`.** Never `process.cwd()`. The agent's working directory is `ctx.cwd`; relative paths mean nothing without it.

**Expected failures return content; bugs throw.** A not-found or invalid-input case should return a helpful `content` message plus a `details` flag so the model can recover. Reserve throwing for genuine, unexpected failures. See [04-results.md](04-results.md).

**Honor `signal` and `onUpdate` for slow tools, ignore them for fast ones.** Don't add progress noise to an instant tool; don't leave a multi-second tool uncancellable. See [05-streaming-updates.md](05-streaming-updates.md).

**One extension file, related tools.** Group the token tools together, the corpus tools together. One `pi -e`, several `registerTool` calls.

**Guard interactive UI with `ctx.hasUI`.** In `print`/`json` modes there's no one to answer a dialog. Fall back to a default or return an error; never hang waiting on input that can't come.

## TypeScript rules (this repo enforces them)

**`unknown`, never `any`.** Don't type a parameter or a value as `any`. Use `Type.Unknown()` in a schema and narrow inside `execute`, or model the real shape. The only place `any` legitimately appears is pi's own generic defaults (`TState = any`), which you don't write.

**Don't model invalid states.** If two fields can't both be set, don't have two optional fields — use a `Type.Union` of literal-tagged shapes, or an `action` discriminator (see Recipe 3). Optional-soup multiplies the states you have to handle.

**Push `null`/`undefined` to the perimeter.** Resolve absence once — at the schema edge or the top of `execute` — then let the rest of the function work with non-null values. Don't thread `T | undefined` through every helper.

**Switch on tagged unions exhaustively.** When you switch on an `action` literal union, add a `never` default so a new variant is a compile error, not a silent fallthrough:

```ts
switch (params.action) {
  case "search": return doSearch();
  case "get": return doGet();
  default: {
    const _exhaustive: never = params.action;
    throw new Error(`Unhandled action: ${String(_exhaustive)}`);
  }
}
```

**Prefer inference; annotate the boundary.** Let `Static<typeof Schema>` give you the params type; don't re-type internal locals. Annotate the things that cross a boundary (the schema, exported helpers), not every variable.

**Validate at the edge, trust inside.** pi already validates `params` against your schema before `execute` runs — so inside `execute`, the params are trustworthy. For data you load yourself (a JSON file, a fetch body), validate at that boundary before trusting it.

## Pitfalls

**Forgetting the `.ts` extension on relative imports.** Real-ESM execution needs `import "./impl.ts"`, not `"./impl"`, or you get `ERR_MODULE_NOT_FOUND`. Set `allowImportingTsExtensions` so `tsc` accepts it. This bit the MCP server already. See [10-loading-and-distribution.md](10-loading-and-distribution.md).

**Importing `@sinclair/typebox`.** It's **`typebox`**. Wrong package name = unresolved import.

**`Cannot find module` while the tool still runs.** pi resolves its deps from its own (nested) `node_modules`; your editor can't. Set up the `tools/` workspace with local deps so types resolve. The tool running under `pi -e` while `tsc` complains is exactly this mismatch.

**Omitting `promptSnippet` then wondering why the tool isn't in the prompt's tool list.** Custom tools are left out of the "Available tools" section unless they provide `promptSnippet`. The tool is still callable via the function schema; it's just not advertised in that prose list. Add a snippet if you want it surfaced there.

**Naming collisions.** A tool `name` that clashes with a built-in (`bash`, `read`, `edit`, `write`, `grep`, `find`, `ls`) or another active tool will conflict. Namespace your names if needed (`panda_resolve_token`).

**Narrowing custom tool events by `toolName ===`.** Doesn't work — `CustomToolCallEvent.toolName` is `string`. Use `isToolCallEventType<"name", Input>(...)`. See [08-events.md](08-events.md).

**Returning empty `content` on no-result.** The model reads `content` as the answer. "Found nothing" must be *said* in the text, not implied by an empty array.

**Over-tight schemas.** A `pattern` or literal-union that's stricter than reality rejects the model's valid arguments at validation time and the call just fails. Start permissive; tighten when you observe real misuse. Don't bake runtime-derived value sets (project-specific token names, corpus groups) into a literal union — keep them `Type.String()` and describe the space.

**Building logic against pi-in-the-loop.** Slow and expensive. Build against direct `execute()` tests in watch mode; spend pi runs only on tuning the `description`/trigger behavior. See [09-testing.md](09-testing.md).

## A pre-ship checklist

- [ ] `description` says *when* to use the tool, not just what it does.
- [ ] `parameters` fields have descriptions; optionals are `Type.Optional`, not "required-but-empty".
- [ ] `details` carries the exact result and is pinned by a test.
- [ ] not-found / invalid-input returns helpful `content`, doesn't throw.
- [ ] paths resolved against `ctx.cwd`.
- [ ] slow work honors `signal`; reports via `onUpdate`.
- [ ] relative imports carry `.ts`; typebox import is `"typebox"`.
- [ ] `tsc --noEmit` clean; tests green in watch.
- [ ] smoke-tested under `pi -e` and the model actually calls it.
