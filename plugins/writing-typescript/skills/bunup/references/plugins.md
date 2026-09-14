# Plugins

`plugins` accepts Bun native plugins AND bunup plugins; mix freely. Built-ins import from `bunup/plugins`.

```ts
import { defineConfig } from 'bunup';
import { copy } from 'bunup/plugins';
import { tailwindcss } from '@bunup/plugin-tailwindcss';
import type { BunPlugin } from 'bun';

export default defineConfig({
	entry: 'src/index.tsx',
	plugins: [tailwindcss({ minify: true }), copy(['README.md', 'assets/**/*']), myBunPlugin],
});
```

## copy (`bunup/plugins`)

Copy files/dirs to output. Chainable: `.to(dest)`, `.with(opts)`, `.transform(fn)`. Default dest = build outDir.

```ts
copy('README.md'); // single
copy(['README.md', 'LICENSE']); // multiple
copy('README.md').to('documentation.md'); // rename
copy('assets'); // dir → dist/assets/ (structure preserved)
copy('assets').to('static'); // dir → dist/static/
copy('**/*.md'); // glob, recursive
copy('assets/**/*').to('static'); // flatten into dist/static/
copy(['assets/**/*', '!**/*.tmp', '!**/.DS_Store']); // ! excludes
```

### `.transform(ctx => ...)`

ctx = `{ content, path, destination, options }`. Return string (keep filename) or `{ content, filename }`.

```ts
copy('data/**/*.json').transform(({ content }) => JSON.stringify(JSON.parse(content.toString())));
copy('scripts/**/*.ts').transform(({ content, path }) => ({
	content: new Bun.Transpiler({ loader: 'ts' }).transformSync(content.toString()),
	filename: basename(path).replace('.ts', '.js'),
}));
// options carries build config: options.outDir, options.watch, options.minify ...
```

### `.with(options)`

| Option            | Default     | Effect                                |
| ----------------- | ----------- | ------------------------------------- |
| `followSymlinks`  | false       | follow symlinks                       |
| `excludeDotfiles` | false       | skip dotfiles                         |
| `override`        | true        | overwrite existing; `false` skips     |
| `watchMode`       | `'changed'` | `'changed'` \| `'always'` \| `'skip'` |

## tailwindcss (`@bunup/plugin-tailwindcss`)

Official Tailwind v4 plugin. No PostCSS. `bun add --dev @bunup/plugin-tailwindcss`.

```ts
plugins: [tailwindcss()];
```

Entry CSS: `@import "tailwindcss";` → imported in your entry point. Output → `dist/index.css`. Consumers don't need Tailwind installed.

**Component library — scope classes to avoid collisions** via Tailwind prefix:

```css
@import 'tailwindcss' prefix(yuku);
```

```tsx
<button className="yuku:bg-blue-500 yuku:hover:bg-blue-600 yuku:px-4 yuku:rounded-md" />
```

Output is scoped + tree-shaken (only used classes). Distribute: add `"./styles.css": "./dist/index.css"` to exports.

### Options

| Option                  | Effect                                                                     |
| ----------------------- | -------------------------------------------------------------------------- |
| `inject: true`          | ship CSS inside JS, auto-inject at runtime (no separate import)            |
| `minify: true`          | minify generated CSS                                                       |
| `preflight: true`       | include Tailwind reset — **avoid for libs** (affects consumer's whole app) |
| `postcssPlugins: [...]` | extra PostCSS plugins                                                      |

## react-compiler (`@bunup/plugin-react-compiler`)

Auto-memoizes components/hooks (no manual `useMemo`/`useCallback`/`memo`). `bun add --dev @bunup/plugin-react-compiler`.

```ts
plugins: [reactCompiler({ filter: /\.tsx$/, reactCompilerConfig: { target: '18' } })];
```

Default filter `/\.[jt]sx$/`. Uses Babel → slightly slower builds (worth it for runtime perf).

## Authoring a bunup plugin

Bunup plugins add lifecycle hooks beyond Bun's native plugins.

```ts
import type { BunupPlugin } from 'bunup';

export function myBunupPlugin(): BunupPlugin {
	return {
		name: 'my-bunup-plugin',
		hooks: {
			onBuildStart: async (ctx) => {
				ctx.options.banner = '/* built */';
			}, // modify options
			onBuildDone: async ({ files, options, meta }) => {
				console.log(meta.packageJson.data?.name, files.length);
			},
		},
	};
}
```

| Hook                | When         | Capabilities                      |
| ------------------- | ------------ | --------------------------------- |
| `onBuildStart(ctx)` | before build | setup; mutate `ctx.options`       |
| `onBuildDone(ctx)`  | after build  | read output, post-process, report |

A bun native plugin instead: `{ name, setup(build) { ... } }` typed `BunPlugin` from `"bun"` — passed straight to Bun's bundler.

### Context types

`onBuildDoneCtx` = `{ files: BuildOutputFile[], options: BuildOptions, meta: BuildMeta }`.

```ts
type BuildOutputFile = {
	entrypoint: string | undefined; // undefined for chunks/assets
	kind: 'entry-point' | 'chunk' | 'asset' | 'sourcemap' | 'bytecode';
	fullPath: string;
	pathRelativeToRootDir: string;
	pathRelativeToOutdir: string;
	dts: boolean;
	format: Format;
	size: number; // bytes
};
type BuildMeta = { packageJson: PackageJson; rootDir: string };
```

Hooks that throw fail the build — wrap risky work in try/catch and rethrow with context.

### Example: bundle-size reporter

```ts
export function bundleSizeReporter(maxSize?: number): BunupPlugin {
	return {
		name: 'bundle-size-reporter',
		hooks: {
			onBuildDone: async ({ files }) => {
				for (const f of files.filter((x) => x.kind === 'entry-point')) {
					const size = (await Bun.file(f.fullPath).arrayBuffer()).byteLength;
					console.log(`${f.pathRelativeToOutdir} (${f.format}): ${(size / 1024).toFixed(2)} KB`);
					if (maxSize && size > maxSize)
						throw new Error(`${f.pathRelativeToOutdir} exceeds ${maxSize}B`);
				}
			},
		},
	};
}
```
