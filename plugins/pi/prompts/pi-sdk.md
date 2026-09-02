---
description: Build a typed Pi SDK integration with explicit runtime ownership
argument-hint: "<integration goal> [host constraints]"
---
Use the `building-with-pi-sdk` skill.

Build the Pi SDK integration described here: $ARGUMENTS

First choose single `AgentSession`, replaceable `AgentSessionRuntime`, or RPC and justify the boundary. Make model/auth, resources, settings, sessions, tools, deadlines, events, and cleanup ownership explicit. Start with in-memory deterministic tests and keep secrets outside source and fixtures. Extension and custom-provider implementation are out of scope.

Done means typecheck passes, a no-network integration test covers lifecycle and cleanup, diagnostics are surfaced, and one bounded authenticated smoke reports the active model/tool/resource surface.
