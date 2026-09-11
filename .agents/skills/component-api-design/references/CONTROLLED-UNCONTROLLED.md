# Controlled and Uncontrolled Props

The single most load-bearing convention in component API design. Get this one right and half of the rest of the API falls into place on its own.

## The shape, always three parts

Every piece of stateful data a component owns gets three props, not one and not two:

- **`value`** (or `open`, or whatever the concept is called): the controlled value. When the caller passes this, they own the state, and the component renders exactly what it's told.
- **`defaultValue`** (or `defaultOpen`): the starting value for uncontrolled mode. When the caller doesn't pass `value` at all, the component manages its own internal state, seeded once from `defaultValue`.
- **`onValueChange`** (or `onOpenChange`): fires on every change, in both modes, controlled or not.

Never ship just two of these. A bare `value`/`onChange` pair with no uncontrolled default forces every caller into controlled mode, even for the common case where they don't actually care and just want the component to manage itself. A bare `value` with no callback is worse than useless: the caller can set the initial value but has no way to ever find out it changed, so the UI goes dead the instant the user interacts with it.

## Why `defaultValue` earns its place

It's tempting to think `defaultValue` is a minor convenience next to the "real" controlled/callback pair. It isn't. Most consumers of most components, most of the time, don't need to own the state at all, they just want a working component. Without `defaultValue`, every one of those consumers has to write their own `useState` and wire up the controlled pair by hand, just to get the uncontrolled behavior they wanted in the first place. `defaultValue` is what makes the simple case simple.

## Single source of truth, per mode

This is the rule that's easy to state and easy to get subtly wrong in practice:

- **In controlled mode**, the component holds no internal state for that value at all. Every render derives the displayed value directly from the `value` prop. If the component keeps a shadow copy of it internally "just in case," that shadow copy and the prop will eventually disagree, and now there are two sources of truth instead of one.
- **In uncontrolled mode**, the component's internal state is the only source of truth, initialized once from `defaultValue` on mount. Do not re-sync that internal state if `defaultValue` changes on a later render. `defaultValue` is a starting point, not a continuously-controlled prop wearing a trench coat. If it needs to keep changing the value from outside, that's what controlled mode is for.

## Detecting the mode, and not letting it change

Whether a component is controlled or not is usually decided once, by checking if `value !== undefined` on the first render, and treated as fixed for the lifetime of that instance. A component that starts uncontrolled (`value` is `undefined`) and then receives a real `value` on a later render, or the reverse, has switched modes mid-life, and that's a real bug class, not a supported use case. If you're implementing this yourself, warn about it. If you're consuming a component like this, never do it: pick a mode when you render the component and stay there.

## Partial control: one triad per independent value, not one big state object

A component with several independent pieces of state, is it open, what's selected, what's highlighted, doesn't get one lumped `state`/`onStateChange` pair covering all of them. It gets one full controlled/uncontrolled/callback triad per independent piece: `open`/`defaultOpen`/`onOpenChange` for whether it's open, `value`/`defaultValue`/`onValueChange` for what's selected, `highlightedValue`/`defaultHighlightedValue`/`onHighlightChange` for what's highlighted. This lets a caller control exactly the one thing they care about (say, which item is selected) while leaving everything else (say, open/closed) uncontrolled, without having to reconstruct or intercept unrelated state just to pass it through untouched.

## A worked example

```
// Uncontrolled: caller doesn't manage state at all.
<Select defaultValue="apple" onValueChange={(v) => track('select', v)} />

// Controlled: caller owns the value, and must update it on every change.
function ControlledExample() {
  const [value, setValue] = useState('apple')
  return <Select value={value} onValueChange={(v) => setValue(v)} />
}

// Partially controlled: caller only cares about open/closed,
// leaves the selected value itself uncontrolled.
function OpenTrackingExample() {
  const [open, setOpen] = useState(false)
  return (
    <Select
      open={open}
      onOpenChange={(o) => setOpen(o)}
      defaultValue="apple"
    />
  )
}
```

Notice the controlled example is responsible for calling `setValue` inside `onValueChange`. Forgetting that line is the single most common bug in consuming a controlled component: the value prop won't change, the callback will keep firing, and the UI will look frozen on the first value forever, because the caller took ownership of the state but never wrote it back.

## Common naming pitfalls

- Using `onChange` alone where a more specific name (`onValueChange`, `onOpenChange`) is available. A generic `onChange` reads fine on a single-purpose component but stops scaling the moment a component has more than one independent piece of state, since now there's ambiguity about which changed.
- Naming the controlled prop and the uncontrolled default prop inconsistently across a library's own components (`open`/`initialOpen` on one, `value`/`defaultValue` on another). Consumers learn the pattern once and expect to be able to guess the rest of the API. Inconsistency breaks that trust immediately.
- Shipping `value` without `defaultValue` "because most people will control it anyway." Check that assumption. It's usually wrong, and it's cheap to support both.
