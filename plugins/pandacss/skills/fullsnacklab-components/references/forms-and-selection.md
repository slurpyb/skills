# Forms and selection

Use this reference for fields, grouped fields, textual controls, collection controls, toggles, sliders, dates, colors, files, and editable values.

## Field anatomy

Use `Field` for one control and `Fieldset` for a related group.

```text
Field.Root
├─ Field.Label + Field.RequiredIndicator
├─ control
├─ Field.HelperText
└─ Field.ErrorText
```

Put invalid, required, disabled, and read-only state at the highest package part that owns the full field. This keeps labels, controls, and messages synchronized.

A placeholder is example content, not a label. An addon is context, not a label. Error text explains the current problem; helper text explains the expected input.

## Native participation

Keep the exported hidden control when the reference lists one:

- `HiddenInput` preserves form values and native submission.
- `HiddenSelect` preserves select semantics and submission.
- `ItemHiddenInput` associates repeated choices with the group.

A visually custom control is not complete if removing its hidden control drops it from form submission or browser behavior.

## Controlled and uncontrolled state

Choose one state owner.

- Use package-managed initial state when the application only needs a starting value.
- Use application-controlled state when business rules, persistence, dependent fields, or server synchronization require every change.
- Do not pass both models at once.
- Do not mirror package state in an effect merely to keep two copies synchronized.

Forward the package's change detail type when one is exported. Translate to domain data at the feature boundary, not inside a generic wrapper.

## Collections

`Combobox`, `Select`, `RadioGroup`, `RadioCardGroup`, `SegmentGroup`, and other repeated controls should use one collection model.

Each option needs:

- a stable value for state and submission;
- a visible label;
- optional disabled state;
- optional supporting description or decoration;
- a stable render key.

Render items from the same collection supplied to the root. Do not maintain a second filtered or sorted array unless the component contract explicitly receives that derived collection.

## Selection semantics

- Use `Checkbox` for independent boolean choices.
- Use `Switch` for an immediate setting whose effect applies directly.
- Use `RadioGroup` or `RadioCardGroup` for one choice from a visible set.
- Use `SegmentGroup` for a compact peer choice.
- Use `Select` when choices should remain collapsed until requested.
- Use `Combobox` when filtering or free text is part of finding the choice.
- Use `ToggleGroup` for compact action-like states.

## Composite values

- `PinInput` uses one visual input per position plus a hidden aggregate control.
- `TagsInput` owns a list of values and item editing/removal.
- `Slider` owns an array of values; render a thumb and hidden input for each value.
- `DatePicker` owns date values and calendar navigation.
- `ColorPicker` owns a color value across its views and channels.
- `FileUpload` owns accepted files, previews, and removal.

Keep conversion to domain formats at the feature boundary. Package-facing wrappers should preserve the package value model.

## Submission and errors

On submit:

1. keep focus on the first invalid control or an error summary link;
2. preserve entered values after failure;
3. connect error text to its field;
4. disable or mark pending actions only while duplicate submission is unsafe;
5. announce the operation result without replacing field-level errors.

## Completion check

- Every control has a persistent accessible label.
- Hidden native controls remain present where listed.
- One owner controls each value.
- Collection values and rendered items use the same model.
- Required, invalid, disabled, and read-only state is consistent across the field.
- Keyboard input, submission, reset, and error recovery work.
