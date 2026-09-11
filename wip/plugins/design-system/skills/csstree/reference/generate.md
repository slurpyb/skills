# Serialization — `generate(node, options)`

```js
import { parse, generate } from 'css-tree';
const ast = parse('.a { color: red }');
generate(ast);          // ".a{color:red}"
```

- Works on **any** node, not just the root — `generate(declaration.value)` serialises just that
  subtree. This is how the helpers turn a value/prelude back into a string.
- Output is compact (no superfluous whitespace) — css-tree targets minification/transform, not
  pretty-printing. For formatted output, post-process with Prettier/stylelint, or use the
  `decorate` hook below.

## Options

| Option | Use |
|--------|-----|
| `sourceMap: true` | Returns `{ css, map }` instead of a string. `map` is a `SourceMapGenerator` (needs the AST parsed with `positions: true` and ideally a `filename`). |
| `mode` | `'spec'` (default) or `'safe'` — controls whitespace insertion between tokens to avoid accidental merges. |
| `decorate(get, node)` | Advanced hook to wrap/modify emitted chunks per node. |

```js
const { css, map } = generate(parse(src, { positions: true, filename: 'in.css' }), { sourceMap: true });
```

Round-trip: `generate(node)` ⇄ `parse(str)`. For JSON round-trips use `toPlainObject` /
`fromPlainObject` (see [utils.md](utils.md)).

> Full docs: <https://github.com/csstree/csstree/blob/master/docs/generate.md>
