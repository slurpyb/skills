# Loading, resolving deps, and distribution

How an extension file goes from "on disk" to "the agent can call it", and how to make types and `tsc` resolve cleanly while you build.

## Loading an extension

### Ad-hoc: the `-e` flag

```bash
pi -e ./mytool.ts
pi -e ./tokens.ts -e ./astro-check.ts      # repeatable
```

`-e` (alias `--extension`) takes a path and loads that extension for the session. Pass it multiple times for multiple files. This is the loop you use while developing — point pi at the file you're working on.

Disable all extensions for a run with `-ne` / `--no-extensions`.

### Discovery: the tools directory

pi discovers extensions automatically from its agent directory and project-local config:

- **User-global:** `~/.pi/agent/tools/` — drop an extension here and it loads for every session.
- **Project-local:** a `.pi/` directory in the project (the config dir name is `.pi`).

Use `-e` while iterating; move a finished extension into the discovery directory when you want it always-on.

### `pi install`

```bash
pi install <source>        # add an extension source to settings
pi remove <source>
```

`install` registers an extension source persistently (with `-l` for local). This is the distribution path once a tool is stable and you want it managed rather than passed via `-e` each time.

## Making imports and typecheck resolve

Here's the wrinkle. pi's runtime resolves `@earendil-works/pi-coding-agent` and `typebox` from **its own** installation — typebox actually lives *nested* inside pi's `node_modules`. So a bare `mytool.ts` sitting in an empty directory will *run* under `pi -e` but your editor and `tsc` will report `Cannot find module`.

To get real types, autocomplete, and a clean `tsc` while developing, give your tools a small local workspace that has those packages installed. That's exactly what the `tools/` workspace in this repo is for.

### Minimal workspace

`tools/package.json`:

```json
{
  "name": "pi-tools",
  "private": true,
  "type": "module",
  "devDependencies": {
    "@earendil-works/pi-coding-agent": "^0.79.8",
    "typebox": "*",
    "vitest": "^4",
    "typescript": "^5"
  },
  "scripts": {
    "test": "vitest run",
    "test:watch": "vitest --watch",
    "typecheck": "tsc --noEmit",
    "typecheck:watch": "tsc --noEmit --watch"
  }
}
```

Install with `bun install` (this repo uses bun). `typebox` is declared directly so your `import { Type } from "typebox"` resolves to a real package at the workspace root, matching what pi uses at runtime.

`tools/tsconfig.json`:

```json
{
  "compilerOptions": {
    "target": "es2022",
    "module": "esnext",
    "moduleResolution": "bundler",
    "strict": true,
    "skipLibCheck": true,
    "noEmit": true,
    "allowImportingTsExtensions": true,
    "verbatimModuleSyntax": true,
    "types": []
  },
  "include": ["src/**/*.ts", "test/**/*.ts"]
}
```

Two settings matter:

- **`allowImportingTsExtensions: true`** — lets you write `import { x } from "./impl.ts"` with the explicit `.ts` extension. You want explicit extensions because the files are executed as native TypeScript/ESM (Node's type-stripping, or pi's loader), and ESM requires extensions at runtime. (This is the same fix already applied in `mcp/tsconfig.json` for the MCP server.)
- **`moduleResolution: "bundler"`** — resolves the nested-dependency layout without fighting you over `package.json` `exports`.

### Why explicit `.ts` extensions

When a file is run as real ESM (not bundled), `import "./impl"` fails with `ERR_MODULE_NOT_FOUND` — ESM doesn't guess extensions. Write `import "./impl.ts"`. `allowImportingTsExtensions` makes `tsc` accept it. This bit the MCP server earlier; don't relearn it.

## File layout convention

```
tools/
  package.json
  tsconfig.json
  src/
    wordcount.ts        # one extension per file (default export factory)
    tokens.ts
    impl/               # shared, testable logic (no pi imports if you can help it)
  test/
    harness.ts          # runTool() + makeFakeCtx()
    wordcount.test.ts
  fixtures/             # sample inputs for tests
```

Keeping the *logic* in `impl/` modules that don't import pi makes it trivially unit-testable; the extension file is then a thin factory that imports the logic and registers it. The harness tests the `execute` path; plain unit tests can hit `impl/` directly.

## Dev vs. distribute, side by side

| Stage | Command | What it's for |
|---|---|---|
| Build/iterate | `bun run test:watch` + `bun run typecheck:watch` | sub-second logic feedback, no pi |
| Smoke in pi | `pi -e ./src/tokens.ts` | confirm the model calls it, tune `description` |
| Always-on (you) | move to `~/.pi/agent/tools/` or project `.pi/` | discovery loads it every session |
| Ship | `pi install <source>` | managed, persistent install |

Work left of the table while building; move right only when the tool is proven.
