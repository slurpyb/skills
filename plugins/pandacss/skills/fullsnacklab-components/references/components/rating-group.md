# Rating Group

Choose or display a rating across repeated items.

## Import

```tsx
import { RatingGroup } from "@fullsnacklab/components";
```

Export shape: **family**.

## Verified API

- Components and helpers: `Root`, `RootProvider`, `Item`, `Label`, `HiddenInput`, `ItemIndicator`, `Items`, `Control`, `Context`, `ItemContext`.
- Exported contract types: `RootProps`.

Source defaults:

- Control renders Items when no children are supplied.

## Composition skeleton

```text
RatingGroup.Root
RatingGroup.Label
RatingGroup.Control
RatingGroup.Items or Item repeated
RatingGroup.ItemIndicator
RatingGroup.HiddenInput
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
