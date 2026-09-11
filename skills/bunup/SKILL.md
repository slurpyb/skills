---
name: bunup
description: Build or configure a TypeScript/React library with bunup, the Bun-native bundler Use when the task names bunup — "set up bunup", "write bunup.config.ts", "which bunup flag", "bundle my TS library", "generate .d.ts", "ESM+CJS output", "monorepo workspaces", "compile CLI to executable", or writing a bunup plugin. Covers CLI flags, config options, dts, CSS, exports, workspaces, compile.
---

# bunup

Bun-native bundler for TS/React libraries. Every feature below shown as a copy-paste example. Requires Bun. Docs v0.16.x. Full option-by-option bank → `references/options-reference.md`; plugin bank → `references/plugins.md`.

## Install & run

```sh
bun add --dev bunup
bunx bunup                       # zero-config → dist/ (ESM + .d.ts)
bunx bunup --format esm,cjs
bunx bunup --watch               # rebuild on change
bunx @bunup/cli@latest create    # scaffold TS / React lib / minimal
```

```json
{ "scripts": { "build": "bunup", "dev": "bunup --watch" } }
```

Zero-config auto-detects entries: `index.ts(x)`, `src/index.ts(x)`, `cli.ts`, `src/cli.ts`, `src/cli/index.ts`.

## Config file

```ts
import { defineConfig } from 'bunup';
export default defineConfig({ entry: 'src/index.ts', format: ['esm', 'cjs'], dts: true });
```

```ts
// array → multi-target; `name` REQUIRED per item
export default defineConfig([
	{ name: 'main', entry: 'src/index.ts', format: ['esm', 'cjs'] },
	{ name: 'cli', entry: 'src/cli.ts', format: ['esm'] },
]);
```

```sh
bunup --filter main,browser              # build subset of the array
bunup -c ./configs/x.bunup.config.ts     # custom config path
bunup --no-config                        # ignore config file
```

## Entry points

```sh
bunup src/index.ts                       # single
bunup src/index.ts src/cli.ts            # multiple
bunup -e src/index.ts -e src/cli.ts      # via flag
bunup 'src/**/*.ts' '!src/**/*.test.ts'  # globs, ! excludes
```

```ts
entry: 'src/index.ts';
entry: ['src/index.ts', 'src/cli.ts'];
entry: ['src/**/*.ts', '!src/**/*.test.ts'];
```

## Output

```sh
bunup -o build                  # outDir (default dist)
bunup -f esm                    # one format (default esm)
bunup -f esm,cjs,iife           # multiple
```

```ts
outDir: "build", format: ["esm", "cjs", "iife"]
```

Extensions by `package.json` `"type"`:

| Format | type:module       | type:commonjs / unset |
| ------ | ----------------- | --------------------- |
| esm    | `.js` / `.d.ts`   | `.mjs` / `.d.mts`     |
| cjs    | `.cjs` / `.d.cts` | `.js` / `.d.ts`       |
| iife   | `.global.js`      | `.global.js`          |

## Dependencies

`dependencies` + `peerDependencies` excluded; `devDependencies` bundled if imported.

```sh
bunup --external lodash,react            # force external
bunup --no-external lodash               # force bundle
bunup --packages external                # global default: external|bundle
```

```ts
external: ['lodash', /^@my-org\//]; // name or regex
noExternal: ['lodash'];
packages: 'external';
```

## Target

```sh
bunup -t node                            # node (default) | browser | bun
```

```ts
target: 'browser';
```

Bun shebang `#!/usr/bin/env bun` → `bun` target auto (adds `// @bun`).

## Minify

```sh
bunup --minify                           # all three
bunup --minify-whitespace --minify-syntax
```

```ts
minify: true
// or granular (overrides minify):
minifyWhitespace: true, minifyIdentifiers: false, minifySyntax: true
```

## Source maps

```sh
bunup --sourcemap                        # inline
bunup --sourcemap linked                 # none|linked|external|inline
```

```ts
sourcemap: 'linked'; // or true === inline
```

## Watch / clean / silent

```sh
bunup --watch
bunup --no-clean                         # default cleans outDir
bunup -q                                 # silent (CI)
```

```ts
watch: true, clean: false, silent: true
```

## Tree shaking & splitting

Tree-shaking always on. Splitting: on for esm, off for cjs/iife.

```sh
bunup --splitting
bunup --no-splitting
```

```ts
splitting: true;
```

## TypeScript declarations

Recommended: isolated declarations (instant). tsconfig:

```json
{ "compilerOptions": { "declaration": true, "isolatedDeclarations": true } }
```

