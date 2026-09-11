# Returning results — `AgentToolResult`

Every `execute` resolves to an `AgentToolResult<TDetails>`. The shape, verbatim from the source:

```ts
export interface AgentToolResult<T> {
  /** Text or image content returned to the model. */
  content: (TextContent | ImageContent)[];
  /** Arbitrary structured details for logs or UI rendering. */
  details: T;
  /**
   * Hint that the agent should stop after the current tool batch.
   * Early termination only happens when every finalized tool result in the batch sets this to true.
   */
  terminate?: boolean;
}
```

Three fields. Two you'll set every time (`content`, `details`), one you'll rarely touch (`terminate`).

## `content` — what the model reads

This is the tool's actual answer, the thing fed back into the model's context. It's an array of content blocks:

```ts
export interface TextContent { type: "text"; text: string; textSignature?: string; }
export interface ImageContent { type: "image"; data: string; mimeType: string; }
```

Text is the common case:

```ts
return {
  content: [{ type: "text", text: "3 matches found:\n- foo\n- bar\n- baz" }],
  details: { count: 3 },
};
```

Write `content` for a reader. The model treats it as the result of the call, so make it complete and unambiguous — include the values, not just "done". If your tool found nothing, *say* nothing-found in the text; don't return empty content.

### Images

For a tool that produces an image (a rendered component screenshot, a chart), return an `ImageContent` block with base64 `data` and a `mimeType`:

```ts
return {
  content: [
    { type: "text", text: "Rendered the Button component:" },
    { type: "image", data: pngBase64, mimeType: "image/png" },
  ],
  details: { width: 240, height: 80 },
};
```

You can mix text and image blocks in one array.

## `details` — structured data for you

`details` is typed by your tool's `TDetails` generic and is **not read by the model as prose**. It's for logs, telemetry, custom renderers (`renderResult`), and tests. Put the machine-readable version of the result here:

```ts
defineTool<typeof Params, { value: string; path: string }>({
  // ...
  async execute(_id, params) {
    const value = resolve(params.path);
    return {
      content: [{ type: "text", text: value }],   // model reads this
      details: { path: params.path, value },       // your code reads this
    };
  },
});
```

Tests assert on `details` because it's exact and stable; `content` is human prose that may be reworded. Keep `details` honest — it's the contract your tests pin.

If you have nothing structured to report, return `details: {}` (or `details: null` if your generic allows it). Don't omit the field — it's required by the interface.

## `terminate` — stop the agent loop

Set `terminate: true` to hint that the agent should stop after the current tool batch finishes. The source is explicit that this is a *batch consensus*: early termination only happens when **every** finalized tool result in the batch sets `terminate: true`. So one tool asking to stop won't stop a batch where another tool wants to continue.

Use it for a tool whose whole purpose is to end the session — a "submit final answer" or "task complete" tool. For ordinary tools, leave it unset.

```ts
return {
  content: [{ type: "text", text: "Task marked complete." }],
  details: { status: "done" },
  terminate: true,
};
```

## Returning errors

There is no separate error channel in the return type — you signal failure through `content`. Two valid styles:

**1. Throw.** If `execute` throws, pi catches it and surfaces it as a tool error to the model. Fine for unexpected failures:

```ts
async execute(_id, params) {
  const file = await read(params.path); // may throw ENOENT
  return { content: [{ type: "text", text: file }], details: { path: params.path } };
}
```

**2. Return a descriptive failure as content.** Better for *expected* failure modes, because you control the message the model sees and can tell it what to do next:

```ts
async execute(_id, params) {
  const token = lookup(params.path);
  if (token === undefined) {
    return {
      content: [{ type: "text", text: `No token at '${params.path}'. Call list_tokens to see valid paths.` }],
      details: { path: params.path, found: false },
    };
  }
  return { content: [{ type: "text", text: token }], details: { path: params.path, found: true } };
}
```

Prefer style 2 for anything the user could reasonably trigger. A good error message in `content` lets the model recover on its own. Reserve throwing for genuine bugs and unexpected I/O failures.

## Honesty rule

`content` is the truth the model acts on. Don't return "Successfully updated 3 files" unless three files were actually updated. If a step was skipped or partial, say so in the text and record the specifics in `details`. A tool that overstates its success makes the agent confidently wrong.
