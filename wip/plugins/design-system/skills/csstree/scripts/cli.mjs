#!/usr/bin/env node
/**
 * csstree CLI — a thin, deterministic wrapper over csstree-helpers.mjs.
 * JSON to stdout; `validate` exits non-zero on problems so it drops into a build gate.
 */
import { readFile } from 'node:fs/promises';
import {
  extractCustomProperties,
  extractDeclarations,
  validateCss,
  diffCustomProperties,
  renameSelector,
  parseCss,
  toPlain,
  generateCss,
  fromPlain,
} from './csstree-helpers.mjs';

const [, , command, ...args] = process.argv;

// positional args (everything that isn't a --flag or a flag's value) and flags
const positionals = [];
const flags = new Map();
for (let i = 0; i < args.length; i++) {
  if (args[i].startsWith('--')) {
    flags.set(args[i].slice(2), args[i + 1]);
    i++;
  } else {
    positionals.push(args[i]);
  }
}

function fail(message) {
  console.error(`error: ${message}`);
  process.exit(2);
}

async function read(path) {
  if (!path) fail('missing file argument');
  try {
    return await readFile(path, 'utf8');
  } catch (cause) {
    return fail(`cannot read ${path}: ${cause.message}`);
  }
}

const USAGE = `csstree — CSS AST toolkit (css-tree)

Usage:
  node cli.mjs extract-tokens <file.css>            List CSS custom properties as JSON
  node cli.mjs declarations <file.css> [--selector S]  List declarations (optionally one selector)
  node cli.mjs validate <file.css>                 Validate vs W3C specs (exit 1 if invalid)
  node cli.mjs diff-tokens <a.css> <b.css>         Compare custom properties between two files
  node cli.mjs rename-class <file.css> <from> <to> Rename a class selector everywhere
  node cli.mjs ast <file.css> [--context T]        Print the AST as JSON (toPlainObject)
  node cli.mjs generate <ast.json>                 Generate CSS from an AST JSON file
`;

try {
  switch (command) {
    case 'extract-tokens': {
      const css = await read(positionals[0]);
      console.log(JSON.stringify(extractCustomProperties(css), null, 2));
      break;
    }
    case 'declarations': {
      const css = await read(positionals[0]);
      const selector = flags.get('selector');
      console.log(JSON.stringify(extractDeclarations(css, { selector }), null, 2));
      break;
    }
    case 'validate': {
      const css = await read(positionals[0]);
      const { valid, errors } = validateCss(css);
      if (valid) {
        console.log(`ok: ${positionals[0]} is valid`);
        break;
      }
      for (const e of errors) {
        const where = e.line ? ` (${e.line}:${e.column})` : '';
        console.error(`${e.property || e.atrule || 'css'}${where}: ${e.message}`);
      }
      console.error(`\n${errors.length} problem(s)`);
      process.exit(1);
    }
    case 'diff-tokens': {
      const a = await read(positionals[0]);
      const b = await read(positionals[1]);
      console.log(JSON.stringify(diffCustomProperties(a, b), null, 2));
      break;
    }
    case 'rename-class': {
      const css = await read(positionals[0]);
      const [, from, to] = positionals;
      if (!from || !to) fail('usage: rename-class <file.css> <from> <to>');
      console.log(renameSelector(css, from, to));
      break;
    }
    case 'ast': {
      const css = await read(positionals[0]);
      const context = flags.get('context');
      console.log(JSON.stringify(toPlain(parseCss(css, context ? { context } : {})), null, 2));
      break;
    }
    case 'generate': {
      const json = await read(positionals[0]);
      let obj;
      try {
        obj = JSON.parse(json);
      } catch (cause) {
        fail(`invalid JSON: ${cause.message}`);
      }
      console.log(generateCss(fromPlain(obj)));
      break;
    }
    default:
      console.log(USAGE);
      process.exit(command ? 2 : 0);
  }
} catch (error) {
  fail(error.message);
}
