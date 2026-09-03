# Radio Card Group

Choose one option from visually rich card choices.

## Import

```tsx
import { RadioCardGroup } from "@fullsnacklab/components";
```

Export shape: **family**.

## Verified API

- Components and helpers: `Root`, `RootProvider`, `Indicator`, `Item`, `ItemControl`, `ItemText`, `Label`, `ItemHiddenInput`, `Context`.
- Exported contract types: `RootProps`.

## Composition skeleton

```text
RadioCardGroup.Root
RadioCardGroup.Label
RadioCardGroup.Item
RadioCardGroup.ItemHiddenInput
RadioCardGroup.ItemControl + Indicator
RadioCardGroup.ItemText
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
