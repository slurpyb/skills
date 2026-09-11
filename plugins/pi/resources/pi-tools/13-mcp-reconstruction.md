# Reconstructing MCP servers into pi tools (mcporter & friends)

There's a tempting-but-wrong way to give a pi harness access to an MCP server: bolt the whole server on and let all its tools sit in context. A server like [`ahujasid/blender-mcp`](https://github.com/ahujasid/blender-mcp) or [`dreamrec/LivePilot`](https://github.com/dreamrec/LivePilot) (465 Ableton tools across 56 domains) will flood the model with dozens of tool schemas it mostly won't use, burn context, and slow every turn.

The better way — and the one this harness is built around — is **reconstruction**: discover what a server exposes, take only the two or three tools you actually need, and rebuild them as native pi tools (`defineTool`, see [02-anatomy.md](02-anatomy.md)). This is the "pull your assets in, get the thing done, pull them out" model applied to MCP. The reconstructed tool can keep talking to the live server, or — at the far end — replace it entirely with native code and recorded fixtures so the dependency disappears.

[**mcporter**](https://github.com/steipete/mcporter) is the tool that makes the front of that pipeline cheap. It's a TypeScript runtime, CLI, and codegen toolkit for MCP, explicitly built around Anthropic's "code execution with MCP" guidance — discover configured servers, call them directly, generate typed clients or standalone CLIs. This page is the workflow from a running MCP server to a clean pi tool, with mcporter doing the introspection and the siblings filling the gaps.

> The examples here use deliberately odd servers — Blender, Ableton, Minecraft, Keynote, macOS automation — to keep the *technique* in focus and avoid leaning on any one domain. The same steps apply to any MCP server.

## The cast

| Tool | What it does | Direction |
|---|---|---|
| [**mcporter**](https://github.com/steipete/mcporter) | Discover / call / type / CLI-ify / record any MCP server | MCP → code |
| [FastMCP client CLI](https://gofastmcp.com/cli/client) | `fastmcp` acting as a client: list & call any server | MCP → calls |
| [MCP Inspector](https://github.com/modelcontextprotocol/inspector) | Visual + CLI inspector for a server's surface | MCP → inspection |
| [mcp-proxy](https://github.com/punkpeye/mcp-proxy) | Bridge stdio ↔ SSE/HTTP transports | MCP → MCP |
| [openapi-mcp-generator](https://github.com/harsha-iiiv/openapi-mcp-generator) | Generate an MCP *server* from an OpenAPI spec | OpenAPI → MCP |

mcporter is the workhorse for reconstruction; the rest are situational and covered at the end.

## mcporter in five commands

Install-free via `npx`, or `npm i -g mcporter` / `brew install steipete/tap/mcporter`. It auto-discovers servers already configured in Cursor, Claude, Codex, Windsurf, VS Code, etc., and merges `~/.mcporter/mcporter.json[c]` and `./config/mcporter.json`.

**1. Discover** — what servers exist:

```bash
npx mcporter list
```

**2. Inspect one server** — prints a TypeScript-style header you can read at a glance:

```bash
npx mcporter list blender --schema
```

For an ad-hoc server not in any config, point at it inline (stdio or HTTP):

```bash
npx mcporter list --stdio "uvx blender-mcp" --name blender
npx mcporter list --http-url https://mcp.example.com/mcp --name remote
```

A single-server listing reads like a `.d.ts` — exactly the shape you'll mirror in a pi tool:

```ts
blender - Blender MCP; scene creation, modifiers, rendering.
  /**
   * Create a primitive object in the current scene.
   * @param type One of: CUBE, SPHERE, CYLINDER, CONE
   * @param location [x, y, z] world coordinates
   */
  function create_object(type: string, location?: number[]);
```

**3. Call a tool** — verify behavior before you wrap it. Several call syntaxes; the function-call form mirrors the signature above:

```bash
npx mcporter call 'blender.create_object(type: "CUBE", location: [0,0,0])'
npx mcporter call minecraft.dig_block x=10 y=64 z=-3      # flag form
npx mcporter call keynote.create_slide --json            # structured output
```

**4. Emit a typed client** — `emit-ts` turns the server's schema into `.d.ts` types or a runnable client wrapper, reusing the same signatures `list` shows:

```bash
npx mcporter emit-ts blender --out types/blender-tools.d.ts          # types only
npx mcporter emit-ts blender --mode client --out clients/blender.ts  # client + types
```

**5. Record / replay** — capture real traffic as NDJSON, then serve it back deterministically. This is the key to offline tests (and to full reconstruction):

```bash
npx mcporter record blender > fixtures/blender.ndjson   # capture a live session
npx mcporter replay fixtures/blender.ndjson             # serve the same responses
```

Two more worth knowing: `generate-cli` mints a standalone CLI binary from a server (`mcporter generate-cli --command "uvx blender-mcp"`), and `inspect-cli` reads the regeneration metadata embedded in a generated CLI.

## The reconstruction workflow

```
discover ──► inspect ──► pick the 2–3 tools you need ──► reconstruct as defineTool ──► test ──► load
 (list)     (list --schema)        (you)                  (one of 3 patterns)      (page 09)  (pi -e)
```

The judgment call is the middle: a server may expose 50 tools; your task needs three. Reconstruct only those. Everything downstream is cheaper for it.

There are three reconstruction patterns, in increasing order of independence from the original server.

### Pattern A — thin runtime wrap (fastest, still depends on the server)

Wrap mcporter's library API inside a `defineTool`. The pi tool stays a thin shell; mcporter handles discovery, transport, OAuth, and pooling. Good when the server is local/stable and you just want it as one focused pi tool.

```ts
// src/blender-cube.ts
import { defineTool, type ExtensionAPI } from "@earendil-works/pi-coding-agent";
import { Type, type Static } from "typebox";
import { callOnce } from "mcporter";

const Params = Type.Object({
  type: Type.Union([Type.Literal("CUBE"), Type.Literal("SPHERE"), Type.Literal("CYLINDER")], {
    description: "Primitive to create.",
  }),
  location: Type.Optional(Type.Array(Type.Number(), { description: "[x,y,z] world coords." })),
});
type Params = Static<typeof Params>;

export const blenderCreate = defineTool<typeof Params, { type: string }>({
  name: "blender_create_object",
  label: "Blender: create object",
  description: "Create a primitive in the current Blender scene. Use when building geometry.",
  parameters: Params,
  async execute(_id, params: Params) {
    const r = await callOnce({
      server: "blender",
      toolName: "create_object",
      args: { type: params.type, location: params.location ?? [0, 0, 0] },
    });
    return { content: [{ type: "text", text: JSON.stringify(r) }], details: { type: params.type } };
  },
});

export default (pi: ExtensionAPI) => pi.registerTool(blenderCreate);
```

`callOnce` discovers the server, handles OAuth, runs the call, and closes the transport. For several calls, use `createRuntime()` (connection pooling) + `createServerProxy()` (ergonomic camelCase methods, `CallResult` with `.text()`/`.json()`/`.markdown()`/`.images()`/`.raw`):

```ts
import { createRuntime, createServerProxy } from "mcporter";

const runtime = await createRuntime();
const ableton = createServerProxy(runtime, "ableton");
const result = await ableton.createMidiClip({ track: 0, length: 4 }); // → create_midi_clip
const data = result.json();
await runtime.close();
```

Add `mcporter` to the `tools/` workspace deps to make this typecheck (see [10-loading-and-distribution.md](10-loading-and-distribution.md)).

**Cost:** the pi harness now depends on mcporter at runtime and the MCP server must be reachable when the tool runs.

### Pattern B — typed client, then wrap (typed, still needs the server live)

Run `emit-ts --mode client` once to generate a typed proxy, commit it, and have your `defineTool` import that instead of calling the runtime untyped. You get full TypeScript types on the server's tools, and your tool code reads against a real interface.

```bash
npx mcporter emit-ts minecraft --mode client --out tools/src/generated/minecraft.ts
```

```ts
// src/minecraft-dig.ts
import { defineTool, type ExtensionAPI } from "@earendil-works/pi-coding-agent";
import { Type, type Static } from "typebox";
import { createMinecraftClient } from "./generated/minecraft.ts"; // emitted by mcporter

const Params = Type.Object({
  x: Type.Integer(), y: Type.Integer(), z: Type.Integer(),
});
type Params = Static<typeof Params>;

export const dig = defineTool<typeof Params, { dug: boolean }>({
  name: "minecraft_dig_block",
  label: "Minecraft: dig block",
  description: "Dig the block at the given coordinates. Use when clearing or mining.",
  parameters: Params,
  async execute(_id, p: Params) {
    const mc = await createMinecraftClient();
    await mc.digBlock({ x: p.x, y: p.y, z: p.z });
    return { content: [{ type: "text", text: `Dug ${p.x},${p.y},${p.z}.` }], details: { dug: true } };
  },
});

export default (pi: ExtensionAPI) => pi.registerTool(dig);
```

Regenerate the client whenever the server's schema changes; the emitted headers stay in sync with what `mcporter list` shows. **Cost:** same runtime dependency as A, but now type-safe and reviewable in your repo.

### Pattern C — full reconstruction (the server dependency disappears)

The endgame. Use mcporter only as a *reference and fixture source*, then reimplement the behavior natively and drop MCP entirely. This fits the harness's ephemeral ethos: pull the capability in, bake exactly what you need into a self-contained pi tool, and owe nothing to the original server at runtime.

Two flavors:

1. **The "server" was a thin shell over something you can call directly.** Many MCP servers just wrap an API, a CLI, or a protocol. `keynote-mcp` and `macos-automator-mcp` ultimately run AppleScript/JXA; `minecraft-mcp-server` drives the Mineflayer API; an HTTP-API server wraps REST. Once `mcporter list --schema` and a few `mcporter call`s have shown you the exact inputs/outputs, reimplement that one operation natively in `execute` (via `pi.exec` for a CLI/AppleScript, `fetch` for an API) and skip the MCP layer:

```ts
// Keynote "next slide" reconstructed natively — no MCP server at runtime.
async execute(_id, _params, signal, _onUpdate, ctx) {
  await pi.exec("osascript", ["-e", 'tell application "Keynote" to show next'], { cwd: ctx.cwd, signal });
  return { content: [{ type: "text", text: "Advanced to next slide." }], details: { ok: true } };
}
```

2. **The server's logic is non-trivial, but its responses are stable.** Record real traffic and pin it as test fixtures, then reconstruct against those fixtures so your tests never need the live server:

```bash
npx mcporter record blender > tools/fixtures/blender.ndjson
```

Your `defineTool` tests (using the harness from [09-testing.md](09-testing.md)) read the recorded responses instead of standing up Blender. `mcporter replay fixtures/blender.ndjson` can also serve them to a Pattern-A/B tool during integration tests — deterministic, offline, redactable.

**Cost:** the most upfront work; the most durable result. No runtime dependency, fully testable offline, exactly the surface you need and nothing more.

### Choosing a pattern

- Prototyping, server is local and stable → **A**.
- You'll maintain the tool and want types/review → **B**.
- The capability is core, you want zero runtime coupling and offline tests → **C**.

A common path is A → B → C as a tool earns its keep: start thin, add types, then fully reconstruct the two tools that turned out to matter.

## Record/replay ↔ the test harness

This is where mcporter and the `tools/` workspace meet. The harness ([09-testing.md](09-testing.md)) calls a tool's `execute()` directly with fakes; if that tool talks to an MCP server, point it at a replayed fixture instead of the live server:

```ts
// integration test: tool under replay, no live Blender
import { runTool } from "./harness.ts";
import { blenderCreate } from "../src/blender-cube.ts";
// start `mcporter replay fixtures/blender.ndjson` as a fixture server in setup,
// or stub callOnce to read fixtures/blender.ndjson directly.

test("create_object returns a mesh id", async () => {
  const { result } = await runTool(blenderCreate, { type: "CUBE" });
  expect(result.details.type).toBe("CUBE");
});
```

Recorded fixtures keep the tight loop tight: no daemon, no Chrome tab, no Blender process — just NDJSON the test feeds in. For a Pattern-C reconstruction, the fixtures are also your spec: they document exactly what the original server returned for each input.

## Keeping MCP but taming it: `serve` / bridges

If you genuinely want several servers available but namespaced and warm, mcporter's bridge mode collapses daemon-managed keep-alive servers into one MCP endpoint with readable `server__tool` names:

```bash
mcporter serve --stdio --servers blender,ableton    # one stdio bridge
mcporter serve --http 8900                            # Streamable HTTP at /mcp
```

This is the *opposite* of reconstruction — you keep the MCP layer — but it's the right call when the server is stateful and expensive to re-establish (a live Blender scene, an Ableton set, a Chrome session). Pair it with tool filtering (`allowedTools`/`blockedTools` in `mcporter.json`) to trim the surface even while keeping the bridge. Reconstruct the hot path; bridge the rest.

## Similar tools, and when to reach for them

- **[FastMCP client CLI](https://gofastmcp.com/cli/client)** — if the server you're reconstructing is itself a FastMCP (Python) server, `fastmcp` can act as a client to list and call it. Overlaps with `mcporter list`/`call`; use whichever is already in hand. FastMCP's strength is the *server* side, so it's handy when you're also authoring the server you intend to reconstruct.
- **[MCP Inspector](https://github.com/modelcontextprotocol/inspector)** — the official visual tool. Best for *understanding* an unfamiliar server interactively (clicking through tools, watching JSON-RPC) before you commit to reconstructing. It also has a CLI and can export launch configs. Use it for the inspect step when a server's schema alone isn't enough to understand behavior.
- **[mcp-proxy](https://github.com/punkpeye/mcp-proxy)** — a transport bridge (stdio ↔ SSE/HTTP). Reach for it when the server only speaks a transport your tooling can't reach directly — proxy it to something mcporter can attach to, then reconstruct as normal.
- **[openapi-mcp-generator](https://github.com/harsha-iiiv/openapi-mcp-generator)** — the reverse direction: generate an MCP server *from* an OpenAPI spec. Relevant when the thing you want isn't an MCP server yet but has an OpenAPI definition. Often, though, if you already have the OpenAPI spec, Pattern C says skip MCP entirely and `fetch` the API straight from your pi tool.
- **`mcp-client-gen`-style client generators** — several registries list type-safe TypeScript client generators for MCP servers; they occupy the same niche as `mcporter emit-ts`. If one fits your build better, the Pattern-B workflow is identical — generate a typed client, wrap it in `defineTool`.

## Pitfalls

- **Don't reconstruct the whole server.** The entire point is to take the 2–3 tools your task needs. Mirroring all 50 tools just rebuilds the context-flooding problem in a new place.
- **Stateful servers don't reconstruct cleanly to Pattern C.** A server holding a live session (Blender scene, Ableton set, Chrome tab) isn't a pure function of its inputs. Bridge/keep-alive those (`mcporter serve`, `lifecycle: keep-alive`); reconstruct only the stateless operations.
- **Re-emit on schema drift.** Pattern B's generated client and Pattern C's fixtures go stale when the upstream server changes. Re-run `emit-ts` / `record` and diff. A stale typed client that compiles but lies is worse than an untyped call.
- **OAuth and secrets stay out of the tool.** mcporter resolves `${ENV}` / `$env:VAR` lazily and caches OAuth in its own vault. Don't bake tokens into a reconstructed tool — read from env at call time, same as the MCP server did.
- **Coercion surprises in `mcporter call`.** The CLI coerces numeric/bool/JSON-looking args by default; pass `--raw-strings` / `--no-coerce` when verifying a tool whose inputs are stringly-typed, so what you test matches what you'll wrap.
- **Validate replayed/loaded data at the boundary.** Recorded NDJSON and emitted clients are external input — validate before trusting, per the boundary rule in [12-patterns-and-pitfalls.md](12-patterns-and-pitfalls.md).

## The throughline

mcporter collapses the expensive part of reconstruction — discovering and characterizing a server — into a few commands, and `record`/`replay` + `emit-ts` give you the fixtures and types to rebuild cleanly. The harness's job is then to express that capability as the smallest honest `defineTool`, tested offline. Pull in, reconstruct what matters, pull out.
