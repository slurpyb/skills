# Slider

Choose one or more numeric values along a track.

## Import

```tsx
import { Slider } from "@fullsnacklab/components";
```

Export shape: **family**.

## Verified API

- Components and helpers: `Root`, `Control`, `DraggingIndicator`, `Label`, `Marker`, `MarkerIndicator`, `MarkerGroup`, `Range`, `Thumb`, `Track`, `ValueText`, `HiddenInput`, `Marks`, `Thumbs`, `Context`.
- Exported contract types: `RootProps`, `MarkerGroupProps`, `ThumbProps`, `MarksProps`.

## Composition skeleton

```text
Slider.Root
Slider.Label + ValueText
Slider.Control
Slider.Track + Range
Slider.Thumbs or Thumb repeated + HiddenInput
Slider.MarkerGroup + Marks
```

## Contract

The root or native control owns value state. Connect labels, help, errors, and hidden form controls through the exported parts. Preserve controlled and uncontrolled usage rather than translating between them in a thin wrapper.

- Render one Thumb and HiddenInput per value in the root value array.
- Marks describe useful values; they are not a substitute for the current ValueText.

## Accessibility check

Verify label association, instructions, error announcement, disabled and required state, keyboard operation, and hidden native form participation.

## Agent completion check

- Import only names listed above.
- Preserve the composition order and ownership described here.
- Forward the exported contract type instead of recreating package props.
- Verify the relevant interaction states in the consuming application.
- Apply the cross-cutting rules in [`forms-and-selection.md`](../forms-and-selection.md).
