# Overlays and positioned surfaces

Use this reference for `Dialog`, `Drawer`, `Popover`, `HoverCard`, `Menu`, and `Tooltip`.

## Choose by task

- **Dialog** — a focused modal task, confirmation, or required decision.
- **Drawer** — a focused modal task whose product layout enters from an edge.
- **Popover** — interactive supporting content anchored to a trigger without a modal task boundary.
- **Menu** — a temporary list of actions or choices.
- **HoverCard** — nonessential supporting information available from hover or focus.
- **Tooltip** — a short supplementary description.

Content required to understand or complete the page should remain visible rather than living only in a temporary surface.

## Structural contract

A composed overlay usually follows:

```text
Root
├─ Trigger
├─ Backdrop                         when modal
└─ Positioner
   └─ Content
      ├─ Arrow                      when anchored
      ├─ Header
      │  ├─ Title
      │  └─ Description
      ├─ Body
      └─ Footer + dismissal action
```

Use the exact parts from the component reference; not every family exports every row.

## Trigger ownership

The trigger must retain its accessible name, ref, and native behavior. One trigger should control one root unless a documented context trigger or anchor supports another relationship.

Do not make a noninteractive element behave like a button. Use a semantic action component as the trigger child.

## Focus lifecycle

Verify all phases:

1. focus remains sensible before opening;
2. opening moves focus to the intended content or first action;
3. keyboard navigation stays within a modal surface;
4. Escape and explicit dismissal follow product requirements;
5. closing returns focus to the originating action when it still exists;
6. reopening starts from a predictable focus state.

A nonmodal positioned surface should not trap focus, but every interactive descendant must remain keyboard reachable.

## Labelling

Modal and nontrivial positioned content needs a meaningful title. Add a description when the title does not explain the task or consequence. Keep visible title and description parts inside the content they label.

Tooltip text supplements the trigger; it does not replace the trigger's own accessible name.

## Dismissal and actions

Distinguish:

- passive dismissal, which abandons or closes;
- action completion, which applies a result and may close;
- destructive confirmation, which requires explicit consequence text;
- outside interaction, which may or may not dismiss depending on the task.

Use `ActionTrigger` only when completing that action should close the owning surface. Keep asynchronous failure visible and leave the surface open when the user needs to recover.

## Mount lifecycle

Several package surfaces mount lazily and remove content when closed. Initialize content from current state on each mount, cancel in-flight local work on cleanup, and avoid querying absent content before opening.

## Completion check

- The chosen overlay matches the task.
- Trigger naming and native behavior are preserved.
- Title and description label the content.
- Focus entry, containment, dismissal, and return are verified.
- Async success and failure produce intentional close behavior.
- Repeated open and close cycles do not leak state or listeners.
