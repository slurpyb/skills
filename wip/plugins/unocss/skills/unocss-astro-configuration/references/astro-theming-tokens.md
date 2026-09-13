# Token-Backed Theming & CSP-Safe Dark Mode

Utility CSS is only as maintainable as the values behind it. The rule for an Astro project: **define
design tokens once as CSS custom properties, theme them with `light-dark()` and a `[data-theme]`
attribute, and point the UnoCSS theme at those same tokens.** Utilities then reference the token
scale — never raw hex/px, never a parallel set of values.

## 1. Tokens as CSS custom properties

```css [src/styles/tokens.css]
:root {
  --color-ink-700: light-dark(#374151, #d1d5db);
  --color-accent-600: light-dark(#15803d, #22c55e);
  --color-surface: light-dark(#ffffff, #0b0f17);
  --radius-card: 0.5rem;
  --font-sans: ui-sans-serif, system-ui, sans-serif;
}
:root[data-theme='light'] { color-scheme: light; }
:root[data-theme='dark']  { color-scheme: dark; }
```

`light-dark()` resolves per `color-scheme`, so a single token serves both themes; `[data-theme]`
lets a user override the OS preference. Inject the file once (e.g. `injectExtra` or a layout import):

```ts [astro.config.ts]
UnoCSS({ injectReset: true, injectExtra: ['import "/src/styles/tokens.css"'] })
```

## 2. Point the UnoCSS theme at the tokens

Map the UnoCSS `theme` (and/or rules) onto the custom properties so `text-ink-700`,
`bg-surface`, `rounded-card` resolve to tokens, not literals (see [core-theme](core-theme.md)):

```ts [uno.config.ts]
import { defineConfig, presetWind4 } from 'unocss'

export default defineConfig({
  presets: [presetWind4()],
  theme: {
    colors: {
      ink: { 700: 'var(--color-ink-700)' },
      accent: { 600: 'var(--color-accent-600)' },
      surface: 'var(--color-surface)',
    },
    borderRadius: { card: 'var(--radius-card)' },
    fontFamily: { sans: 'var(--font-sans)' },
  },
})
```

```astro [now utilities are token-backed]
<article class="bg-surface text-ink-700 rounded-card font-sans p-4">…</article>
```

A hard-coded `#15803d` or `13px` in a component is a bug — reference a token
(`text-accent-600`, `rounded-card`). This is the same principle whether you theme via UnoCSS
`theme`, shortcuts, or `@apply` in scoped styles.

## 3. Dark mode strategy

UnoCSS's `dark:` variant supports two strategies (see **gotchas & pitfalls** (in the `unocss-astro-usage` skill)):

- **`media`** (default) — follows `prefers-color-scheme`. Zero JS. Use when you don't need a toggle.
- **`class`/attribute** — driven by `.dark` / `[data-theme]`. Use when users pick a theme.

With token-backed colours via `light-dark()`, much of your palette flips for free from
`color-scheme` alone — reach for `dark:` utilities only for the cases tokens can't express:

```ts [uno.config.ts — attribute-driven dark variant]
import { presetWind4 } from 'unocss'
presetWind4({ dark: { dark: '[data-theme="dark"]', light: '[data-theme="light"]' } })
```

## 4. CSP-safe theme toggle (no inline handlers)

A strict CSP forbids inline `<script>` bodies and `onclick=`. Ship the toggle as a deferred
`public/*.js` behaviour that flips `[data-theme]` and persists the choice — never an inline handler:

```js [public/theme-toggle.js]
(function () {
  function apply(t) { document.documentElement.setAttribute('data-theme', t); }
  function init() {
    document.addEventListener('click', function (e) {
      var el = e.target.closest('[data-theme-toggle]');
      if (!el) return;
      var next = document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
      try { localStorage.setItem('theme', next); } catch (_) {}
      apply(next);
    });
  }
  if (document.readyState === 'loading')
    document.addEventListener('DOMContentLoaded', init, { once: true });
  else init();
})();
```

```astro [src/layouts/BaseLayout.astro]
<button data-theme-toggle aria-label="Toggle theme"
        class="rounded p-2 hover:bg-ink-700/10">🌓</button>
<script src="/theme-toggle.js" defer></script>
```

## 5. No flash of the wrong theme

Apply the stored theme **before first paint**. Under a strict CSP this single early script is the
one sanctioned inline exception — allow it by **hash**, never `'unsafe-inline'`:

```astro [src/layouts/BaseLayout.astro — in <head>, before styles]
<script is:inline>
  try {
    var t = localStorage.getItem('theme') ||
      (matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
    document.documentElement.setAttribute('data-theme', t);
  } catch (e) {}
</script>
```

Compute its SHA-256 and add it to `script-src` in your CSP. Keep it to these few lines.

## Accessibility & motion

- Meet WCAG AA contrast (4.5:1 body, 3:1 large/UI) in **both** themes — verify token pairs.
- Never signal with colour alone; pair a status colour with text/icon.
- Honour `prefers-reduced-motion` for any UnoCSS `transition`/`animate-*` utilities you add globally.

```css [src/styles/global.css]
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after { animation: none !important; transition: none !important; }
}
```
