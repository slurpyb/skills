# Select

Choose one or more values from a disclosed list.

## Import

```tsx
import { Select } from "@fullsnacklab/components";
```

Export shape: **family**.

## Verified API

- Components and helpers: `Root`, `ClearTrigger`, `Content`, `Control`, `IndicatorGroup`, `Item`, `ItemGroup`, `ItemGroupLabel`, `ItemText`, `Label`, `List`, `Positioner`, `Trigger`, `ValueText`, `Indicator`, `HiddenSelect`, `ItemIndicator`, `Context`, `ItemContext`.
- Exported contract types: `RootProps`, `ValueChangeDetails`.

Source defaults:

- Indicator provides a disclosure icon when no child is supplied.

## Composition skeleton

```text
Select.Root
Select.Label
Select.Control
Select.Trigger + ValueText + IndicatorGroup + ClearTrigger
Select.Positioner
Select.Content
Select.List
Select.ItemGroup + ItemGroupLabel
Select.Item + ItemText + ItemIndicator
Select.HiddenSelect
```

## Contract

The root or native control owns value state. Connect labels, help, errors, and hidden form controls through the exported parts. Preserve controlled and uncontrolled usage rather than translating between them in a thin wrapper.

- Provide the collection expected by Root and render items from that same model.
- Keep HiddenSelect when native form submission is required.

## Accessibility check

Verify label association, instructions, error announcement, disabled and required state, keyboard operation, and hidden native form participation.

## Agent completion check

- Import only names listed above.
- Preserve the composition order and ownership described here.
- Forward the exported contract type instead of recreating package props.
- Verify the relevant interaction states in the consuming application.
- Apply the cross-cutting rules in [`forms-and-selection.md`](../forms-and-selection.md).
