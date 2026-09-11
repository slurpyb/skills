# Utilities

## `property(name)` — safe declaration-property parsing

Splits a `Declaration.property` into its parts and detects hacks/vendor/custom. Returns a frozen,
interned object (same input → same object). **Always use this to test custom properties**, not a
raw `startsWith('--')`, because it also normalises case (custom props stay case-sensitive).

```js
property('-webkit-box-shadow'); // { basename:'box-shadow', name:'-webkit-box-shadow', hack:'', vendor:'-webkit-', prefix:'-webkit-', custom:false }
property('--Brand');            // { basename:'--Brand', name:'--Brand', hack:'', vendor:'', prefix:'', custom:true }
property('*width').hack;        // '*'   (hacks: _ + # * $ / // at the start)
```

## `keyword(name)` — like `property` but no hack detection

For any identifier that isn't a declaration property (selectors, at-rule names, etc.). Same shape
minus `hack`/`basename` semantics: `{ name, vendor, prefix, custom }`.

## Token value codecs — `ident` / `string` / `url`

Decode/encode escaped token text:

```js
import { ident, string, url } from 'css-tree';
string.decode('"a\\9 b"');   // 'a\tb'      (strip quotes + unescape)
string.encode('a "b"');      // '"a \\"b\\""'
url.decode('url(a\\ b.png)'); // 'a b.png'
ident.encode('a b');          // 'a\\ b'
```

## AST transforms

| Fn | Effect | Mutates input? |
|----|--------|----------------|
| `clone(ast)` | deep copy of an AST | no |
| `fromPlainObject(obj)` | arrays → `List` instances (makes a plain JSON AST walkable/mutable) | **yes** — `clone()` or `structuredClone()` first |
| `toPlainObject(ast)` | `List` → arrays (JSON-serialisable) | **yes** — clone first |

```js
const plain = toPlainObject(clone(ast));         // safe: original untouched
const live  = fromPlainObject(structuredClone(plainFromJson));
```

The skill's `toPlain` / `fromPlain` already clone for you.

## `List`

`children` are `List` instances, not arrays (Array-like API: `forEach`, `map`, `first`, `last`,
`each`, `filter`, `appendData`, `insert`, `remove`). Only `List` children are safe to mutate
during a `walk`. See <https://github.com/csstree/csstree/blob/master/docs/List.md>.

> Full docs: <https://github.com/csstree/csstree/blob/master/docs/utils.md>
