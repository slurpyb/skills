# Parsing — `parse(source, options)`

```js
import { parse } from 'css-tree';
const ast = parse('.a { color: red }');
const value = parse('1px solid red', { context: 'value' });
```

Tolerant by design: unparseable fragments become `Raw` nodes (it does **not** throw). Redundant
whitespace/comments are dropped from the AST (except `/*! … */`).

## `context` — what slice of CSS the source is

`stylesheet` (default) · `atrule` · `atrulePrelude` · `mediaQueryList` · `mediaQuery` · `rule` ·
`selectorList` · `selector` · `block` · `declarationList` (block body w/o braces — e.g. an HTML
`style` attribute) · `declaration` · `value` (a single declaration value).

## Key options

| Option | Default | Use |
|--------|---------|-----|
| `positions` | `false` | Fill each node's `loc` (`{ source, start, end }`, offset 0-based, line/col 1-based). Required for line/column reporting. |
| `filename` | `''` | Stored as `loc.source`; for source maps. |
| `onParseError(error)` | `null` | Called for each recovered error. `error.formattedMessage` is a pointer-annotated string. |
| `onComment(value, loc)` | `null` | Called per comment. |
| `onToken(type, start, end, index)` | `null` | Token stream hook; pass an array to collect token objects. |
| `parseAtrulePrelude` | `true` | `false` → at-rule prelude stays a `Raw` node. |
| `parseRulePrelude` | `true` | `false` → selector stays a `Raw` node. |
| `parseValue` | `true` | `false` → declaration value stays a `Raw` node (faster; the validator uses this). |
| `parseCustomProperty` | `false` | `false` (default) → `--x` value is a single `Raw`. `true` → parse it like a normal value. |
| `offset` / `line` / `column` | `0`/`1`/`1` | Start position when parsing a fragment of a larger file. |

## Errors

```js
parse('a { b: 1! }', { onParseError: e => console.log(e.formattedMessage) });
```

This skill's `parseCss(source, { tolerant })` wraps the above: `positions: true` on by default;
throws on the first parse error unless `tolerant: true`.

> Full docs: <https://github.com/csstree/csstree/blob/master/docs/parsing.md>
