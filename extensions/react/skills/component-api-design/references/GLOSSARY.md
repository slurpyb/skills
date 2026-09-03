# Glossary

Vocabulary for this skill. General concepts, checked against how real, widely-used component libraries actually implement them, not brand-name comparisons. See [SOURCES.md](SOURCES.md) if you want the specific libraries this was grounded in.

**Anatomy**:
The named, addressable pieces of a component, decided before any code gets written. Trigger, content, item, positioner. Some systems declare this explicitly as data, one factory or one schema producing every part's selector and DOM attributes at once. Others leave it implicit in JSX structure. The declared version scales better once a whole library of components shares conventions. The implicit version is faster to reach for on one self-contained component.
_Avoid_: "sub-component" as the general term. Use "part."

**Part**:
One entry in a component's anatomy. Name parts with a shared prefix when they belong together (`item`, `itemText`, `itemIndicator`, `itemGroup`, `itemGroupLabel`) and a shared suffix when they share a role (`itemTrigger`, `closeTrigger`, `clearTrigger` all end in `Trigger`). camelCase in code, kebab-case once it hits the DOM.

**Root**:
The part that establishes shared state for the rest of the tree. Two shapes exist, and which one you need depends on the component. A structural component (an accordion, a select) renders a real DOM wrapper at Root. An overlay or portal component (a dialog, a popover) has content that lives somewhere else in the tree entirely, so Root is a pure state provider with no DOM output of its own.

**Compound component**:
The `Namespace.Part` pattern: `Dialog.Root`, `Dialog.Trigger`, `Dialog.Content`. Built by exporting each part under its own fully-qualified name, then also re-exporting the whole set under one namespace object, so both the qualified name and the dotted form work. Some systems skip the namespace object and ship flat qualified names only, a real option when you're optimizing for a codebase people read and edit directly rather than one they import as a black box.
_Avoid_: calling this "sub-component pattern." Call it what it is: a namespace of parts sharing one Root's state.

**Provider** / **RootProvider**:
Two ways to wire a part tree to its state. Root builds the state and provides it in one step. A separate Provider variant takes an already-built state object and just provides it, splitting "construct the state" from "hand it to a subtree." Exists for callers who need to build state themselves, outside the component tree, and control it imperatively from elsewhere.

**Controlled prop** / **Uncontrolled default prop** / **Change callback**:
The three-way shape every piece of stateful data takes: a controlled value, an uncontrolled starting value, and a callback that fires on every change either way. See [CONTROLLED-UNCONTROLLED.md](CONTROLLED-UNCONTROLLED.md) for the full guide, this is the single most load-bearing convention in this whole skill.

**Callback payload**:
What a change callback actually hands back: a bare value, or a details object carrying that value plus room to grow. See [CALLBACKS.md](CALLBACKS.md) for the full guide.

**Polymorphism**:
Letting a consumer swap the rendered element or component without losing the part's behavior and accessibility wiring. Two real mechanisms exist, not variations on one:

- **Clone-based** (often called `asChild`, implemented as a "Slot"): the part clones its single child element and merges props onto it. Purely structural. Requires exactly one child. Can't see internal state.
- **Render-function-based** (often called a `render` prop): accepts an element (props/ref merged onto it, same as the clone-based approach) or a function `(props, state) => element`, which additionally receives the part's internal state and full control over how props get spread. Strictly more capable, at a real cost: since the actual DOM tag isn't knowable before hydration when this is used polymorphically, the component needs an escape-hatch prop (something like `nativeButton`) to know which default behaviors are still valid.

Whichever you pick, the consumer contract, forward the ref, spread every received prop onto the real DOM node, has to be written down somewhere a caller will actually see it, not left implicit.

**data-attribute**:
The DOM-visible mirror of internal state, so plain CSS can react to it without any JS-computed className. Three addressing schemes are all legitimate: bespoke attributes hand-written per component (simplest, fastest to reach for on one component); a generic two-key scheme, a scope key identifying the component and a part key identifying the piece (scales best across a whole library, one factory can generate it consistently everywhere); or a single component-identity key on every element (simplest possible hook, enough when the codebase is small and you own every line of it).

**Boolean data-attribute**:
Rendered as present-when-true, absent-when-false: `data-disabled={cond ? '' : undefined}`. Never `data-disabled="true"`/`"false"` as strings. The one data-attribute rule with no real exceptions.

**Enum-valued state attribute vs. boolean-per-state**:
A single enum attribute (`data-state="open"|"closed"`) is terser to read at a glance. Separate boolean attributes per state (`data-open`, `data-closed`) let two states coexist without an enum forcing a single value, which matters the moment two things need to be true at once, a popup that's both open and mid-enter-transition, for instance.

**CSS custom property**:
A CSS variable set inline by the component for any value that has to be measured in JS: widths, heights, transform origins, computed positions. Two naming conventions exist. Fully-qualified per component, per part, per property (verbose, but never collides even when several different popup components are composed on one page). Generic and shared across every component that needs the same kind of value (DRY, and safe only because each variable is always scoped to one positioning element, never read globally).

**Variant**:
A named visual style option on a pre-styled (not headless) component: `variant="default"|"destructive"|"outline"`. Only relevant once you ship opinionated visual styling on top of behavior. Mirror the active variant back onto the DOM as its own data-attribute (`data-variant`, `data-size`) so custom CSS can target it without re-deriving the value from a className string.

**Collection**:
The registration pattern behind any keyboard-navigable list of items (a listbox, a menu, a tab list). Each item registers itself into a shared collection on mount; the list reads the live, current DOM order back out to drive arrow-key navigation, with no prop drilling and no manual index bookkeeping.

**Scope**:
A mechanism letting one component be composed inside another component's tree without id or context collisions, by namespacing the shared state itself, not just the DOM ids. What makes it possible to reuse one component's internals inside another, or to nest two instances of the same pattern (a tooltip inside a popover) safely.

**Context** (the internal-state kind, not the React kind):
Some systems draw a sharp, explicit line between props (caller-supplied configuration, static for the life of the call) and context (the component's own reactive state, which changes over time in response to events). The controlled/uncontrolled triad is how that internal context gets exposed to callers as props in the first place.

## Terminology conflicts

Know these before assuming any one convention is universal.

- **Clone-based polymorphism vs. render-function polymorphism is a real architectural fork, not a style difference.** Clone-based is simpler and purely structural, but can't see component state and requires exactly one child. Render-function is strictly more capable, state-aware, can control its own prop-spreading, but pushes real complexity back onto both the component (escape hatches for the not-yet-knowable DOM tag) and the consumer (an explicit forward-ref-and-spread-props contract). Neither is strictly better. They optimize for different things.
- **Single-enum state attribute vs. boolean-per-state is a real tradeoff, not a preference.** Enum is terser. Booleans compose without collision the moment two states need to be simultaneously true.
- **Attribute addressing scheme: bespoke vs. generic scope-and-part vs. single-key.** Bespoke, hand-written attributes are fastest to reach for on one component. A generic scope-and-part scheme is worth the setup cost once a whole library of components needs the same selector strategy to work identically everywhere. A single identity key is enough for a small, directly-editable codebase.
- **CSS variable naming: fully-qualified vs. generic.** Fully-qualified names never collide when several different components are composed on one page. Generic names are DRY and only work because each one is always scoped to a single positioning element.
- **Callback payload: bare value vs. details object.** A details object can gain new fields later without a breaking change. A bare positional value can't. Full guide in [CALLBACKS.md](CALLBACKS.md).
