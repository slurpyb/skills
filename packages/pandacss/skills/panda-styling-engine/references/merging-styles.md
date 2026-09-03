# Merging Styles

Load when base presentation, variants, named styles, consumer classes, or overrides must coexist.

Merge at the highest owning abstraction:

1. Add stable shared presentation to a recipe or slot-recipe `base`.
2. Add selectable presentation as a variant.
3. Add cross-variant behavior as a compound variant.
4. Extract repeated domain compositions into a named style.
5. Merge class strings only when they have independent owners.

Panda's `cx` combines already-generated class strings. It does not resolve competing style objects or establish precedence between duplicated styling owners.

## Text Styles

Use a named text style when font family, size, weight, line height, tracking, or decoration recur as one typographic role. Consume it through `textStyle` and override only the exceptional property.

## Layer Styles

Use a named layer style for reusable surface treatment such as background, border, shadow, opacity, or disabled presentation. Keep typography in text styles and component variants in recipes.

## Animation Styles

Use a named animation style when keyframes, duration, easing, fill mode, and origin form one reusable motion contract. Pair meaningful motion with the project's reduced-motion condition.

## Global Styles

Use global styles for resets, document element defaults, global font faces, and root-level variables. Component presentation remains in recipes, slot recipes, patterns, or named styles.

## Consumer overrides

Preserve the shared primitive as styling owner. Accept an independent consumer class only at the documented class boundary. If the same override recurs or changes a public visual decision, promote it into the owning recipe, pattern, token, or named style.

Next, load [recipes.md](./recipes.md), [slot-recipes.md](./slot-recipes.md), or [theme-config.md](./theme-config.md) for the abstraction that should absorb the merge.
