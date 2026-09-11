/**
 * csstree-helpers — generic, reusable helpers over the css-tree AST.
 *
 * Design rules (match the user's engineering principles):
 *  - Pure by default: read helpers return new data and never mutate their input.
 *    The one explicit transform (renameSelector) only mutates an AST it just parsed.
 *  - Guard inputs at the boundary; fail loud and early on bad input.
 *  - Thin wrappers — the raw css-tree namespace is re-exported as `csstree` for
 *    anything not covered here.
 *
 * Requires `css-tree` to be resolvable. This skill ships its own package.json;
 * run `npm install --prefix ~/.claude/skills/csstree` once.
 */

const ns = await importCsstree();
const lib = ns.parse ? ns : (ns.default ?? ns);
const { parse, walk, generate, property, toPlainObject, fromPlainObject, clone, lexer } = lib;

/** Re-exported raw namespace — escape hatch for anything not wrapped below. */
export const csstree = lib;

async function importCsstree() {
  try {
    return await import('css-tree');
  } catch (cause) {
    throw new Error(
      'css-tree is not installed. Run `npm install --prefix ~/.claude/skills/csstree` ' +
        '(or `npm install css-tree` in your project).',
      { cause },
    );
  }
}

function assertString(value, label) {
  if (typeof value !== 'string') {
    throw new TypeError(
      `${label} must be a string, received ${value === null ? 'null' : typeof value}`,
    );
  }
}

function startLoc(node) {
  return node && node.loc
    ? { line: node.loc.start.line, column: node.loc.start.column, offset: node.loc.start.offset }
    : null;
}

/**
 * Parse CSS into a css-tree AST.
 * @param {string} source
 * @param {object} [options] css-tree parse options + `{ tolerant }`.
 *   By default parse errors throw; `{ tolerant: true }` collects them instead.
 * @returns {object} AST
 */
export function parseCss(source, options = {}) {
  assertString(source, 'source');
  const { tolerant = false, onParseError: userOnParseError, ...rest } = options;
  const errors = [];
  const ast = parse(source, {
    positions: true,
    ...rest,
    onParseError(error) {
      errors.push(error);
      if (typeof userOnParseError === 'function') userOnParseError(error);
    },
  });
  if (!tolerant && errors.length > 0) {
    const first = errors[0];
    throw new Error(`CSS parse error: ${first.formattedMessage || first.message}`);
  }
  return ast;
}

/**
 * Extract every CSS custom property (`--name: value`) from a stylesheet.
 * Regex-free replacement for hand-rolled token readers.
 * @param {string} source
 * @returns {Array<{ name: string, value: string, loc: object|null }>}
 */
export function extractCustomProperties(source) {
  assertString(source, 'source');
  const ast = parse(source, { positions: true });
  const result = [];
  walk(ast, {
    visit: 'Declaration',
    enter(node) {
      if (!property(node.property).custom) return;
      result.push({
        name: node.property,
        value: generate(node.value).trim(),
        loc: startLoc(node),
      });
    },
  });
  return result;
}

/**
 * Extract all declarations, optionally filtered to one selector.
 * @param {string} source
 * @param {{ selector?: string }} [opts] exact selector text to match (e.g. ".btn", ":root")
 * @returns {Array<{ property: string, value: string, important: boolean, loc: object|null }>}
 */
export function extractDeclarations(source, { selector } = {}) {
  assertString(source, 'source');
  const ast = parse(source, { positions: true });
  const result = [];
  walk(ast, {
    visit: 'Declaration',
    enter(node) {
      if (selector) {
        const rule = this.rule;
        const prelude = rule && rule.prelude ? generate(rule.prelude) : '';
        const selectors = prelude.split(',').map((s) => s.trim());
        if (!selectors.includes(selector)) return;
      }
      result.push({
        property: node.property,
        value: generate(node.value).trim(),
        important: Boolean(node.important),
        loc: startLoc(node),
      });
    },
  });
  return result;
}

/**
 * Validate CSS against W3C syntaxes via the css-tree lexer.
 * Ports the logic of `csstree/validator`: checks property names and declaration
 * values, skips custom properties, and reports tolerant parse errors. Declaration
 * descriptors inside at-rules (e.g. @font-face) are not value-checked.
 * @param {string} source
 * @returns {{ valid: boolean, errors: Array<{ property?: string, atrule?: string, message: string, line: number|null, column: number|null }> }}
 */
