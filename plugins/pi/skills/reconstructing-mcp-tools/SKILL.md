---
name: reconstructing-mcp-tools
description: Reconstructs focused MCP capabilities as small, tested Pi tool definitions. Use when an MCP server exposes too many tools, when wrapping selected MCP calls for an SDK harness, or when replacing an MCP dependency with native code and recorded fixtures.
metadata:
  version: "0.1.0"
---

# Reconstructing MCP Tools

Reduce surface before writing code: select the capability, not the server.

## Workflow

1. Read `references/reconstruction.md`, discover servers, and inspect the target schema. **Complete when:** inputs, outputs, transport, auth, state, and side effects are recorded.
2. Exercise representative live calls and select at most the task-critical operations. **Complete when:** every selected operation has a concrete user branch and unused tools are excluded.
3. Choose thin runtime wrap, generated typed client, or native reconstruction. **Complete when:** runtime coupling and drift policy are explicit.
4. Record sanitized fixtures and define the Pi schema/details contract. **Complete when:** success, expected failure, and edge behavior are reproducible offline.
5. Implement as SDK `customTools` and run direct `execute()` tests. **Complete when:** no live MCP process is needed for the unit loop.
6. Smoke against the live server, compare fixture behavior, and document refresh steps. **Complete when:** observed output matches the contract and schema drift has a named check.

## Guardrails

- Preserve OAuth and secrets in the MCP/client environment; never copy them into tools or fixtures.
- Stateful sessions may need a bridge; reconstruct stateless hot paths first.
- Generated clients and recordings are external input and require validation.
- Extension-based registration and MCP bridge extensions are out of scope.

## References

- `references/reconstruction.md` — discovery, three patterns, fixtures, and drift control
