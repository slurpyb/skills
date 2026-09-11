# Menu

Present a temporary list of actions, choices, or nested actions.

## Import

```tsx
import { Menu } from "@fullsnacklab/components";
```

Export shape: **family**.

## Verified API

- Components and helpers: `Root`, `RootProvider`, `Arrow`, `ArrowTip`, `CheckboxItem`, `Content`, `ContextTrigger`, `Indicator`, `Item`, `ItemGroup`, `ItemGroupLabel`, `ItemText`, `Positioner`, `RadioItem`, `RadioItemGroup`, `Separator`, `Trigger`, `TriggerItem`, `ItemIndicator`, `Context`.
- Exported contract types: `RootProps`, `SelectionDetails`.

Source defaults:

- Root and RootProvider mount lazily and remove content when closed.
- TriggerItem provides a downward chevron.

## Composition skeleton

```text
Menu.Root
Menu.Trigger or ContextTrigger
Menu.Positioner
Menu.Content
Menu.Item or CheckboxItem or RadioItem
Menu.ItemText + ItemIndicator
Menu.ItemGroup + ItemGroupLabel
Menu.Separator
```

## Contract

The root owns open state and lifecycle. Keep trigger, positioning, content, dismissal, focus return, and labelling in one composition. Mount one root per independent surface.

- Use Item for actions, CheckboxItem for independent choices, and RadioItemGroup with RadioItem for one-of-many choices.
- Keep nested menu triggers and their content in the same menu tree.

## Accessibility check

Verify trigger naming, title and description relationships, focus entry, focus containment where modal, dismissal, and focus return.

## Agent completion check

- Import only names listed above.
- Preserve the composition order and ownership described here.
- Forward the exported contract type instead of recreating package props.
- Verify the relevant interaction states in the consuming application.
- Apply the cross-cutting rules in [`overlays.md`](../overlays.md).
