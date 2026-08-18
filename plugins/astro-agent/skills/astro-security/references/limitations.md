# CSP limitations and their replacements

Every entry here is a surface Astro's CSP implementation cannot hash. Each has a supported path forward — take that path rather than loosening the policy.

## Dev server

CSP is inactive under `astro dev`, because the Vite dev server serves modules Astro never hashed. Verify with `astro build && astro preview`, or with `curl -I` against a deploy preview when the policy ships as headers.

## `<ClientRouter />`

Astro's client-side router is unsupported under CSP. Two supported routes:

- Use the browser-native cross-document View Transition API, which animates MPA navigation with CSS alone and adds no JavaScript to the page. This covers most projects that only wanted the animation.
- Keep `<ClientRouter />` on a project without CSP when you depend on its extras — shared state across pages, persistent elements, `navigate()`, fallback control for browsers lacking native support.

## Shiki

Shiki emits inline `style` attributes by design, so its output cannot be hashed. Two supported routes:

- Render `<Prism />` from `@astrojs/prism` instead, or set `markdown.syntaxHighlight: 'prism'`. Prism applies CSS classes, so bring a Prism stylesheet.
- Allow inline `style` attributes explicitly, which also covers `define:vars`:

```js
// astro.config.mjs — Astro 7.1+
security: {
  csp: {
    styleDirective: {
      resources: [{ resource: "'unsafe-inline'", kind: 'attribute' }],
    },
  },
}
```

That confines `unsafe-inline` to `style-src-attr`, leaving `style-src` and `style-src-elem` hash-based.

## `unsafe-inline` on a hashed directive

Astro emits hashes for its bundled scripts, and modern browsers reject `unsafe-inline` in any directive that also carries a hash or nonce — so an `unsafe-inline` there is silently dead, not a loosening. Where you need it, scope it to an `attribute` directive as above; otherwise add the hash or the origin.

## External resources

Astro hashes only what it bundles, so a CDN script or stylesheet needs an entry you write — see [directives.md](directives.md) for the hash-or-origin decision and the command that computes a hash.
