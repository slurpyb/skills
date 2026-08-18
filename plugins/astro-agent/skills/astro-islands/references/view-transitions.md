# View transitions and persistence

This file is the gotchas, not the API.

## ClientRouter, not ViewTransitions

`<ViewTransitions />` was renamed `<ClientRouter />` in Astro 5 and removed outright in Astro 6. Import it from `astro:transitions` into the shared `<head>`:

```astro
---
import { ClientRouter } from 'astro:transitions';
---
<head>
  <ClientRouter />
</head>
```

`fallback` is its only prop — `'animate'` (default), `'swap'`, or `'none'`. `handleForms` was removed in v6; form submissions are routed by default, and a single form opts out with `data-astro-reload`, as does a single link.

Astro 6 also stopped exporting `createAnimationScope()`, `isTransitionBeforePreparationEvent()`, `isTransitionBeforeSwapEvent()`, and the `TRANSITION_*` constants from `astro:transitions` and `astro:transitions/client`. Compare `event.type` against the event name string instead.

## transition:persist

Moves the existing DOM node, and an island's live state, into the new page instead of remounting it:

```astro
<MusicPlayer client:load transition:persist />
<video controls transition:persist="media-player" />
```

The value is a name, used to match an element that sits in a different component on the next page — the same matching job as `transition:name`, whose value must be unique per page.

A persisted island **re-renders with the new page's props** by default while keeping its state, which is what you want for page-specific props like a title or a locale. `transition:persist-props` (4.5+) freezes the props as well — reach for it only when stale props are the goal.

CSS animations restart and iframes reload across a swap regardless of `transition:persist`.

## Scripts do not re-run

The swap replaces `<body>` wholesale and keeps `<head>` elements that exist on the new page, including any marked `transition:persist`. Bundled module scripts execute once per visit, not once per navigation. Wrap setup in an `astro:page-load` listener, or `astro:after-swap` when it must land before paint — a theme class, for one. `<script is:inline data-astro-rerun>` forces re-execution on every navigation.

## Media frozen after a swap outside Chromium

A `<video>` that gets remounted by a swap can leave Firefox or Safari with a stuck decode pipeline: visually playing, actually desynced. `transition:persist` on the player keeps the element itself and avoids it.
