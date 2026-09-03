// ── defineUtility ────────────────────────────────────────────────────────────
// A custom utility turns a repeated style cluster into a single token-aware prop.
// Every component in this library uses `focusRing: "inside" | "outside"` instead
// of restating `outline / outlineColor / outlineOffset` — one source of truth for
// what a focus ring looks like, themeable via the accent token.
//
// Defined in panda.config.ts under `utilities.extend` (shown here standalone for
// clarity). After codegen it is a fully typed style prop:
//
//   css({ _focusVisible: { focusRing: "outside" } })
//
// Why a utility and not a layerStyle: layerStyles are whole presets applied via
// `layerStyle`; a utility is a single property you compose anywhere, including
// inside conditions like `_focusVisible`.

export const focusRingUtility = {
  focusRing: {
    className: "focus-ring",
    values: ["inside", "outside"] as const,
    transform(value: string) {
      return {
        outline: "2px solid",
        outlineColor: "accent.500",
        outlineOffset: value === "inside" ? "-2px" : "2px",
      }
    },
  },
}
