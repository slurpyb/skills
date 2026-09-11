# Validation — the lexer

The built-in `lexer` tests CSS against W3C syntaxes (backed by `mdn/data` plus vendor/legacy
patches). It checks **declaration values** and **at-rules**; it does not yet validate selectors.

```js
import { parse, lexer } from 'css-tree';

const value = parse('red 1px solid', { context: 'value' });
const m = lexer.matchProperty('border', value);
m.matched;                              // a match tree (truthy) when valid
m.error;                               // null when valid, else a SyntaxMatchError
m.isType(value.children.first, 'color'); // true
m.getTrace(value.children.first);        // [ {type:'Property',name:'border'}, {type:'Type',name:'color'}, … ]
```

## Methods (return `{ matched, error }` unless noted)

| Method | Checks |
|--------|--------|
| `lexer.matchProperty(name, value)` | a property's value (value may be an AST node or a string) |
| `lexer.matchType(typeName, value)` | a value against a named syntax type (e.g. `'color'`) |
| `lexer.matchAtrulePrelude(name, prelude)` | an at-rule prelude |
| `lexer.matchAtruleDescriptor(atrule, descriptor, value)` | an at-rule descriptor value |
| `lexer.checkPropertyName(name)` | returns an error if the property is unknown, else `null` |
| `lexer.checkAtruleName(name)` / `checkAtrulePrelude` / `checkAtruleDescriptorName` | name/shape sanity |
| `lexer.checkStructure(ast)` | the AST itself is structurally well-formed |

Error `name`s worth handling: `SyntaxError`, `SyntaxMatchError`, `SyntaxReferenceError`. A
`SyntaxMatchError` carries `.rawMessage === 'Mismatch'`, `.message` (detail) and `.loc`.

## The validate pattern (what this skill's `validateCss` ports)

Parse cheaply (`parseValue:false, parseRulePrelude:false, parseAtrulePrelude:false,
parseCustomProperty:false, positions:true`), then for each `Declaration` inside a `Rule` block:

```js
import { property } from 'css-tree';
if (property(decl.property).custom) return;          // never validate --custom-props
let err = lexer.checkPropertyName(decl.property);    // unknown property?
if (!err) err = lexer.matchProperty(decl.property, decl.value).error; // bad value?
```

For at-rules, `lexer.checkAtruleName(node.name)` flags unknown at-rules. (Per-descriptor value
checks via `matchAtruleDescriptor` are available but the skill helper does not run them, to avoid
false positives on `@font-face`-style descriptors.)

See the upstream `csstree/validator` for the full implementation:
<https://github.com/csstree/validator/blob/master/lib/validate.js>
