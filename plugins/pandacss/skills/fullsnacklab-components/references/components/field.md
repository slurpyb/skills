# Field

Connect one control to its label, help, requirement, and error text.

## Import

```tsx
import { Field } from "@fullsnacklab/components";
```

Export shape: **family**.

## Verified API

- Components and helpers: `Root`, `RootProvider`, `ErrorText`, `HelperText`, `Label`, `RequiredIndicator`, `Context`.
- Exported contract types: `RootProps`.

## Composition skeleton

```text
Field.Root
Field.Label + RequiredIndicator
Input or another labelled control
Field.HelperText or ErrorText
```

## Contract

The root or native control owns value state. Connect labels, help, errors, and hidden form controls through the exported parts. Preserve controlled and uncontrolled usage rather than translating between them in a thin wrapper.

- Put invalid, required, disabled, and read-only state on Root so descendants receive one consistent field state.

## Accessibility check

Verify label association, instructions, error announcement, disabled and required state, keyboard operation, and hidden native form participation.

## Agent completion check

- Import only names listed above.
- Preserve the composition order and ownership described here.
- Forward the exported contract type instead of recreating package props.
- Verify the relevant interaction states in the consuming application.
- Apply the cross-cutting rules in [`forms-and-selection.md`](../forms-and-selection.md).
