import { afterEach, describe, expect, test } from 'bun:test';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import Ajv from 'ajv/dist/2020.js';
import { readJSON, plan, writePlan, contained, discoverSkills, validateInventory, exportChannel, audit } from '../scripts/marketplace/lib.mjs';

const root = fileURLToPath(new URL('../', import.meta.url));
const config = readJSON(path.join(root, 'marketplace.config.json'));
const temporary = [];
function temp() { const dir = fs.mkdtempSync(path.join(fs.realpathSync(os.tmpdir()), 'marketplace-test-')); temporary.push(dir); return dir; }
afterEach(() => { for (const dir of temporary.splice(0)) fs.rmSync(dir, { recursive: true, force: true }); });

test('generated catalogs, manifests, and skill copies match their sources', () => {
  expect(writePlan(root, plan(root, config), true)).toEqual([]);
});

describe('platform discovery and isolation', () => {
  for (const [channelName, channel] of Object.entries(config.channels)) {
    test(`${channelName}: Codex and Cursor expose the same plugins and skills`, () => {
      const base = path.join(root, channel.root);
      const codex = readJSON(path.join(base, '.agents/plugins/marketplace.json'));
      const cursor = readJSON(path.join(base, '.cursor-plugin/marketplace.json'));
      const expected = config.plugins.filter(p => p.channel === channelName).map(p => p.name).sort();
      expect(codex.plugins.map(p => p.name).sort()).toEqual(expected);
      expect(cursor.plugins.map(p => p.name).sort()).toEqual(expected);
      expect(codex.name).toBe(channel.name);
      expect(cursor.name).toBe(channel.name);
      for (const entry of codex.plugins) {
        expect(entry.source.source).toBe('local');
        expect(entry.policy.installation).toBe('AVAILABLE');
        const codexRoot = contained(base, entry.source.path);
        const cursorEntry = cursor.plugins.find(p => p.name === entry.name);
        const cursorRoot = contained(base, cursorEntry.source);
        expect(fs.realpathSync(codexRoot)).toBe(fs.realpathSync(cursorRoot));
        const manifest = readJSON(path.join(codexRoot, 'plugin.json'));
        expect(manifest.name).toBe(entry.name);
        const native = readJSON(path.join(cursorRoot, '.cursor-plugin/plugin.json'));
        expect(native.name).toBe(entry.name);
        expect(native.version).toBe(manifest.version);
        if (native.skills) {
          const skillRoot = contained(cursorRoot, native.skills);
          const cursorSkills = fs.readdirSync(skillRoot).filter(n => fs.existsSync(path.join(skillRoot, n, 'SKILL.md'))).sort();
          expect(cursorSkills).toEqual(discoverSkills(codexRoot));
        } else expect(discoverSkills(codexRoot)).toEqual([]);
        if (channelName === 'stable') expect(entry.source.path).not.toMatch(/(?:wip|deprecated|packages)(?:\/|$)/);
      }
    });
  }
});

test('shared manifests validate against the pinned upstream schema', () => {
  const validate = new Ajv({ strict: false }).compile(readJSON(path.join(root, 'schemas/agent-plugin.schema.json')));
  for (const plugin of config.plugins) expect(validate(readJSON(path.join(root, plugin.path, 'plugin.json')))).toBe(true);
  expect(validate({ $schema: 'https://agent-plugins.org/schemas/1.0.0/plugin.schema.json', name: 'test', skills: './elsewhere' })).toBe(false);
  expect(validate({ $schema: 'https://agent-plugins.org/schemas/1.0.0/plugin.schema.json', name: '../bad' })).toBe(false);
});

test('inventory rejects omissions, duplicates, and channel leaks', () => {
  const omitted = structuredClone(config);
  omitted.plugins = omitted.plugins.filter(p => p.path !== 'plugins/react');
  expect(() => validateInventory(root, omitted)).toThrow('Uncatalogued plugin');
  const duplicate = structuredClone(config);
  duplicate.plugins.push(duplicate.plugins[0]);
  expect(() => validateInventory(root, duplicate)).toThrow('Duplicate plugin');
  const leak = structuredClone(config);
  leak.plugins.find(p => p.channel === 'wip').channel = 'stable';
  expect(() => validateInventory(root, leak)).toThrow('Opt-in');
  const missingFeature = structuredClone(config);
  missingFeature.plugins.find(p => p.name === 'pandacss').components = {};
  expect(() => validateInventory(root, missingFeature)).toThrow('Uncatalogued rules');
});