```sh
bunup --dts.splitting                    # extract shared types into chunks
bunup --dts.minify                       # shorten internal type names
bunup --dts.resolve react,lodash         # bundle external types
bunup --dts.infer-types                  # use tsc instead of isolated decls (complex generics)
bunup --dts.infer-types --dts.tsgo       # ~10x faster (needs @typescript/native-preview)
bunup --dts-only                         # only .d.ts, skip JS
bunup --no-dts                           # disable
```

```ts
dts: { splitting: true, minify: true, resolve: ["react", /^@types\//], entry: ["src/index.ts"] }
dtsOnly: true
dts: false
```

## CSS

```ts
// import CSS in TS → bundled to dist/index.css (cross-browser auto)
import './styles.css';
```

```ts
// emit a CSS file separately → add as entry
entry: ['src/index.ts', 'src/components/button.css'];
```

```ts
// CSS modules: name file *.module.css → auto .d.ts for class names
import styles from "./button.module.css";
<button className={styles.primary} />
```

```css
/* share styles */
.primary {
	composes: base;
}
.x {
	composes: base from '../shared.module.css';
}
```

```sh
bunup --no-css.typed-modules             # disable CSS-module .d.ts
bunup --css.inject                       # inline CSS into JS (no separate import for consumers)
bunup --css.inject.minify=false
```

```ts
css: { typedModules: false, inject: { minify: false, inject: (css, filePath) => `/* custom inject JS */` } }
```

gitignore generated module types: `**/*.module.*.d.ts`. Distribute: `"./styles.css": "./dist/index.css"` in exports.

## Plugins

```ts
import { copy } from 'bunup/plugins';
import { tailwindcss } from '@bunup/plugin-tailwindcss';
export default defineConfig({ plugins: [tailwindcss(), copy(['README.md', 'assets/**/*'])] });
```

copy / tailwindcss / react-compiler examples + authoring (`onBuildStart`/`onBuildDone`) → `references/plugins.md`.

## Auto exports

```sh
bunup --exports                          # keep package.json exports in sync each build
bunup --exports.exclude=./internal,./private/*
bunup --no-exports.exclude-cli           # include CLI entries (default excluded)
bunup --exports.exclude-css
bunup --exports.all                      # adds "./*": "./*"
```

```ts
exports: true
exports: {
  exclude: ["./internal", "./private/*"],
  excludeCli: true, excludeCss: false, includePackageJson: true, all: false,
  customExports: (ctx) => ({ "./package.json": "./package.json" }),
}
```

Export keys mirror output paths → set `sourceBase: "./src"` to strip a `./src/` prefix.

## Workspaces (monorepo)

```ts
import { defineWorkspace } from 'bunup';
export default defineWorkspace(
	[
		{ name: 'core', root: 'packages/core', config: { format: ['esm', 'cjs'] } },
		{ name: 'utils', root: 'packages/utils' },
	], // no config → ESM-only defaults
	{ format: ['esm', 'cjs'], exports: true }, // shared options (2nd arg)
);
```

```sh
bunx bunup                               # build all (incremental)
bunx bunup --filter core,utils
bunx bunup --filter core --watch
```

Paths (incl. plugin paths) resolve relative to each package `root`.

## Compile to executable

Default outDir `bin/`. One entry per compile.

```ts
defineConfig({ entry: 'src/cli.ts', compile: true }); // current platform
defineConfig({ entry: 'src/cli.ts', compile: 'bun-linux-x64' }); // cross-compile
defineConfig({
	entry: 'src/cli.ts',
	compile: {
		target: 'bun-windows-x64',
		outfile: './bin/app.exe',
		windows: { hideConsole: true, icon: './icon.ico' },
	},
});
```

```ts
// multiple targets / mix library + executable → config array with names
export default defineConfig([
	{ name: 'library', entry: 'src/index.ts', format: ['esm', 'cjs'], dts: true },
	{ name: 'cli', entry: 'src/cli.ts', compile: true },
]);
```

## Programmatic (Bun runtime only)

```ts
import { build, type BuildOptions } from 'bunup';
const res = await build({ entry: 'src/index.ts', format: ['esm', 'cjs'] }, './my-project');
res.files; // BuildOutputFile[]: fullPath, pathRelativeToOutdir, kind, dts, format, size
res.build; // { options, meta }
```

## More options

env, jsx, define, banner/footer, drop, conditions, loader, publicPath, sourceBase, shims, report, onSuccess, DCE — each with a config+CLI example in `references/options-reference.md`.
