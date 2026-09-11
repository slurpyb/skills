# Date Picker

Choose a date or date range from calendar views.

## Import

```tsx
import { DatePicker } from "@fullsnacklab/components";
```

Export shape: **family**.

## Verified API

- Components and helpers: `Root`, `RootProvider`, `ClearTrigger`, `Content`, `Control`, `Input`, `Label`, `MonthSelect`, `NextTrigger`, `Positioner`, `PresetTrigger`, `PrevTrigger`, `RangeText`, `Table`, `TableBody`, `TableCell`, `TableCellTrigger`, `TableHead`, `TableHeader`, `TableRow`, `Trigger`, `View`, `ViewControl`, `ViewTrigger`, `YearSelect`, `Context`.
- Exported contract types: `RootProps`.

## Composition skeleton

```text
DatePicker.Root
DatePicker.Label
DatePicker.Control
DatePicker.Input + ClearTrigger + Trigger
DatePicker.Positioner
DatePicker.Content
DatePicker.ViewControl
DatePicker.PrevTrigger + ViewTrigger + NextTrigger
DatePicker.View
DatePicker.Table + TableHead + TableBody
DatePicker.TableRow + TableHeader or TableCell
DatePicker.TableCellTrigger
```

## Contract

The root or native control owns value state. Connect labels, help, errors, and hidden form controls through the exported parts. Preserve controlled and uncontrolled usage rather than translating between them in a thin wrapper.

- Keep calendar table headers and cells in calendar order.
- Use PresetTrigger only for product-defined date shortcuts.

## Accessibility check

Verify label association, instructions, error announcement, disabled and required state, keyboard operation, and hidden native form participation.

## Agent completion check

- Import only names listed above.
- Preserve the composition order and ownership described here.
- Forward the exported contract type instead of recreating package props.
- Verify the relevant interaction states in the consuming application.
- Apply the cross-cutting rules in [`forms-and-selection.md`](../forms-and-selection.md).
