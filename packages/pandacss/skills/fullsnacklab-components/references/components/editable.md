# Editable

Switch between a read-only preview and inline editing.

## Import

```tsx
import { Editable } from "@fullsnacklab/components";
```

Export shape: **family**.

## Verified API

- Components and helpers: `Root`, `RootProvider`, `Area`, `CancelTrigger`, `Control`, `EditTrigger`, `Input`, `Label`, `Preview`, `SubmitTrigger`, `Context`.
- Exported contract types: `RootProps`.

## Composition skeleton

```text
Editable.Root
Editable.Label
Editable.Area
Editable.Preview or Input
Editable.Control
Editable.EditTrigger or SubmitTrigger + CancelTrigger
```

## Contract

The root or native control owns value state. Connect labels, help, errors, and hidden form controls through the exported parts. Preserve controlled and uncontrolled usage rather than translating between them in a thin wrapper.

- Preview and Input represent the same value; do not render competing editable controls.
- Submit and Cancel actions belong in Control.

## Accessibility check

Verify label association, instructions, error announcement, disabled and required state, keyboard operation, and hidden native form participation.

## Agent completion check

- Import only names listed above.
- Preserve the composition order and ownership described here.
- Forward the exported contract type instead of recreating package props.
- Verify the relevant interaction states in the consuming application.
- Apply the cross-cutting rules in [`forms-and-selection.md`](../forms-and-selection.md).
