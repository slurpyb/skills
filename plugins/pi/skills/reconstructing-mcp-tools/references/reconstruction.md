# MCP reconstruction

## Funnel

```text
discover -> inspect -> call -> select 2–3 operations -> reconstruct -> replay-test -> live-smoke
```

With mcporter, typical discovery commands are:

```bash
npx mcporter list
npx mcporter list <server> --schema
npx mcporter call '<server>.<tool>(key: "value")'
```

Use `--raw-strings` or `--no-coerce` when stringly inputs could be changed by CLI coercion.

## Patterns

### A — runtime wrap

Call through mcporter at runtime. Fastest and retains transport/OAuth handling, but requires mcporter and a reachable server.

### B — generated client

Generate and commit a typed client with `mcporter emit-ts <server> --mode client --out <file>`. Reviewable and typed, but still live-server dependent. Regenerate on schema drift.

### C — native reconstruction

Use observed schema/calls as a specification, then call the underlying API, CLI, or protocol directly. Highest upfront cost and lowest runtime coupling. Prefer when the capability is stable and core.

Choose the least independent pattern that satisfies reliability. Migration A → B → C is valid as usage proves value.

## Fixtures

Record real traffic with `mcporter record <server>` and sanitize credentials, personal data, unstable ids, and absolute paths before commit. Replay or inject recordings in integration tests. Validate NDJSON before trust. Keep fixture provenance: server version/commit, capture date, selected call, expected normalization, and refresh command.

Stateful systems such as a live browser, DAW, or 3D scene may not replay as pure functions. Keep their stateful transport bridged and reconstruct only deterministic operations.

## Pi boundary

Mirror only the selected input shape in TypeBox. Do not expose a generic server/tool/args escape hatch unless generic delegation is the explicit product. Return normalized evidence in `details` and concise model-facing guidance in `content`. Pass tool definitions to SDK `customTools`; include names in any allowlist.

## Completion

Reconstruction is complete when selected scope is minimal, auth remains external, fixtures are sanitized and validated, unit tests are offline, live behavior matches normalized details, and drift regeneration is executable.
