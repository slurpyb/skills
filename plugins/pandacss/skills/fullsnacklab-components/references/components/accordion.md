# Accordion

Show sections that expand and collapse independently or as a group.

## Import

```tsx
import { Accordion } from "@fullsnacklab/components";
```

Export shape: **family**.

## Verified API

- Components and helpers: `Root`, `RootProvider`, `Item`, `ItemContent`, `ItemIndicator`, `ItemTrigger`, `ItemBody`, `Context`.
- Exported contract types: `RootProps`.

Source defaults:

- ItemIndicator supplies a downward chevron when no child is provided.

## Composition skeleton

```text
Accordion.Root
Accordion.Item
Accordion.ItemTrigger + ItemIndicator
Accordion.ItemContent
Accordion.ItemBody
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
