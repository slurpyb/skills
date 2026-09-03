# Tight loop — testing tools without booting pi

The fastest feedback when building a tool is **not** to launch pi and chat at it. It's to call `execute()` directly from a test and assert on what it returns. `execute` is just an async function; nothing about it requires a running agent. That gives you a sub-second red-green loop.

The companion to this page is the real workspace under `tools/` in this repo — it has the deps, the harness helper, and the watch scripts wired up. This page explains how it works so you can drive it.

## The core idea

A tool's `execute` takes `(toolCallId, params, signal, onUpdate, ctx)` and returns an `AgentToolResult`. In a test you supply those five yourself — fakes are fine — and assert on the result's `details` (exact, stable) and `content` (the model-facing text).

```ts
import { expect, test } from "vitest";
import { wordcount } from "../src/wordcount.ts";

test("counts words", async () => {
  const result = await wordcount.execute("test-call-1", { text: "one two three" }, undefined, undefined, fakeCtx());
  expect(result.details).toEqual({ words: 3, lines: 1, chars: 13 });
  expect(result.content[0]).toMatchObject({ type: "text" });
});
```

`signal` and `onUpdate` are both legitimately `undefined` in the simplest case (their types allow it), so a no-frills tool needs only a fake `ctx`.

## The harness helper

Threading five arguments by hand gets noisy. The repo's `tools/test/harness.ts` wraps it. Conceptually:

```ts
import type { AgentToolResult, ExtensionContext, ToolDefinition } from "@earendil-works/pi-coding-agent";
import type { Static, TSchema } from "typebox";

export interface RunToolOptions {
  signal?: AbortSignal;
  ctx?: Partial<ExtensionContext>;
}

export interface RunToolResult<D> {
  result: AgentToolResult<D>;
  updates: AgentToolResult<D>[]; // everything passed to onUpdate, in order
}

export async function runTool<TParams extends TSchema, TDetails>(
  tool: ToolDefinition<TParams, TDetails>,
  params: Static<TParams>,
  opts: RunToolOptions = {},
): Promise<RunToolResult<TDetails>> {
  const updates: AgentToolResult<TDetails>[] = [];
  const ctx = makeFakeCtx(opts.ctx);
  const result = await tool.execute(
    "test-call",
    params,
    opts.signal,
    (partial) => updates.push(partial),
    ctx,
  );
  return { result, updates };
}
```

`makeFakeCtx` returns a minimal `ExtensionContext` — `cwd` set to a temp or fixture dir, `hasUI: false`, and `ui` methods stubbed (so a tool that *would* prompt falls through to its headless default). Override per test via `opts.ctx`.

Then tests read cleanly:

```ts
import { runTool } from "./harness.ts";
import { wordcount } from "../src/wordcount.ts";

test("counts words", async () => {
  const { result } = await runTool(wordcount, { text: "one two three" });
  expect(result.details).toEqual({ words: 3, lines: 1, chars: 13 });
});

test("streams progress", async () => {
  const { result, updates } = await runTool(scanTool, { dir: "fixtures/sample" });
  expect(updates.length).toBeGreaterThan(0);             // it reported progress
  expect(result.details.done).toBe(result.details.total);
});

test("honors cancellation", async () => {
  const { result } = await runTool(scanTool, { dir: "fixtures/big" }, { signal: AbortSignal.abort() });
  expect(result.details.cancelled).toBe(true);
});
```

`AbortSignal.abort()` returns an already-aborted signal — the cleanest way to test the cancel path. For mid-run cancellation, pass an `AbortController`'s signal and call `.abort()` from inside a faked async dependency.

## The watch loop

Run vitest in watch mode and leave it up in a split pane. It re-runs only the affected tests on save:

```bash
cd tools
bun run test:watch      # vitest --watch
```

Write the test first (red), implement `execute` until it passes (green), refactor. Because there's no pi boot, no model call, and no network, each cycle is milliseconds. That is the tight loop.

Pair it with a typecheck watcher in a second pane so type errors surface as fast as test failures:

```bash
bun run typecheck:watch   # tsc --noEmit --watch
```

## TDD rhythm for a new tool

1. Decide the `name`, `description`, and the **`details` contract** — what structured result proves the tool worked. Write that as the first assertion.
2. Write the `parameters` schema. Derive `Static` and use it for the test's params.
3. Stub `execute` to return a wrong/empty result. Watch the test go red.
4. Implement until green.
5. Add edge-case tests: not-found, empty input, cancellation, malformed-but-recoverable args.
6. Only now load it into pi (`pi -e`) and confirm the model calls it sensibly. The unit tests already proved the logic; the pi run is just to validate the `description` triggers correctly.

The point of step 6 being last: pi-in-the-loop is the *slow* feedback. Spend it on prompt/description tuning, not on logic you can pin in milliseconds with a direct `execute` test.

## What to assert on

- **`result.details`** — primary. It's exact and you control it. Pin the full object with `toEqual` where practical.
- **`result.content`** — assert structure (`type: "text"`) and key substrings (`toContain`), not the exact prose, so reworded messages don't break tests.
- **`updates`** — for streaming tools, assert the progress sequence makes sense (monotonic, ends at total).
- **error paths** — assert the not-found/invalid case returns a helpful `content` message and a `details` flag, rather than throwing (unless throwing is the intended behavior).

See [04-results.md](04-results.md) for why `details` is the contract and `content` is prose.
