# Collapsible

Reveal or hide one region from a single trigger.

## Import

```tsx
import { Collapsible } from "@fullsnacklab/components";
```

Export shape: **family**.

## Verified API

- Components and helpers: `Root`, `RootProvider`, `Content`, `Indicator`, `Trigger`, `Context`.
- Exported contract types: `RootProps`.

## Composition skeleton

```text
Collapsible.Root
Collapsible.Trigger + Indicator
Collapsible.Content
```

## Contract

The root owns expanded state; triggers change it and content reflects it. Keep each trigger adjacent to the content it controls and preserve generated identifiers.

## Accessibility check

Verify keyboard activation, expanded state, focus visibility, and a meaningful trigger label.

## Agent completion check

- Import only names listed above.
- Preserve the composition order and ownership described here.
- Forward the exported contract type instead of recreating package props.
- Verify the relevant interaction states in the consuming application.
- Apply the cross-cutting rules in [`composition.md`](../composition.md).
