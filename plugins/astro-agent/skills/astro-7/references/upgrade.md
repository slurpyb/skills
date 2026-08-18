# Upgrade to Astro 7

Run `npx @astrojs/upgrade` (or the project's package manager equivalent), then load `consult-astro-docs` against the current [Upgrade to Astro v7](https://docs.astro.build/en/guides/upgrade-to/v7/) guide. Coming from v5, run the v6 guide first.

This list is the gotchas that produce a broken config if you copy older skills or training data. It is not the full changelog.

## Config that no longer exists

- `output: 'hybrid'` — use `'static'` or `'server'` plus per-route `prerender`. See [output.md](output.md).
- `experimental.rustCompiler`, `experimental.queuedRendering`, `experimental.advancedRouting` — defaults now. Delete the flags.
- `experimental.cache` / `experimental.routeRules` — move to top-level `cache` and `routeRules`.
- `experimental.logger` — move to top-level `logger`.
- Top-level `csp: true` — CSP is `security.csp`.
- `@astrojs/db` — removed. Pick a replacement from the v7 upgrade guide.

## Compiler

The Rust compiler is the only `.astro` compiler. Unclosed tags error. Invalid nesting is no longer auto-corrected (a `<div>` inside a `<p>` used to be rewritten; now the browser sees it as written). Run a build after upgrade and close tags that fail.

## Reserved `src/fetch.ts`

Advanced routing loads `src/fetch.ts` automatically. If that file already exists for another purpose, set `fetchFile` to another name or `null`.

## Runtime

Astro 7 uses Vite 8. Integrations that touch Vite internals need the Vite 8 migration guide. Node floor is 22+; confirm the exact minimum on the current install page via `consult-astro-docs`.
