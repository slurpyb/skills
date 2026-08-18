# scriptDirective, styleDirective, and per-page CSP

Astro hashes what it bundles. Everything else — a CDN script, a third-party widget, an origin you trust — arrives through these. Confirm each signature with `consult-astro-docs` before writing.

## The three knobs

`scriptDirective` and `styleDirective` each take:

- `hashes` — a known payload. Prefix `sha256-`, `sha384-`, or `sha512-`; other prefixes fail validation.
- `resources` — an origin you trust. This list replaces Astro's defaults, so keep `"'self'"` in it.
- `strictDynamic: true` — a trusted script may inject further scripts.

## Hashing an external asset

Compute the hash from the exact bytes you will serve:

```bash
curl -s https://cdn.example.com/script.js | openssl dgst -sha384 -binary | openssl base64 -A
```

Prefix the output with `sha384-` and add it to `scriptDirective.hashes`. Pin a versioned URL alongside it, since the hash breaks the moment the CDN changes a byte. Where the payload changes on its own, allow the origin through `resources` instead.

## One page only

`Astro.csp?.insertScriptHash()`, `insertScriptResource()`, `insertStyleHash()`, `insertStyleResource()`, and `insertDirective()` all work in frontmatter, middleware, and endpoints. Astro merges and dedupes across the config and the runtime API, so the two compose.

## `kind`

Since Astro 7.1 a hash or resource entry can be an object carrying `kind` — `{ resource: …, kind: 'attribute' }` — which sends it to `script-src-attr` / `script-src-elem` (or the style equivalents) rather than the generic directive. [limitations.md](limitations.md) works this through for inline `style` attributes.

A bare entry stays on the generic directive, and browsers do not fall back from a specific directive to the generic one. So query `consult-astro-docs` for `kind` and give each entry the directive the browser will actually consult.
