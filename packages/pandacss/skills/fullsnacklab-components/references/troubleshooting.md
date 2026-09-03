# Troubleshooting

Diagnose from ownership outward. Find the first boundary where expected state, structure, styles, or semantics diverge.

## Import does not resolve

1. Confirm the importing workspace declares the package.
2. Confirm the name appears in `component-index.md`.
3. Confirm the installed package export map exposes the import path.
4. Check whether feature code should import an existing workspace wrapper instead.
5. Re-run installation only after the dependency declaration is correct.

## Component renders without expected styles

1. Confirm the component stylesheet is loaded once at the application style boundary.
2. Confirm shared theme generation completed before the build.
3. Confirm the generated import path matches project configuration.
4. Confirm the wrapper forwards `className` and supported style props to the intended part.
5. Compare a direct package component with the wrapper to isolate the layer.

## Trigger does not open content

1. Confirm trigger and content belong to the same namespace and root.
2. Confirm required positioning and content parts are present.
3. Confirm a wrapper did not replace the package event callback.
4. Confirm controlled open state updates in response to package change details.
5. Confirm a disabled or pending state is not intentionally blocking interaction.

## Selection does not update

1. Confirm root collection, rendered items, and values use the same model.
2. Confirm stable values are distinct from display labels.
3. Confirm controlled state writes the next package value.
4. Confirm hidden native controls remain present when required.
5. Confirm the wrapper does not translate between incompatible value shapes.

## Form submits no value

1. Check `HiddenInput`, `HiddenSelect`, or item hidden controls.
2. Confirm the control has the intended name.
3. Confirm it is inside the submitted form.
4. Confirm disabled state is not excluding the value intentionally.
5. Inspect the submitted form data before changing visual composition.

## Focus is lost

1. Confirm trigger refs reach the package trigger.
2. Confirm temporary content remains mounted for the expected lifecycle.
3. Confirm keys and values are stable across renders.
4. Confirm closing returns focus before the trigger unmounts.
5. Confirm validation or navigation is not moving focus elsewhere.

## Hydration mismatch

1. Compare initial server and client values.
2. Remove browser-only branching from the first render.
3. Stabilize identifiers and collection order.
4. Keep temporary content closed until matching state is available.
5. Move measurement and browser APIs after mount.

## Package update regression

1. Compare installed versions with the skill header.
2. Diff the affected export surface and defaults.
3. Type-check shared wrappers first.
4. Run one representative interaction for the affected family.
5. Update the dedicated component reference with the package change.

## Stop condition

Stop diagnosing when one boundary has a reproducible failing input and an incorrect output. Fix that owning boundary, then rerun the complete user flow.
