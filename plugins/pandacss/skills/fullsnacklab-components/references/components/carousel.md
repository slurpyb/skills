# Carousel

Navigate a finite collection of slides or panels.

## Import

```tsx
import { Carousel } from "@fullsnacklab/components";
```

Export shape: **family**.

## Verified API

- Components and helpers: `Root`, `RootProvider`, `AutoplayTrigger`, `Control`, `Indicator`, `Item`, `ItemGroup`, `NextTrigger`, `PrevTrigger`, `IndicatorGroup`, `Context`.
- Exported contract types: `RootProps`.

Source defaults:

- Root uses 16px item spacing unless overridden.

## Composition skeleton

```text
Carousel.Root
Carousel.ItemGroup
Carousel.Item
Carousel.Control
Carousel.PrevTrigger + IndicatorGroup + NextTrigger
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
