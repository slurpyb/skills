# Callbacks

Everything about designing the "this changed, here's what you get told about it" surface of a component. Pairs with [CONTROLLED-UNCONTROLLED.md](CONTROLLED-UNCONTROLLED.md), since a change callback is one-third of every controlled/uncontrolled triad, but callbacks show up far beyond that triad too: lifecycle hooks, interaction hooks, cancellation hooks. This guide is about all of them.

## Name every callback after the specific thing that changed

`onChange` alone is a fine name exactly once, on a component with exactly one piece of state. The instant a component has more than one independent value, a bare `onChange` becomes ambiguous, and every consumer has to go read the docs to find out what "change" refers to this time. Name it after the noun: `onValueChange`, `onOpenChange`, `onHighlightChange`. This single rule is what lets a component gain a second piece of state later without a breaking rename, and it's what lets a consumer guess a new callback's name correctly before ever reading the docs.

## Payload shape: bare value or a details object

Two real conventions, and the choice is a real tradeoff, not a style preference.

**Bare positional value**: `onOpenChange(open: boolean)`. Simple, minimal, exactly what most consumers reach for. The cost: if this callback ever needs to hand back a second piece of information, there is no way to add it without either breaking every existing caller's function signature or bolting on a second, separately-named callback that fires at the same time.

**Details object**: `onOpenChange(details: { open: boolean })`. Slightly more ceremony at the call site (`({ open }) => ...` instead of `(open) => ...`), but it buys forward compatibility for free: a new field can be added to the details object at any point without changing the call signature at all, and every existing consumer keeps working exactly as before, they just don't happen to read the new field.

Pick one, for a given component's entire callback surface, and hold it everywhere. A component that uses bare values for `onOpenChange` and a details object for `onValueChange` has an inconsistent API that's harder to remember correctly than either convention alone would be.

If you expect the component's state to grow (most components do, over a long enough timeline), lean toward the details object from day one. Retrofitting a details object onto an API that shipped bare values is a breaking change; shipping a details object that currently has one field is not.

## Fire on real change, not on every set

A callback named `onValueChange` should fire when the value actually changes, not every time a setter gets called with the same value it already had. Setting an already-open dialog to open again shouldn't fire `onOpenChange`. This sounds obvious stated plainly, and it's still one of the more common sources of bugs in practice, usually because the check for "did this actually change" got skipped somewhere in an update path that wasn't the primary one (a programmatic API call, an effect syncing from a prop, a reducer branch nobody re-checked). Whatever internal paths can set a value, route them all through the same real-change check before the callback fires.

## Decide whether programmatic changes fire the callback too

A component's value can change for two different reasons: a user interacted with it, or something outside called an imperative method or changed a prop that moved the value. Decide, on purpose, whether both cases fire the same callback or not. Most of the time they should, a consumer subscribing to `onValueChange` usually wants to know about every change regardless of source, not just the ones a human triggered directly. But if a component has a genuine need to distinguish (analytics that only care about user-driven changes, for instance), that's a signal for a second, more specifically named callback (something like `onUserValueChange`) rather than adding a boolean flag to the details object that most consumers will never read.

## Granularity: one callback per phase, when phases are real

Some transitions have more than one meaningful moment. A dialog closing isn't instantaneous if there's an exit animation, there's "the close was requested" and there's "the close animation actually finished and the element is gone." Collapsing both into one `onOpenChange(false)` loses real information for a consumer who needs to know when it's actually safe to, say, return focus or unmount something downstream. When a transition genuinely has more than one moment a consumer might care about separately, give each its own callback (`onOpenChange` for the request, `onOpenChangeComplete` for the animation finishing) rather than overloading one callback with a phase argument nobody will remember to check.

Don't over-apply this. Most state changes are instantaneous and don't have a meaningful second phase. Splitting a callback into multiple phases the component doesn't actually have is just noise.

## Cancellation and "before" hooks

Some interactions need a way to stop them before they complete, a close that should be preventable if a form inside has unsaved changes, for instance. Two shapes both show up in practice:

- A callback that can return `false` (or call a `preventDefault`-style method on an event-like argument) to cancel the transition. Keeps everything in one callback, at the cost of that callback now doing two jobs, notifying and gatekeeping.
- A separate, distinctly-named hook (`onBeforeClose`, or a `confirmClose` prop) that runs first and can block the transition, with the regular change callback only firing once the transition is actually going ahead. Keeps notification and gatekeeping separate, at the cost of one more prop to document.

Prefer the separate hook once the gatekeeping logic is nontrivial (anything beyond a simple boolean check), since a callback trying to do both jobs tends to grow confusing conditionals over time as more gatekeeping needs get added to it.

## Async callbacks

A callback that needs to do async work before a transition can complete (validating with a server before allowing a value change, for instance) should return a `Promise` and the component should treat "pending" as its own real, representable state, not silently block or silently ignore the async work. Name things so the async nature is visible or at least discoverable (a `disabled` or `loading`-style prop the component sets while waiting is common), rather than leaving a consumer to guess whether their returned promise is actually being awaited anywhere.

## Ordering guarantees, when a caller has more than one callback

If a single user interaction can trigger more than one callback at once (selecting an item might change both `value` and, if that closes the component, `open`), decide and document what order they fire in. Consumers occasionally need to coordinate across two callbacks (do something when the value changes, but only after confirming the component is now closed, for instance), and an unspecified or inconsistent firing order turns that into a race condition. It doesn't matter enormously which order you pick as much as that you pick one and keep it stable across releases.