export function validateCss(source) {
  assertString(source, 'source');
  const errors = [];
  const ast = parse(source, {
    positions: true,
    parseAtrulePrelude: false,
    parseRulePrelude: false,
    parseValue: false,
    parseCustomProperty: false,
    onParseError(error) {
      errors.push({ message: error.message, ...locFields(error.loc) });
    },
  });

  walk(ast, {
    visit: 'Rule',
    enter(node) {
      collectDeclarationErrors(node, errors);
    },
  });

  walk(ast, {
    visit: 'Atrule',
    enter(node) {
      const nameError = isTargetError(lexer.checkAtruleName(node.name));
      if (nameError) {
        errors.push({ atrule: node.name, message: nameError.message, ...locFields(node.loc) });
      }
    },
  });

  return { valid: errors.length === 0, errors };
}

function collectDeclarationErrors(ruleNode, errors) {
  const block = ruleNode.block;
  if (!block || !block.children) return;
  block.children.forEach((child) => {
    if (child.type !== 'Declaration') return;
    if (property(child.property).custom) return;

    let error = isTargetError(lexer.checkPropertyName(child.property));
    if (error) {
      errors.push({ property: child.property, message: error.message, ...locFields(child.loc) });
      return;
    }
    error = isTargetError(lexer.matchProperty(child.property, child.value).error);
    if (error) {
      errors.push({
        property: child.property,
        message: error.message,
        ...locFields(error.loc || child.loc),
      });
    }
  });
}

function isTargetError(error) {
  if (!error) return null;
  const known = error.name === 'SyntaxError' ||
    error.name === 'SyntaxMatchError' ||
    error.name === 'SyntaxReferenceError';
  return known ? error : null;
}

function locFields(loc) {
  return loc
    ? { line: loc.start.line, column: loc.start.column }
    : { line: null, column: null };
}

/**
 * Diff custom properties between two stylesheets — a generic token-parity check.
 * @param {string} aSource baseline / source of truth
 * @param {string} bSource generated / candidate
 * @returns {{ exact: Array, changed: Array, missing: Array, added: Array }}
 *   missing = in A but not B; added = in B but not A.
 */
export function diffCustomProperties(aSource, bSource) {
  assertString(aSource, 'aSource');
  assertString(bSource, 'bSource');
  const a = new Map(extractCustomProperties(aSource).map((t) => [t.name, t.value]));
  const b = new Map(extractCustomProperties(bSource).map((t) => [t.name, t.value]));
  const exact = [];
  const changed = [];
  const missing = [];
  const added = [];
  for (const [name, value] of a) {
    if (!b.has(name)) {
      missing.push({ name, value });
    } else if (b.get(name) === value) {
      exact.push({ name, value });
    } else {
      changed.push({ name, from: value, to: b.get(name) });
    }
  }
  for (const [name, value] of b) {
    if (!a.has(name)) added.push({ name, value });
  }
  return { exact, changed, missing, added };
}

/**
 * Rename a class selector everywhere (source-to-source transform).
 * @param {string} source
 * @param {string} from class name without the leading dot (e.g. "old")
 * @param {string} to class name without the leading dot (e.g. "new")
 * @returns {string} transformed CSS
 */
export function renameSelector(source, from, to) {
  assertString(source, 'source');
  assertString(from, 'from');
  assertString(to, 'to');
  const ast = parse(source);
  walk(ast, {
    visit: 'ClassSelector',
    enter(node) {
      if (node.name === from) node.name = to;
    },
  });
  return generate(ast);
}

/** Serialize an AST node back to a CSS string. */
export function generateCss(ast) {
  if (!ast || typeof ast !== 'object' || typeof ast.type !== 'string') {
    throw new TypeError('generateCss expects a css-tree AST node');
  }
  return generate(ast);
}

/** AST → plain JSON object (arrays instead of List). Does not mutate the input. */
export function toPlain(ast) {
  if (!ast || typeof ast !== 'object' || typeof ast.type !== 'string') {
    throw new TypeError('toPlain expects a css-tree AST node');
  }
  return toPlainObject(clone(ast));
}

/** Plain JSON object → AST (List instead of arrays). Does not mutate the input. */
export function fromPlain(object) {
  if (!object || typeof object !== 'object' || typeof object.type !== 'string') {
    throw new TypeError('fromPlain expects a plain AST object with a `type`');
  }
  return fromPlainObject(structuredClone(object));
}
