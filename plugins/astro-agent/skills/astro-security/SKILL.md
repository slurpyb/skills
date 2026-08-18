---
name: astro-security
description: Configures Content Security Policy in Astro through `security.csp`. Use when enabling CSP, allowing external scripts or styles past Astro's generated hashes, delivering CSP as adapter HTTP headers, or fixing a page that broke once CSP turned on.
license: MIT
metadata:
  author: Fusengine
  author_url: https://github.com/fusengine
  origin: https://github.com/fusengine/agents
---

# Astro security

## Work the project

1. Read `astro.config.*` for an existing `security` block, then search `src/` for `<ClientRouter`, `<Code`, and `define:vars`. Done when you can name the current `security.csp` value and every CSP-constrained surface already in the project.
2. Load `consult-astro-docs` and query `security.csp` plus the integration page for the installed adapter. Done when every key this task writes is confirmed against current docs.
3. Run `astro build` then `astro preview`. Done when a served page carries the directives you intended, in the `<meta http-equiv="content-security-policy">` element or in the response headers.

`security.csp` arrives in Astro 6. From Astro 5, upgrade first via `astro-7`.

## Enable

`security.csp: true` hashes every script and style Astro bundles with `SHA-256`, then injects `<meta http-equiv="content-security-policy">` into each page's `<head>` carrying `script-src` and `style-src`. Swap `true` for an object to configure further:

```js
// astro.config.mjs
security: {
  csp: {
    algorithm: 'SHA-512',
    directives: ["default-src 'self'", "img-src 'self' https://images.cdn.example.com"],
  },
}
```

## External scripts and styles

Astro hashes what it bundles; everything else you supply through `scriptDirective`, `styleDirective`, or the `Astro.csp` runtime API.

Load [directives.md](references/directives.md) to add a hash or a trusted origin, hash a CDN asset, scope a policy to one page, or target `script-src-elem` / `script-src-attr` with `kind`.

## HTTP headers

Load [http-headers.md](references/http-headers.md) when the CSP should ship as a response header. Adapter setup itself belongs to `astro-deployment`.

## Limitations

Load [limitations.md](references/limitations.md) before enabling CSP on a project that uses `<ClientRouter />`, Shiki, or `unsafe-inline`.
