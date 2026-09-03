# Pagination

Move through pages of a larger result set.

## Import

```tsx
import { Pagination } from "@fullsnacklab/components";
```

Export shape: **family**.

## Verified API

- Components and helpers: `Root`, `RootProvider`, `Item`, `Ellipsis`, `PrevTrigger`, `NextTrigger`, `Items`, `Context`.
- Exported contract types: `RootProps`, `PaginationItemsProps`.

## Composition skeleton

```text
Pagination.Root
Pagination.PrevTrigger
Pagination.Items
Pagination.Item or Ellipsis
Pagination.NextTrigger
```

## Contract

The root owns the active item or page. Keep triggers and panels/items in a stable order and preserve keyboard navigation, orientation, and generated identifiers.

- Root owns total count, page size, and current page semantics.
- Items renders the computed page sequence; use Item for custom rendering only when necessary.

## Accessibility check

Verify arrow-key behavior where supported, active-state announcement, focus order, and a stable relationship between each trigger and panel or item.

## Agent completion check

- Import only names listed above.
- Preserve the composition order and ownership described here.
- Forward the exported contract type instead of recreating package props.
- Verify the relevant interaction states in the consuming application.
- Apply the cross-cutting rules in [`composition.md`](../composition.md).
