# Color Picker

Select, inspect, and edit a color value.

## Import

```tsx
import { ColorPicker } from "@fullsnacklab/components";
```

Export shape: **family**.

## Verified API

- Components and helpers: `Root`, `RootProvider`, `Area`, `AreaBackground`, `AreaThumb`, `ChannelInput`, `ChannelSlider`, `ChannelSliderLabel`, `ChannelSliderThumb`, `ChannelSliderTrack`, `ChannelSliderValueText`, `Content`, `Control`, `EyeDropperTrigger`, `FormatSelect`, `FormatTrigger`, `HiddenInput`, `Label`, `Positioner`, `Swatch`, `SwatchGroup`, `SwatchIndicator`, `SwatchTrigger`, `TransparencyGrid`, `Trigger`, `ValueSwatch`, `ValueText`, `View`, `Context`.
- Exported contract types: `RootProps`.

## Composition skeleton

```text
ColorPicker.Root
ColorPicker.Label
ColorPicker.Control
ColorPicker.Trigger + ValueSwatch + ValueText
ColorPicker.Positioner
ColorPicker.Content
ColorPicker.Area + AreaBackground + AreaThumb
ColorPicker.ChannelSlider + ChannelSliderTrack + ChannelSliderThumb
ColorPicker.SwatchGroup + SwatchTrigger + Swatch
ColorPicker.HiddenInput
```

## Contract

The root or native control owns value state. Connect labels, help, errors, and hidden form controls through the exported parts. Preserve controlled and uncontrolled usage rather than translating between them in a thin wrapper.

- Choose a deliberate subset of views and channels for the product task; exposing every part creates unnecessary complexity.
- Keep the hidden input in forms that submit the selected value.

## Accessibility check

Verify label association, instructions, error announcement, disabled and required state, keyboard operation, and hidden native form participation.

## Agent completion check

- Import only names listed above.
- Preserve the composition order and ownership described here.
- Forward the exported contract type instead of recreating package props.
- Verify the relevant interaction states in the consuming application.
- Apply the cross-cutting rules in [`forms-and-selection.md`](../forms-and-selection.md).
