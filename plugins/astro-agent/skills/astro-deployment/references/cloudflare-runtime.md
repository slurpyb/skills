# Cloudflare runtime

This file is the set of gotchas the config does not confess, not the option reference.

## Bindings and env

`Astro.locals.runtime` is gone. Reach the platform directly:

```ts
import { env } from 'cloudflare:workers';

const kv = env.MY_KV;
const cf = Astro.request.cf;          // geo and request metadata
const ctx = Astro.locals.cfContext;   // ExecutionContext: waitUntil, exports
caches.default.put(request, response);
```

`astro:env/server` also works for declared variables. Non-secret vars go in `wrangler.jsonc` under `vars`; secrets go through `wrangler secret put` for production and a `.dev.vars` file for local runs.

Run `wrangler types` after every change to `wrangler.jsonc` or `.dev.vars`, and wire it ahead of `dev`, `build`, and `preview` in `package.json` scripts so binding types never drift.

## Workers, not Pages

A project still on Cloudflare Pages migrates to Workers first (Cloudflare's Pages-to-Workers migration guide), then deploys.

The Wrangler config file is optional for projects with no custom bindings — Astro generates a default and names the Worker from `package.json`. When the file does exist, `main` points at the adapter entrypoint `@astrojs/cloudflare/entrypoints/server`, not at a built file under `dist/`.

## Dev and build run on workerd

`astro dev` and `astro preview` use the Cloudflare Vite plugin and the real `workerd` runtime, so bindings, Durable Objects, and Workers AI behave as they do in production.

Two consequences:

- Prerendering also runs in `workerd`. If a prerendered page needs Node APIs such as `node:fs`, set `prerenderEnvironment: 'node'`. On-demand pages are unaffected.
- `workerd` rejects CommonJS. A dependency using `require` or `module.exports` fails in dev or build; pre-compile it with a Vite plugin that adds the package to `optimizeDeps.include` for non-client environments.

For readable stack traces from the preview server, set `vite.build.minify = false`.

## Environments are a build-time choice

One build no longer deploys to several Cloudflare environments. Build once per environment: `CLOUDFLARE_ENV=staging astro build && wrangler deploy`.

## Images and sessions

`imageService` defaults to `cloudflare-binding`, which transforms images at runtime through the automatically provisioned Images binding. Set `imageService: 'compile'` to go back to build-time-only transformation for prerendered routes.

Sessions get a KV namespace provisioned automatically, bound as `SESSION`. Rename it with `sessionKVBindingName`, or set `session: false` in Astro config to skip the binding and drop the session runtime from the bundle. KV writes are eventually consistent across regions — up to 60 seconds to propagate globally.
