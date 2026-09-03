# Combobox

Filter and choose from a collection with text input.

## Import

```tsx
import { Combobox } from "@fullsnacklab/components";
```

Export shape: **family**.

## Verified API

- Components and helpers: `Root`, `RootProvider`, `ClearTrigger`, `Content`, `Control`, `Empty`, `IndicatorGroup`, `Input`, `Item`, `ItemGroup`, `ItemGroupLabel`, `ItemText`, `Label`, `List`, `Positioner`, `Trigger`, `ItemIndicator`, `Context`.
- Exported contract types: `RootProps`.

Source defaults:

- ClearTrigger and Trigger provide default icons.
- The positioned list is not forced to match the control width.

## Composition skeleton

```text
Combobox.Root
Combobox.Label
Combobox.Control
Combobox.Input + IndicatorGroup + ClearTrigger + Trigger
Combobox.Positioner
Combobox.Content
Combobox.Empty or List
Combobox.ItemGroup + ItemGroupLabel
Combobox.Item + ItemText + ItemIndicator
```

## Contract

The root or native control owns value state. Connect labels, help, errors, and hidden form controls through the exported parts. Preserve controlled and uncontrolled usage rather than translating between them in a thin wrapper.

- Provide the collection expected by Root and render each item from the same item model.
- Empty belongs inside the disclosed content and should describe the current filter result.

## Accessibility check

Verify label association, instructions, error announcement, disabled and required state, keyboard operation, and hidden native form participation.

## Agent completion check

- Import only names listed above.
- Preserve the composition order and ownership described here.
- Forward the exported contract type instead of recreating package props.
- Verify the relevant interaction states in the consuming application.
- Apply the cross-cutting rules in [`forms-and-selection.md`](../forms-and-selection.md).
