# Accessibility contract

Apply this reference to every component change. Component defaults provide a foundation; the consuming composition still owns names, content, order, and product behavior.

## Accessible names

Every interactive control needs a name that remains available without hover, color, shape, or icon recognition.

- Visible text should name ordinary actions.
- Icon-only actions need an explicit text alternative.
- Fields need persistent labels; placeholders are not labels.
- Groups need a group label or legend in addition to item labels.
- Modal and nontrivial positioned surfaces need a title.
- Images need meaning-aware alternative text.

Do not create multiple competing names for one control. Keep the visible label and accessible name aligned unless extra context is genuinely required.

## Description and error relationships

Descriptions explain purpose or constraints. Errors explain the current invalid state and recovery. Keep each message associated with its control through the package family rather than loose nearby text.

When an error appears after submission:

1. announce the error or summary;
2. preserve the user's value;
3. move focus only when it helps recovery;
4. keep the field's visible error near the control;
5. clear the invalid relationship when corrected.

## Keyboard

Test the keys implied by the interaction:

- Tab and Shift+Tab for focus order;
- Enter and Space for actions and toggles;
- Escape for dismissible temporary surfaces;
- arrow keys for menus, tabs, radio groups, sliders, and collection navigation;
- Home and End where the component supports range or list navigation;
- typing for text, search, and type-ahead interactions.

Visible order, DOM order, and keyboard order should tell the same story.

## Focus

Focus must be visible, predictable, and recoverable.

- Opening a modal surface moves focus intentionally.
- Closing returns focus to the originating action when possible.
- Disabled controls do not create dead keyboard stops.
- Validation failure focuses a useful recovery point.
- Scroll and resize interactions keep focused content visible.
- Lazy-mounted content does not receive focus before it exists.

## State

Communicate selected, checked, expanded, pressed, current, disabled, invalid, required, busy, and loading state through the component contract and visible presentation. Avoid separate attributes that disagree with package-owned state.

## Motion and timing

Respect reduced-motion preferences. Do not require pointer hover or a short timeout to read essential content. Transient messages need enough time to perceive and must not be the only location for blocking information.

## Announcements

Use live announcements for operation status, not every visual change. One operation should produce one clear announcement. Avoid announcing a loading state repeatedly during rapid updates.

## Manual verification

For every changed interaction:

1. complete it with keyboard only;
2. inspect the accessible name, role, and state;
3. verify focus before, during, and after temporary surfaces;
4. trigger empty, invalid, disabled, loading, success, and failure states that apply;
5. confirm zoom and narrow layouts preserve access to controls and messages.
