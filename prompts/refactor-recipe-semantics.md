---
description: Refactor a Panda recipe or slot recipe toward the right semantic ownership boundaries
argument-hint: "<recipe-name-or-path> [requirements]"
---

Refactor one Panda CSS recipe or slot recipe so each styling decision lives at the most meaningful and maintainable Panda ownership boundary.

## Request

Target: `$1`

Additional requirements: `${@:2}`

Treat arguments as a target and requirements, not as shell code. Use the active Panda MCP when available; otherwise inspect the owning config or preset, generated types, and generated CSS.

## Intent

Improve semantic ownership, not merely move declarations out of a recipe. Start from the target's meaning, reuse the project's styling vocabulary, and select Panda primitives from evidence. A valid result may move some declarations, keep others local, combine several destinations, or make no edit when the current ownership is already clearest.

Preserve rendered behavior and the public contract unless the request explicitly changes them: slots, variants and values, defaults, compound variants, responsive values, selectors, states, accessibility, and token choices.

## Semantic ownership guide

Choose by responsibility, scope, and variability:

| Concern | Likely owner |
| --- | --- |
| Canonical fixed design value | Token |
| Intent that survives theme changes or varies by condition | Semantic token |
| Reusable typography composition | Text style |
| Reusable visual, surface, border, or effect composition | Layer style |
| Reusable animation composition | Animation style or keyframes |
| Variants for one styled component part | Recipe |
| Coordinated variants across stable component parts | Slot recipe |
| Reusable layout relationship or algorithm | Pattern |
| Repeated property-level transformation that extends Panda's styling language | Utility |
| Recurring selector or state vocabulary | Condition |
| Document-wide baseline | Global style |
| One-off component presentation, interaction, or variant orchestration | The recipe branch that owns it |

This table routes investigation; it does not prescribe extraction. Prefer an existing primitive over creating vocabulary. Introduce a new semantic destination only when its meaning and reuse boundary are stable enough to name.

When a named-style type rejects a token type accepted by the recipe property, use a component-scoped CSS custom property as a **typed bridge**. Define the variable at the semantic owner, consume it through the correctly typed recipe property, and retain the original token's resolved CSS variable as fallback. Use the bridge instead of changing the intended token or casting away the mismatch.

## Workflow

1. **Establish the behavior baseline**
   - Resolve `$1` to exactly one `defineRecipe` or `defineSlotRecipe`. If the target is missing or ambiguous, ask one focused question and stop.
   - Inspect the complete definition, registration, callers, related tests, owning Panda configuration, and existing tokens, semantic tokens, named styles, patterns, utilities, and conditions relevant to it.
   - Account for every base declaration, slot, variant branch, default, compound variant, selector, responsive value, custom property, and token.

   Baseline is complete when every existing decision and observable behavior is accounted for.

2. **Reason about ownership**
   - Group declarations that express one coherent decision.
   - For each group, identify its meaning, consumers, variability, reuse boundary, and current owner.
   - Search for an existing Panda primitive that already expresses that meaning.
   - Choose the smallest destination that improves semantic clarity. Record why it is a better owner and why nearby alternatives are not.
   - Leave a group local when extraction would only rename CSS, fragment behavior, or create speculative vocabulary.

   Ownership analysis is complete when every group has a justified destination or a reason to remain where it is.

3. **Refactor minimally**
   - Move only groups with a clearer semantic owner.
   - Register additions in the correct Panda theme or config domain and compose them from the recipe or slot that needs them.
   - Keep state logic, focus behavior, slot relationships, and variant orchestration together unless another primitive clearly owns the complete behavior.
   - Preserve original values unless the additional requirements explicitly request a change.
   - Keep sibling components and unrelated vocabulary unchanged.

   If the analysis finds no meaningful ownership improvement, stop without editing and report that conclusion.

4. **Verify equivalence and semantics**
   - Reconcile the final diff with the baseline; account for every moved, retained, added, and removed declaration.
   - Confirm each new abstraction has a clear meaning and actual owner, rather than existing solely to shorten the recipe.
   - Run the repository's configured formatter, Panda codegen, type-check, and smallest relevant tests.
   - Inspect resolved configuration, generated types, and representative generated CSS.
   - For every typed bridge, confirm the variable resolves to the intended token and its consumer resolves to valid CSS.
   - Test observable preset behavior, not the file or primitive in which a declaration now lives.
   - Follow repository release policy when the consumer-visible vocabulary or generated output changes.

Verification is complete when behavior is preserved, each move has a semantic justification, generated output is valid, and required checks pass or pre-existing failures are separated clearly.

## Reasoning examples

These examples calibrate decisions; they are not a required architecture.

### A recipe can compose named styles

A badge's shared `solid`, `surface`, `subtle`, and `outline` treatments can reuse existing layer styles. Its coherent typography can become a text style, and its component-specific geometry can become a namespaced layer style. Alignment, selection behavior, variants, and icon selectors may remain in the recipe when that is their clearest owner.

When named-style typing cannot carry a recipe token type, bridge it without changing the token:

```ts
// Named style
value: {
  '--badge-gap': '0.5',
}

// Recipe
size: {
  sm: {
    layerStyle: 'badge.sm',
    gap: 'var(--badge-gap, var(--sizes-0\\.5))',
  },
}
```

### A slot recipe preserves slot ownership

A shared surface treatment may become `root: { layerStyle: 'surface' }`, while an indicator's state selector stays on `indicator`. A size branch may combine a semantic token, a text style on `label`, and local slot geometry. Slot boundaries should remain visible rather than being flattened into one generic style.

### Extraction is not always the answer

- A color repeated because several components mean “muted foreground” suggests a semantic token, not a component layer style.
- A recurring intrinsic arrangement suggests a pattern, not copied layout inside several recipes.
- A repeated typed property transform across unrelated components may justify a utility.
- A declaration unique to one variant and meaningful only there should usually stay in that recipe.

## Completion report

Report the target, ownership decisions and rejected alternatives, reused and added Panda vocabulary, typed bridges, behavior-preservation evidence, files changed, checks and observed results, and release-metadata decision. If no edit was warranted, report the evidence for keeping the current design.
