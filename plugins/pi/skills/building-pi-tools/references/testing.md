# Tight-loop tool testing

Call `tool.execute()` directly. A running Pi process and model call are unnecessary for implementation tests.

## Harness shape

A reusable harness supplies:

- stable `toolCallId`
- typed parameters
- optional `AbortSignal`
- an `onUpdate` collector
- a fake `ExtensionContext` with fixture `cwd`, `hasUI: false`, and stub UI

Return `{ result, updates }`. Assert the full `result.details`, only stable structure/key text in `content`, and monotonic bounded progress in `updates`.

## Test matrix

1. Smallest successful call.
2. Empty, not-found, or invalid external input.
3. Already-aborted signal for cancellable tools.
4. Mid-run cancellation when partial progress matters.
5. Headless execution for any UI-capable tool.
6. Path behavior from a fixture cwd.
7. Honest reporting when an operation is partial.

Use explicit `.ts` suffixes for relative ESM imports and enable `allowImportingTsExtensions`. A practical tool workspace uses strict TypeScript, `moduleResolution: "bundler"`, `noEmit`, Vitest, direct `typebox`, and the Pi package as development dependencies.

## Trigger evaluation

After unit tests and typecheck:

- Positive prompt: clearly needs the capability; expect the tool call and valid args.
- Negative prompt: nearby wording that does not need the capability; expect no call.
- Recovery prompt: causes an expected failure; expect the model to act on the returned guidance.

Record prompt, selected model, tool call arguments, and outcome. Tune descriptions one change at a time.

## Completion

Testing is complete when logic is green without Pi, then routing is verified separately with one positive, one negative, and one recoverable-failure smoke.
