# Traversal — `walk` / `find` / `findAll`

```js
import { parse, walk, generate } from 'css-tree';
const ast = parse('.a { color: red }');
walk(ast, node => console.log(node.type));
// StyleSheet, Rule, SelectorList, Selector, ClassSelector, Block, Declaration, Value, Identifier
```

## `walk(ast, options)`

`walk(ast, fn)` is shorthand for `walk(ast, { enter: fn })`.

Options:
- `enter(node, item, list)` — on the way down (before children).
- `leave(node, item, list)` — on the way up (after children).
- `visit: 'Declaration'` — only fire for that node type. **10–15× faster** for `Atrule`, `Rule`,
  `Declaration` (subtrees that can't contain the type are skipped). Caveat: a node in the wrong
  place may be skipped — drop `visit` and test `node.type` yourself if you must catch every one.
- `reverse: true` — iterate children last→first and properties in reverse.

Visitor args: `node`, then `item` (list wrapper with `.prev`/`.next`/`.data`) and `list` (the
`List`) — both only defined when the node is inside a list. Test `item`/`list` before using.

Control flow (return value from `enter`):
- `this.skip` / `walk.skip` — don't descend into this node (enter only).
- `this.break` / `walk.break` — stop the whole walk.
  (Arrow functions have no `this` — use `walk.skip` / `walk.break`.)

Ancestor context on `this`: `root`, `stylesheet`, `atrule`, `atrulePrelude`, `rule`, `selector`,
`block`, `declaration`, `function`. Example — collect URLs only inside declarations:

```js
const urls = [];
walk(ast, function (node) {
  if (this.declaration !== null && node.type === 'Url') urls.push(node.value);
});
```

Mutating during walk (only safe on `List` children — `fromPlainObject` guarantees this):

```js
walk(ast, (node, item, list) => {
  if (node.type === 'Declaration' && node.property === 'bar' && list) list.remove(item);
});
```

## `find` / `findLast` / `findAll`

```js
find(ast, (node) => node.type === 'Declaration' && node.property === 'color'); // first (natural order)
findLast(ast, fn);  // first in reverse order
findAll(ast, fn);   // array of all matches
```

> Full docs: <https://github.com/csstree/csstree/blob/master/docs/traversal.md>
