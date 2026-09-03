# Pin Input

Collect a fixed sequence of short characters or digits.

## Import

```tsx
import { PinInput } from "@fullsnacklab/components";
```

Export shape: **family**.

## Verified API

- Components and helpers: `Root`, `RootProvider`, `Control`, `HiddenInput`, `Input`, `Label`, `Context`.
- Exported contract types: `RootProps`.

## Composition skeleton

```text
PinInput.Root
PinInput.Label
PinInput.Control
PinInput.Input repeated for each position
PinInput.HiddenInput
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
