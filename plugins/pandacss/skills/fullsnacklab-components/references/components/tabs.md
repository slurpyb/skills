# Tabs

Switch among peer panels without leaving the page.

## Import

```tsx
import { Tabs } from "@fullsnacklab/components";
```

Export shape: **family**.

## Verified API

- Components and helpers: `Root`, `RootProvider`, `List`, `Trigger`, `Content`, `Indicator`, `Context`.
- Exported contract types: `RootProps`.

## Composition skeleton

```text
Tabs.Root
Tabs.List
Tabs.Trigger repeated + Indicator
Tabs.Content repeated
```

## Contract

The root owns the active item or page. Keep triggers and panels/items in a stable order and preserve keyboard navigation, orientation, and generated identifiers.

## Accessibility check

Verify arrow-key behavior where supported, active-state announcement, focus order, and a stable relationship between each trigger and panel or item.

## Agent completion check

- Import only names listed above.
- Preserve the composition order and ownership described here.
- Forward the exported contract type instead of recreating package props.
- Verify the relevant interaction states in the consuming application.
- Apply the cross-cutting rules in [`composition.md`](../composition.md).
