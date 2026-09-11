# Recipes — three complete tools

Worked examples you can paste and adapt. Each is a full extension file: schema, logic, `execute`, factory. They show the patterns from the earlier pages applied to the kind of work this harness is for — web components, Panda theming, and corpus access.

These are illustrative scaffolds, not drop-in production code — adjust paths and resolution to your project. The *shapes* are what to copy.

## Recipe 1 — Panda token resolver

Resolve a Panda CSS token path to its value, and list available tokens. Panda generates a `token(path)` resolver in `styled-system/tokens/index.mjs`; this tool wraps it so the agent can ask for concrete values before writing CSS instead of guessing hex codes.

```ts
// src/tokens.ts
import { defineTool, type ExtensionAPI } from "@earendil-works/pi-coding-agent";
import { Type, type Static } from "typebox";
import { resolve } from "node:path";
import { pathToFileURL } from "node:url";

const ResolveParams = Type.Object({
  path: Type.String({ description: "Token path, e.g. 'colors.brand.500' or 'spacing.4'." }),
});
type ResolveParams = Static<typeof ResolveParams>;

async function loadResolver(cwd: string): Promise<(p: string) => string | undefined> {
  const mod = await import(pathToFileURL(resolve(cwd, "styled-system/tokens/index.mjs")).href);
  return mod.token;
}

const resolveToken = defineTool<typeof ResolveParams, { path: string; value: string | null }>({
  name: "resolve_token",
  label: "Resolve token",
  description:
    "Resolve a Panda CSS design token path to its raw value. Use before writing CSS that references a token, so you emit the real value instead of guessing.",
  promptGuidelines: ["Never hardcode a value a token already defines — resolve_token first."],
  parameters: ResolveParams,
  async execute(_id, params: ResolveParams, _signal, _onUpdate, ctx) {
    const token = await loadResolver(ctx.cwd);
    const value = token(params.path);
    if (value === undefined) {
      return {
        content: [{ type: "text", text: `No token at '${params.path}'.` }],
        details: { path: params.path, value: null },
      };
    }
    return {
      content: [{ type: "text", text: value }],
      details: { path: params.path, value },
    };
  },
});

export default (pi: ExtensionAPI) => {
  pi.registerTool(resolveToken);
};
```

Test (`test/tokens.test.ts`) points `ctx.cwd` at a fixture dir containing a tiny `styled-system/tokens/index.mjs`, and asserts on `details.value`.

## Recipe 2 — Astro typecheck

Run `astro check` (or `tsc`) and return structured diagnostics. A classic guardrail tool for the TDD loop: after editing a component, the agent runs this and sees exactly what broke. Uses `pi.exec` so the run is agent-integrated and cancellable.

```ts
// src/astro-check.ts
import { defineTool, type ExtensionAPI } from "@earendil-works/pi-coding-agent";
import { Type } from "typebox";

export default (pi: ExtensionAPI) => {
  pi.registerTool(
    defineTool<typeof Params, { ok: boolean; code: number | null }>({
      name: "astro_check",
      label: "Astro check",
      description:
        "Run `astro check` and report type/diagnostic errors for the project. Use after editing a component to verify it still typechecks.",
      parameters: Params,
      async execute(_id, _params, signal, onUpdate, ctx) {
        onUpdate?.({ content: [{ type: "text", text: "Running astro check…" }], details: { ok: false, code: null } });
        const res = await pi.exec("bunx", ["astro", "check"], { cwd: ctx.cwd, signal });
        const ok = res.code === 0;
        const out = (res.stdout || res.stderr || "").trim();
        return {
          content: [{ type: "text", text: ok ? "astro check passed." : out || "astro check failed." }],
          details: { ok, code: res.code },
        };
      },
    }),
  );
};

const Params = Type.Object({});
```

(`res` fields — `code`, `stdout`, `stderr` — come from pi's `ExecResult`. Check `code === 0` for success.) Honors `signal` by passing it to `pi.exec`, and reports progress via `onUpdate` since a check can take a few seconds.

## Recipe 3 — Corpus query (wrapping the MCP logic)

The `mcp/` server in this repo already exposes generic corpus tools (`search`, `get`, …) over a manifest. You can expose the same capability as a *native pi tool* so the agent reads the corpus inline, no MCP transport hop. This reuses `mcp/src/tools.ts` directly.

```ts
// src/corpus.ts
import { defineTool, type ExtensionAPI } from "@earendil-works/pi-coding-agent";
import { Type, type Static } from "typebox";
import { readFile } from "node:fs/promises";
import { resolve } from "node:path";
import { searchTool, getTool } from "../../mcp/src/tools.ts";
import type { Manifest } from "../../mcp/src/types.ts";

const QueryParams = Type.Object({
  action: Type.Union([Type.Literal("search"), Type.Literal("get")], {
    description: "search = ranked keyword search; get = fetch one entry by slug.",
  }),
  query: Type.Optional(Type.String({ description: "Search query (action=search)." })),
  slug: Type.Optional(Type.String({ description: "Entry slug (action=get)." })),
  limit: Type.Optional(Type.Integer({ default: 5, minimum: 1, maximum: 25 })),
});
type QueryParams = Static<typeof QueryParams>;

async function loadManifest(cwd: string): Promise<Manifest> {
  const raw = await readFile(resolve(cwd, "mcp/data/manifest.json"), "utf8");
  return JSON.parse(raw) as Manifest;
}

const corpus = defineTool<typeof QueryParams, { action: string }>({
  name: "corpus",
  label: "Corpus",
  description:
    "Query the project corpus: search across entries or fetch one by slug. Use to ground answers in the project's own content instead of guessing.",
  parameters: QueryParams,
  async execute(_id, params: QueryParams, _signal, _onUpdate, ctx) {
    const manifest = await loadManifest(ctx.cwd);
    const r =
      params.action === "get"
        ? getTool(manifest, { slug: params.slug ?? "" })
        : searchTool(manifest, { query: params.query ?? "", limit: params.limit ?? 5 });
    return { content: r.content, details: { action: params.action } };
  },
});

export default (pi: ExtensionAPI) => {
  pi.registerTool(corpus);
};
```

This is the payoff of the shared lineage: the MCP tools return the same `{ content, ... }` shape, so wrapping them as a pi tool is mostly plumbing. The corpus stays domain-agnostic — config, docs, or poetry — because the underlying tools are.

## Common thread

All three: a named schema with `Static`, a thin factory, logic that resolves paths against `ctx.cwd`, `details` carrying the machine-readable result, and `content` written for the model. Test each by calling `execute` against a fixture cwd (see [09-testing.md](09-testing.md)) before ever loading it into pi.
