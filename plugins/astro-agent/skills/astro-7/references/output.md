# Output

Confirm the current `output` and `prerender` signatures with `consult-astro-docs` before writing config. This file is the decision, not the API.

## Pick a default

| Default | When |
|---|---|
| `static` | Content sites, marketing, docs. Most pages are the same for every visitor. |
| `server` | Apps where **most or all** routes need cookies, auth, or fresh data per request. |

`'server'` adds no extra features — it only flips the default. Stay on `static` until that flip is earned.

Any on-demand route needs an adapter (`astro add` for the official ones). An adapter with every page still prerendered is fine when the host needs it (image CDN, server islands).

## Mix with `prerender`

- On `static`: `export const prerender = false` for the on-demand exceptions.
- On `server`: `export const prerender = true` for the static exceptions.
- The value must be a literal `true` or `false`. Variables and `import.meta.env` here fail at build.

## Leftover `hybrid`

Astro 5 merged `output: 'hybrid'` into `static` plus per-route `prerender`. If the project still sets `hybrid`, rewrite it to `static` (or `server` if that matches how the site actually behaves) and keep the `prerender` exports.
