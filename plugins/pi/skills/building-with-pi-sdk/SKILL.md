---
name: building-with-pi-sdk
description: Builds typed applications and automation around Pi sessions, resources, models, tools, and persistence. Use when embedding Pi, creating AgentSession or AgentSessionRuntime flows, composing ResourceLoader inputs, or testing harness behavior programmatically.
metadata:
  version: "0.1.0"
---

# Building with the Pi SDK

Choose the smallest runtime that owns the required lifecycle.

## Workflow

1. Classify the host as one session, replaceable sessions, or cross-language process integration. **Complete when:** `createAgentSession`, `createAgentSessionRuntime`, or RPC is selected with a reason.
2. Read `references/composition.md` and define ownership for cwd, agentDir, resources, model/auth runtime, settings, sessions, and tools. **Complete when:** every dependency has exactly one owner.
3. Start with in-memory settings/session state and a bounded tool allowlist. **Complete when:** a deterministic test can create and dispose the session without user files.
4. Add event handling, queue behavior, and abort/deadline policy. **Complete when:** streaming output, accepted/rejected prompt preflight, and shutdown are observable.
5. Add persistence or discovery only where required. **Complete when:** writes are flushed, errors drained, replacement sessions rebound, and resource diagnostics surfaced.
6. Run typecheck plus a no-network integration test, then one authenticated smoke. **Complete when:** the host reports model, tools, resources, and final outcome without leaked credentials.

## Boundaries

- `AgentSession` owns one conversation; `AgentSessionRuntime` owns replacing it.
- Event subscriptions bind to a specific session and must be rebound after replacement.
- Extensions, custom UI, and custom provider implementations are out of scope.

## References

- `references/composition.md` — session composition, resources, models, tools, and lifecycle
