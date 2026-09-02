# SDK composition

## Pick the host

- `createAgentSession()` — one session; simplest embedding and tests.
- `createAgentSessionRuntime()` — new/resume/fork/import flows that replace cwd-bound runtime state.
- `pi --mode rpc --no-session` — another language or process-isolation boundary; frame records as strict LF-delimited JSONL.

## Owned services

`ModelRuntime` owns model catalogs and credential resolution. `SettingsManager` owns merged settings and queued persistence. `SessionManager` owns in-memory or JSONL persistence. `DefaultResourceLoader` discovers skills, prompts, context files, themes, and extensions; its override callbacks can filter or add resources while preserving diagnostics.

For deterministic tests:

```ts
const settingsManager = SettingsManager.inMemory({ retry: { enabled: false } });
const sessionManager = SessionManager.inMemory(cwd);
```

Build a loader with explicit overrides when host behavior must not depend on ambient user resources. Call `await loader.reload()` before session creation.

## Models and auth

Create `ModelRuntime` once per host policy. Runtime API keys are non-persistent; stored credentials and environment variables are resolved by the runtime. Remote catalog refresh is opt-in/bounded in SDK code. Give network operations an abort signal and treat cached catalog availability separately from freshness.

## Tools

`tools` is an allowlist across built-in, extension, and custom tools. Defaults are `read`, `bash`, `edit`, and `write`. Pass definitions through `customTools`; include their names when an allowlist is present. Prefer read-only sets for analysis hosts.

## Prompting and events

`prompt()` resolves after an accepted SDK run finishes. During streaming, choose `streamingBehavior: "steer" | "followUp"` or call `steer()`/`followUp()`. `preflightResult` reports acceptance, not eventual success. Subscribe for text deltas, tool lifecycle, queue updates, retries, and compaction. RPC clients treat the command response as acceptance and wait for `agent_settled` when no retry, compaction retry, or queued continuation may follow. Always retain and call the unsubscribe function.

## Replacement runtime

After `newSession`, `switchSession`, `fork`, or import:

1. release the old subscription;
2. take `runtime.session` again;
3. bind session-local integration;
4. subscribe again.

Dispose sessions/runtimes in `finally`. Call `SettingsManager.flush()` at durability boundaries and report `drainErrors()` in the app layer.

## Completion

An integration is complete when runtime ownership, resource determinism, auth deadlines, tool exposure, queue semantics, session replacement, persistence, and cleanup have executable coverage.
