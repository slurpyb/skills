# Tags Input

Create, edit, and remove a list of text values.

## Import

```tsx
import { TagsInput } from "@fullsnacklab/components";
```

Export shape: **family**.

## Verified API

- Components and helpers: `Root`, `RootProvider`, `ClearTrigger`, `Control`, `HiddenInput`, `Input`, `Item`, `ItemDeleteTrigger`, `ItemInput`, `ItemPreview`, `ItemText`, `Label`, `Items`, `Context`.
- Exported contract types: `RootProps`, `ItemProps`, `TagsInputItemsProps`.

Source defaults:

- Clear and item-delete actions provide close icons.

## Composition skeleton

```text
TagsInput.Root
TagsInput.Label
TagsInput.Control
TagsInput.Items
TagsInput.Item
TagsInput.ItemPreview + ItemText + ItemDeleteTrigger
TagsInput.Input
TagsInput.HiddenInput + ClearTrigger
```

## Contract

The root or native control owns value state. Connect labels, help, errors, and hidden form controls through the exported parts. Preserve controlled and uncontrolled usage rather than translating between them in a thin wrapper.

## Accessibility check

Verify label association, instructions, error announcement, disabled and required state, keyboard operation, and hidden native form participation.

## Agent completion check

- Import only names listed above.
- Preserve the composition order and ownership described here.
- Forward the exported contract type instead of recreating package props.
- Verify the relevant interaction states in the consuming application.
- Apply the cross-cutting rules in [`forms-and-selection.md`](../forms-and-selection.md).