test('path checks reject traversal, absolute paths, and symlink escapes', () => {
  const dir = temp();
  expect(() => contained(dir, '../escape')).toThrow();
  expect(() => contained(dir, '/tmp')).toThrow();
  fs.symlinkSync('/tmp', path.join(dir, 'outside'));
  expect(() => contained(dir, 'outside/file')).toThrow();
});

test('an intentional root alias and new output directories are supported', () => {
  const dir = temp();
  fs.mkdirSync(path.join(dir, 'actual'));
  fs.symlinkSync(path.join(dir, 'actual'), path.join(dir, 'alias'));
  expect(contained(path.join(dir, 'alias'), 'new/file')).toBe(path.join(dir, 'alias/new/file'));
  expect(contained(path.join(dir, 'missing'), 'file')).toBe(path.join(dir, 'missing/file'));
});

test('Pi consumes the stable packaged skills without reloading source copies', () => {
  expect(readJSON(path.join(root, 'package.json')).pi.skills).toEqual(['plugins/*/skills']);
  expect(config.plugins.filter(p => p.channel === 'stable').every(p => p.path.startsWith('plugins/'))).toBe(true);
});

test('stale-file checks detect corruption without overwriting it', () => {
  const dir = temp();
  fs.writeFileSync(path.join(dir, 'plugin.json'), 'corrupt');
  expect(writePlan(dir, new Map([['plugin.json', Buffer.from('{}')]]), true)).toEqual(['plugin.json']);
  expect(fs.readFileSync(path.join(dir, 'plugin.json'), 'utf8')).toBe('corrupt');
});

test('nested skill files are not silently treated as discoverable', () => {
  const dir = temp();
  fs.mkdirSync(path.join(dir, 'skills/group/nested'), { recursive: true });
  fs.writeFileSync(path.join(dir, 'skills/group/nested/SKILL.md'), 'nested');
  expect(discoverSkills(dir)).toEqual([]);
});

test('an opt-in export stands alone after relocation', () => {
  const dir = temp();
  const destination = path.join(dir, 'export');
  exportChannel(root, config, 'wip', destination);
  const moved = path.join(dir, 'relocated');
  fs.renameSync(destination, moved);
  const catalog = readJSON(path.join(moved, '.agents/plugins/marketplace.json'));
  for (const entry of catalog.plugins) {
    const pluginRoot = contained(moved, entry.source.path);
    expect(readJSON(path.join(pluginRoot, 'plugin.json')).name).toBe(entry.name);
    const original = config.plugins.find(p => p.name === entry.name && p.channel === 'wip');
    expect(discoverSkills(pluginRoot)).toEqual(discoverSkills(path.join(root, original.path)));
    for (const skill of discoverSkills(pluginRoot)) expect(fs.readFileSync(path.join(pluginRoot, 'skills', skill, 'SKILL.md'))).toEqual(fs.readFileSync(path.join(root, original.path, 'skills', skill, 'SKILL.md')));
  }
  expect(fs.existsSync(path.join(moved, 'deprecated'))).toBe(false);
  expect(fs.existsSync(path.join(moved, 'plugins/react'))).toBe(false);
});

test('behavior audit does not equate native components with portable skills', () => {
  const fixture = temp();
  fs.cpSync(path.join(root, 'schemas'), path.join(fixture, 'schemas'), { recursive: true });
  fs.mkdirSync(path.join(fixture, 'skills/example'), { recursive: true });
  fs.writeFileSync(path.join(fixture, 'skills/example/SKILL.md'), '---\nname: example\ndescription: A test skill.\n---\n');
  fs.writeFileSync(path.join(fixture, 'plugin.json'), JSON.stringify({ $schema: 'https://agent-plugins.org/schemas/1.0.0/plugin.schema.json', name: 'fixture' }));
  fs.mkdirSync(path.join(fixture, 'hooks'));
  fs.writeFileSync(path.join(fixture, 'hooks/hooks.json'), '{}');
  fs.writeFileSync(path.join(fixture, 'mcp.json'), JSON.stringify({ $schema: 'https://agent-plugins.org/schemas/1.0.0/mcp.schema.json', mcpServers: { test: { type: 'streamable-http', url: 'https://example.com/${TOKEN}' } } }));
  const issues = audit(fixture, { plugins: [{ name: 'fixture', path: '.', channel: 'stable', components: { rules: ['rules'] } }] });
  expect(issues.some(i => i.code === 'native-rules')).toBe(true);
  expect(issues.some(i => i.code === 'native-hooks')).toBe(true);
  expect(issues.some(i => i.code === 'mcp-credentials')).toBe(true);
});
