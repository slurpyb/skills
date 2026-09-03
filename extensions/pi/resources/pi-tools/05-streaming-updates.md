# Streaming progress & cancellation

Two of `execute`'s parameters exist for long-running tools: `signal` (cancellation) and `onUpdate` (progress). Short, fast tools ignore both. Anything that takes more than a moment — a build, a fetch, a multi-file scan — should honor them.

```ts
execute(toolCallId, params, signal, onUpdate, ctx)
```

## `onUpdate` — stream partial results

`onUpdate` has type `AgentToolUpdateCallback<TDetails>`, which is:

```ts
export type AgentToolUpdateCallback<T = any> = (partialResult: AgentToolResult<T>) => void;
```

It takes the **same shape** as your final return value — a full `AgentToolResult` — and you call it as often as you like while working. pi renders these partials in the TUI so the user sees progress. The final value you `return` is what actually lands in the model's context; the updates are transient UI.

```ts
async execute(_id, params, signal, onUpdate) {
  const files = await listFiles(params.dir);
  const results: string[] = [];
  for (let i = 0; i < files.length; i++) {
    if (signal?.aborted) break;
    results.push(await process(files[i]));
    onUpdate?.({
      content: [{ type: "text", text: `Processed ${i + 1}/${files.length}…` }],
      details: { done: i + 1, total: files.length },
    });
  }
  return {
    content: [{ type: "text", text: `Processed ${results.length} files.` }],
    details: { done: results.length, total: files.length },
  };
}
```

`onUpdate` is optional (`onUpdate?.(...)`) — always call it with the optional-chaining guard, because in some modes (and in tests) it's `undefined`.

## `signal` — cancellation

`signal` is an `AbortSignal | undefined`. The user can cancel a running tool (escape in the TUI), or pi can abort it. A well-behaved tool stops promptly when that happens. Two ways to honor it:

**Check `signal.aborted` in loops** (as above) — cheap, good for CPU-bound or step-by-step work.

**Pass `signal` to async APIs that accept it** — `fetch`, child-process helpers, `ctx.exec`:

```ts
async execute(_id, params, signal) {
  const res = await fetch(params.url, { signal }); // aborts the request when cancelled
  return { content: [{ type: "text", text: await res.text() }], details: { url: params.url } };
}
```

When aborted mid-fetch, `fetch` rejects with an `AbortError`; let it throw (pi handles it) or catch and return a partial result describing what you got.

### What to return when aborted

If you break out of work early because `signal.aborted`, return what you have and say it was cancelled — don't pretend it finished:

```ts
if (signal?.aborted) {
  return {
    content: [{ type: "text", text: `Cancelled after ${results.length}/${files.length} files.` }],
    details: { done: results.length, total: files.length, cancelled: true },
  };
}
```

## Testing streaming tools

Because `onUpdate` is just a function you call, tests can pass a spy and assert the progress sequence. Because `signal` is a standard `AbortSignal`, tests can pass `AbortSignal.abort()` (an already-aborted signal) or an `AbortController` they trigger mid-run. See [09-testing.md](09-testing.md) for the harness that wires both.

## When not to bother

If your tool returns in well under a second and does a single bounded operation, skip both: `async execute(_id, params) { ... }` with no `signal`/`onUpdate` use is perfectly correct. Don't add progress noise to a tool that's instant.
