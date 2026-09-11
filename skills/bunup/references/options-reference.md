# Options reference

Exhaustive example bank — every option as config + CLI. Common ones are in SKILL.md; this adds the rest plus edge cases.

## env — replace process.env / import.meta.env at build time

```sh
FOO=bar bunup --env inline                # inline all build-time vars
bunup --env disable                       # keep process.env.X as-is
PUBLIC_URL=x bunup --env 'PUBLIC_*'        # prefix only (must end *)
bunup --env.NODE_ENV="production" --env.API_URL="https://api.example.com"
```

```ts
env: "inline"                             // "inline" | "disable" | "PUBLIC_*"
env: { API_URL: "https://api.example.com", DEBUG: "false" }
```

## jsx

```sh
bunup --jsx.runtime automatic --jsx.import-source preact
bunup --jsx.factory h --jsx.fragment Fragment --jsx.side-effects --jsx.development
```

```ts
jsx: { runtime: "automatic", importSource: "react", factory: "h", fragment: "Fragment",
       sideEffects: false, development: false }
```

Defaults: runtime `automatic`, importSource `react`, factory `React.createElement`, fragment `React.Fragment`, sideEffects `false`, development `false`.

## define — global constants

```sh
bunup --define.PACKAGE_VERSION='"1.0.0"' --define.DEBUG='false'
```

```ts
define: { PACKAGE_VERSION: '"1.0.0"', DEBUG: "false" }   // keys=identifiers, values=replacement strings
```

## banner / footer

```sh
bunup --banner 'use client' --footer '// built with love'
```

```ts
banner: '"use client";', footer: "// built with love"
```

## drop — remove function calls (+ their args)

```sh
bunup --drop console,debugger
```

```ts
drop: ['console', 'debugger', 'anyIdentifier.or.propertyAccess'];
```

## conditions — package.json export conditions

```sh
bunup --conditions development,node
```

```ts
conditions: ['development', 'node'];
```

## dead code elimination

```sh
bunup --ignore-dce-annotations           # ignore @__PURE__ + sideEffects
bunup --emit-dce-annotations             # force-emit @__PURE__ even when minifying
```

```ts
ignoreDCEAnnotations: true;
emitDCEAnnotations: true;
```

## loader — file extension → loader

```sh
bunup --loader.'.css'=text --loader.'.txt'=file
```

```ts
loader: { ".css": "text", ".txt": "file" }
```

## publicPath — prefix asset/external/chunk imports (CDN)

```sh
bunup --public-path https://cdn.example.com/
```

```ts
publicPath: 'https://cdn.example.com/';
// import logo from "./logo.svg"  →  "https://cdn.example.com/logo-a7305bdef.svg"
```

## sourceBase — base dir controlling output structure & export keys

```sh
bunup 'src/**/*.ts' --source-base ./src
```

```ts
sourceBase: './src'; // strips ./src/ from output paths & export keys
sourceBase: '.'; // keep full src/ structure
// unset → lowest common ancestor of entries
```

## shims — Node globals / ESM↔CJS interop

```sh
bunup --shims
```

```ts
shims: true;
// CJS: import.meta.url → pathToFileURL(__filename).href
// ESM: __dirname/__filename → dirname(fileURLToPath(import.meta.url))
```

## report — build size report

```sh
bunup --report.brotli                     # gzip on by default
bunup --no-report.gzip
bunup --report.max-bundle-size 1048576    # warn over N bytes
```

```ts
report: { gzip: true, brotli: false, maxBundleSize: 1024 * 1024 }
```

## preferredTsconfig — custom tsconfig for resolution + dts

```sh
bunup --preferred-tsconfig ./tsconfig.build.json
```

```ts
preferredTsconfig: './tsconfig.build.json'; // default: nearest tsconfig.json
```

## onSuccess — post-build (runs after each rebuild in watch)

```sh
bunup --on-success "bun run ./scripts/server.ts"   # CLI = string form only
```

```ts
onSuccess: "bun run ./scripts/server.ts"
onSuccess: (options) => { const s = startServer(); return () => s.close(); }   // fn; return cleanup for watch
onSuccess: { cmd: "bun run ./scripts/server.ts",
             options: { cwd: "./app", env: { ...process.env, FOO: "bar" }, timeout: 30000, killSignal: "SIGKILL" } }
```

Function + advanced-object forms are config-file only.

## dts — full set

```sh
bunup --dts.splitting --dts.minify
bunup --dts.resolve react,lodash          # bare --dts.resolve = all
bunup --dts.infer-types --dts.tsgo        # tsc path; tsgo ~10x (needs @typescript/native-preview)
bunup --dts.entry "src/public/**/*.ts,!src/public/dev/**/*"
bunup --dts-only                          # only .d.ts
bunup --no-dts                            # disable
```

```ts
dts: {
  splitting: true,                        // shared types → chunks, no dup across entries
  minify: true,                           // shorten internal names, strip comments; public API kept
  inferTypes: true,                       // use tsc instead of isolated decls (complex generics)
  tsgo: true,                             // native compiler; needs inferTypes
  resolve: ["react", "lodash", /^@types\//],
  entry: ["src/public/**/*.ts", "!src/public/dev/**/*"],
}
dtsOnly: true
dts: false
```

```ts
// dts.minify keeps public names via `as`:
// before: export { fetchData, Response, DeepPartial }
// after:  export { n as fetchData, t as Response, e as DeepPartial }
```

## exports — full set

```sh
bunup --exports
bunup --exports.exclude=./internal,./private/*
bunup --no-exports.exclude-cli            # include CLI entries (default excluded)
bunup --exports.exclude-css
bunup --no-exports.include-package-json
bunup --exports.all                       # adds "./*": "./*"
```

```ts
exports: {
  exclude: ["./internal", "./private/*"],           // or (ctx) => string[]
  excludeCli: true,                                 // default true (cli/bin globs)
  excludeCss: false,
  includePackageJson: true,                         // adds "./package.json": "./package.json"
  all: false,                                        // true exposes every published file
  customExports: (ctx) => ({ "./package.json": "./package.json" }),
}
```

Generated example:

```json
{
	"exports": {
		".": {
			"import": { "types": "./dist/index.d.ts", "default": "./dist/index.js" },
			"require": { "types": "./dist/index.d.cts", "default": "./dist/index.cjs" }
		}
	}
}
```
