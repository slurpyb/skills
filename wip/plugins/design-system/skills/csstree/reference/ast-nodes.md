# AST node cheat sheet

Every node has `type` (string) and `loc` (`{ source, start:{offset,line,column}, end:{…} } | null`;
filled only with `positions: true`). Nested nodes live in `children` (a `List`, or `null` for a
non-functional pseudo). Interactive explorer:
<https://astexplorer.net/#/gist/244e2fb4da940df52bf0f4b94277db44>.

## The nodes you'll touch most

| Node | Key fields |
|------|-----------|
| `StyleSheet` | `children` (top-level rules / at-rules) |
| `Rule` | `prelude: SelectorList \| Raw`, `block: Block` |
| `Block` | `children` (declarations and/or nested rules) |
| `Declaration` | `property: string`, `value: Value \| Raw`, `important: boolean \| string` |
| `Value` | `children` (the value's tokens) |
| `Raw` | `value: string` — unparsed fragment (parse errors, or `parseValue:false`, custom-prop values) |
| `SelectorList` | `children` (one `Selector` per comma group) |
| `Selector` | `children` (the compound selector's parts) |
| `ClassSelector` / `IdSelector` / `TypeSelector` | `name: string` |
| `AttributeSelector` | `name: Identifier`, `matcher`, `value`, `flags` |
| `PseudoClassSelector` / `PseudoElementSelector` | `name: string`, `children: List \| null` (null = non-functional) |
| `Combinator` | `name: string` (`' '`, `>`, `+`, `~`) |
| `Atrule` | `name: string`, `prelude: AtrulePrelude \| Raw \| null`, `block: Block \| null` |
| `AtrulePrelude` | `children` |

## Value-level leaves

| Node | Key fields |
|------|-----------|
| `Identifier` | `name` |
| `Number` / `Percentage` | `value: string` |
| `Dimension` | `value: string`, `unit: string` (e.g. `1rem` → value `1`, unit `rem`) |
| `Hash` | `value` (a `#rrggbb` colour without the `#`) |
| `String` | `value` |
| `Url` | `value` |
| `Function` | `name`, `children` (args; e.g. `var(--x)`, `calc(…)`) |
| `Operator` | `value` (`,`, `/`, `+`, `-`, `*`) |
| `Parentheses` / `Brackets` | `children` |

## Media / container / supports

`MediaQueryList` → `MediaQuery` (`modifier`, `mediaType`, `condition`) → `Condition`
(`kind`, `children`) → `Feature` (`kind`, `name`, `value`) / `FeatureRange` / `SupportsDeclaration`
(`declaration`). Microsyntaxes: `AnPlusB` (`a`, `b`), `Nth`, `UnicodeRange`, `Ratio`.

> Full list with TS-style definitions:
> <https://github.com/csstree/csstree/blob/master/docs/ast.md>
