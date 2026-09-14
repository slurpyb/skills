---
name: elena-authoring
description: Author or review Elena component ownership, props, templates, events, lifecycle, accessibility, frameworks, SSR, and tests in this repository.
---

# Author Elena components

Read `docs/engineering/elena-conventions.md` completely before changing component code.
Use the matching executable pattern under `docs/exemplars/conventions/` and the applicable
rules in `agent-os/standards/elena/component-authoring.md`. Load behavior standards through
`agent-os/standards/index.yml` only for behavior the component actually implements.

Choose and preserve one ownership model before changing API or markup. Rendered Light DOM
primitives own deterministic semantic structure through `render()`; Light DOM composites
preserve consumer descendants and omit `render()`. Keep native controls responsible for
their native activation, focus, form, navigation, validation, and event behavior.

Keep props, class-field defaults, JSDoc metadata, events, lifecycle cleanup, mixins, SSR,
hydration, CEM, declarations, and framework ownership coherent with the canonical guide.
Custom outward events bubble and compose. Connection and disconnection are repeatable, and
asynchronous completion is generation-owned and stale-safe.

Add or update the stable component preview early, inspect representative states in a real
browser, and prove the contract with focused tests and every applicable consumer fixture.
Run Bun repository gates, update the porting ledger when porting, commit validated
checkpoints, and reserve completion for a clean `bun run verify` commit.
