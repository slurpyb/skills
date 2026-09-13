import fs from 'node:fs';
import path from 'node:path';
import { createHash } from 'node:crypto';
import Ajv from 'ajv/dist/2020.js';
import YAML from 'yaml';

export const PLUGIN_SCHEMA = 'https://agent-plugins.org/schemas/1.0.0/plugin.schema.json';
export const MCP_SCHEMA = 'https://agent-plugins.org/schemas/1.0.0/mcp.schema.json';
export const readJSON = file => JSON.parse(fs.readFileSync(file, 'utf8'));
export const json = value => JSON.stringify(value, null, 2) + '\n';
const hash = bytes => createHash('sha256').update(bytes).digest('hex');
const exists = file => fs.existsSync(file);
const children = dir => exists(dir) ? fs.readdirSync(dir).sort() : [];

export function contained(root, relative) {
  if (path.isAbsolute(relative)) throw new Error(`Absolute path: ${relative}`);
  const base = path.resolve(root);
  const resolved = path.resolve(base, relative);
  const inside = (candidate, boundary) => candidate === boundary || candidate.startsWith(boundary + path.sep);
  if (!inside(resolved, base)) throw new Error(`Path escapes root: ${relative}`);
  let rootAncestor = base;
  while (!exists(rootAncestor)) rootAncestor = path.dirname(rootAncestor);
  const realRoot = path.join(fs.realpathSync(rootAncestor), path.relative(rootAncestor, base));
  let ancestor = resolved;
  while (!exists(ancestor)) ancestor = path.dirname(ancestor);
  const realTarget = path.join(fs.realpathSync(ancestor), path.relative(ancestor, resolved));
  if (!inside(realTarget, realRoot)) throw new Error(`Symlink escapes root: ${relative}`);
  return resolved;
}

export function files(root, relative = '') {
  const result = [];
  for (const name of children(path.join(root, relative))) {
    if (['.git', 'node_modules', '.DS_Store', '__pycache__'].includes(name)) continue;
    const rel = path.join(relative, name);
    const full = contained(root, rel);
    if (fs.lstatSync(full).isSymbolicLink()) throw new Error(`Distribute real files, not symlinks: ${rel}`);
    if (fs.statSync(full).isDirectory()) result.push(...files(root, rel));
    else result.push(rel);
  }
  return result;
}

export function discoverSkills(root) {
  return children(path.join(root, 'skills')).filter(name => exists(path.join(root, 'skills', name, 'SKILL.md')));
}

export function validateInventory(root, config) {
  const names = new Set();
  const paths = new Set();
  for (const item of config.plugins) {
    const channel = config.channels[item.channel];
    if (!channel) throw new Error(`Unknown channel: ${item.channel}`);
    contained(root, item.path);
    if (names.has(`${item.channel}:${item.name}`) || paths.has(item.path)) throw new Error(`Duplicate plugin: ${item.path}`);
    names.add(`${item.channel}:${item.name}`); paths.add(item.path);
    if (item.channel === 'stable' && /^(wip|deprecated|packages)(\/|$)/.test(item.path)) throw new Error(`Opt-in or alias path in stable: ${item.path}`);
    contained(path.resolve(root, channel.root), path.relative(path.resolve(root, channel.root), path.resolve(root, item.path)));
    for (const copy of item.skillCopies ?? []) {
      contained(root, copy.source);
      if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(copy.name)) throw new Error(`Invalid copy name: ${copy.name}`);
    }
    for (const copy of item.contentCopies ?? []) {
      contained(root, copy.source);
      if (path.isAbsolute(copy.destination) || /^\.\.(?:\/|$)/.test(path.normalize(copy.destination))) throw new Error(`Copy escapes plugin: ${copy.destination}`);
      contained(root, path.join(item.path, copy.destination));
    }
    for (const [kind, candidates] of Object.entries({ agents: ['agents'], commands: ['commands', 'instructions', 'prompts'], rules: ['rules'] })) {
      for (const candidate of candidates) {
        if (exists(path.join(root, item.path, candidate)) && !(item.components[kind] ?? []).includes(candidate)) throw new Error(`Uncatalogued ${kind}: ${item.path}/${candidate}`);
      }
    }
    for (const name of children(path.join(root, item.path))) {
      const skill = path.posix.join(item.path, name);
      if (exists(path.join(root, skill, 'SKILL.md')) && !(item.skillCopies ?? []).some(c => c.source === skill)) throw new Error(`Undiscoverable root skill: ${skill}`);
    }
  }
  for (const channel of Object.values(config.channels)) {
    const dir = path.join(channel.root, 'plugins');
    for (const name of children(path.join(root, dir))) {
      const rel = path.posix.join(dir, name);
      if (fs.statSync(path.join(root, rel)).isDirectory() && !paths.has(rel)) throw new Error(`Uncatalogued plugin: ${rel}`);
    }
  }
  const copies = new Set(config.plugins.flatMap(p => (p.skillCopies ?? []).map(s => s.source)));
  for (const name of children(path.join(root, '.agents/skills'))) {
    if (exists(path.join(root, '.agents/skills', name, 'SKILL.md')) && !copies.has(`.agents/skills/${name}`)) throw new Error(`Uncatalogued installed skill: ${name}`);
  }
  for (const channel of Object.values(config.channels)) {
    const dir = path.posix.join(channel.root, 'skills');
    if (exists(path.join(root, dir)) && !paths.has(channel.root)) {
      for (const name of children(path.join(root, dir))) {
        if (exists(path.join(root, dir, name, 'SKILL.md')) && !copies.has(`${dir}/${name}`)) throw new Error(`Uncatalogued loose skill: ${dir}/${name}`);
      }
    }
  }
}

export function plan(root, config) {
  validateInventory(root, config);
  const output = new Map();
  const put = (file, value) => output.set(file, Buffer.from(json(value)));
  for (const item of config.plugins) {
    const base = item.path;
    const metadata = Object.fromEntries(['name', 'version', 'description', 'author', 'homepage', 'repository', 'license', 'keywords'].filter(k => item[k] !== undefined).map(k => [k, item[k]]));
    const manifest = { $schema: PLUGIN_SCHEMA, ...metadata };
    put(path.join(base, 'plugin.json'), manifest);
    const skills = exists(path.join(root, base, 'skills')) || item.skillCopies?.length;
    const native = { ...metadata, ...(skills ? { skills: './skills/' } : {}) };
    for (const [kind, dirs] of Object.entries(item.components)) native[kind] = dirs.map(d => `./${d}/`);
    const mcpSource = ['mcp.json', '.mcp.json'].find(p => exists(path.join(root, base, p)));
    if (mcpSource) {
      const mcp = readJSON(path.join(root, base, mcpSource));
      for (const server of Object.values(mcp.mcpServers ?? {})) {
        if (server.type === 'http') server.type = 'streamable-http';
        if (!server.type) server.type = server.command ? 'stdio' : 'streamable-http';
      }
      put(path.join(base, 'mcp.json'), { $schema: MCP_SCHEMA, ...mcp });
      native.mcpServers = './mcp.json';
    }
    // Hooks require a reviewed adapter; a Claude event name is not a Cursor event name.
    if (exists(path.join(root, base, 'hooks/hooks.json'))) native.hooks = { hooks: {} };
    if (native.author) native.author = Object.fromEntries(Object.entries(native.author).filter(([k]) => ['name', 'email'].includes(k)));
    put(path.join(base, '.cursor-plugin/plugin.json'), native);
    put(path.join(base, '.codex-plugin/plugin.json'), {
      ...metadata, ...(skills ? { skills: './skills/' } : {}),
      ...(mcpSource ? { mcpServers: './mcp.json' } : {}),
      interface: item.codexInterface ?? { displayName: item.name, shortDescription: item.description.slice(0, 100) },
    });
    for (const copy of item.skillCopies ?? []) {
      for (const file of files(path.join(root, copy.source))) {
        output.set(path.join(base, 'skills', copy.name, file), fs.readFileSync(path.join(root, copy.source, file)));
      }
    }
    for (const copy of item.contentCopies ?? []) {
      for (const file of files(path.join(root, copy.source))) output.set(path.join(base, copy.destination, file), fs.readFileSync(path.join(root, copy.source, file)));
    }
  }
  for (const [key, channel] of Object.entries(config.channels)) {
    const entries = config.plugins.filter(p => p.channel === key).map(p => ({ name: p.name, description: p.description, source: './' + path.relative(channel.root, p.path) }));
    put(path.join(channel.root, '.cursor-plugin/marketplace.json'), {
      name: channel.name, owner: { name: 'Jordan Sweeting' }, metadata: { description: channel.description }, plugins: entries,
    });
    put(path.join(channel.root, '.claude-plugin/marketplace.json'), {
      name: channel.name, owner: { name: 'Jordan Sweeting' }, metadata: { description: channel.description }, plugins: entries,
    });
    put(path.join(channel.root, '.agents/plugins/marketplace.json'), {
      name: channel.name, interface: { displayName: channel.description },
      plugins: entries.map(p => ({ name: p.name, source: { source: 'local', path: p.source }, policy: { installation: 'AVAILABLE', authentication: 'ON_INSTALL' }, category: 'Productivity' })),
    });
  }
  put('marketplace.generated.json', Object.fromEntries([...output].map(([file, bytes]) => [file, hash(bytes)])));
  return output;
}

export function writePlan(root, output, check = false) {
  const different = [];
  const ownership = path.join(root, 'marketplace.generated.json');
  if (output.has('marketplace.generated.json') && exists(ownership)) {
    for (const [file, digest] of Object.entries(readJSON(ownership))) {
      if (output.has(file)) continue;
      const target = contained(root, file);
      if (!exists(target)) continue;
      different.push(file);
      if (!check) {
        if (hash(fs.readFileSync(target)) !== digest) throw new Error(`Retired generated file was edited; preserve or relocate it before regenerating: ${file}`);
        fs.unlinkSync(target);
      }
    }
  }
  for (const [file, bytes] of output) {
    const target = contained(root, file);
    if (!exists(target) || !fs.readFileSync(target).equals(bytes)) {
      different.push(file);
      if (!check) { fs.mkdirSync(path.dirname(target), { recursive: true }); fs.writeFileSync(target, bytes); }
    }
  }
  return different;
}

export function audit(root, config) {
  const ajv = new Ajv({ allErrors: true, strict: false });
  const pluginValid = ajv.compile(readJSON(path.join(root, 'schemas/agent-plugin.schema.json')));
  const mcpValid = ajv.compile(readJSON(path.join(root, 'schemas/agent-mcp.schema.json')));
  const issues = [];
  const add = (plugin, code, detail) => issues.push({ plugin: plugin.name, channel: plugin.channel, code, detail });
  for (const item of config.plugins) {
    const dir = path.join(root, item.path);
    if (!pluginValid(readJSON(path.join(dir, 'plugin.json')))) add(item, 'manifest-schema', ajv.errorsText(pluginValid.errors));
    const skills = discoverSkills(dir);
    if (!skills.length) add(item, 'no-portable-skills', 'No discoverable skills; verify this plugin has a tested portable runtime capability.');
    for (const name of skills) {
      const text = fs.readFileSync(path.join(dir, 'skills', name, 'SKILL.md'), 'utf8');
      try {
        const match = text.match(/^---\r?\n([\s\S]*?)\r?\n---(?:\r?\n|$)/);
        if (!match) throw new Error('Missing YAML frontmatter');
        const fm = YAML.parse(match[1]);
        if (fm.name !== name || typeof fm.description !== 'string' || !fm.description.trim()) throw new Error('Name must match directory and description must be nonempty');
      } catch (error) { add(item, 'skill-frontmatter', `${name}: ${error.message}`); }
    }
    for (const [kind, dirs] of Object.entries(item.components)) {
      if (dirs.length) add(item, `native-${kind}`, `${dirs.join(', ')} needs a Codex/Cursor behavior adapter and contract test.`);
    }
    if (exists(path.join(dir, 'hooks/hooks.json'))) add(item, 'native-hooks', 'Hook event, input, output, and lifecycle behavior need a tested Cursor adapter.');
    const mcpFile = path.join(dir, 'mcp.json');
    if (exists(mcpFile)) {
      const mcp = readJSON(mcpFile);
      if (!mcpValid(mcp)) add(item, 'mcp-schema', ajv.errorsText(mcpValid.errors));
      for (const [name, server] of Object.entries(mcp.mcpServers ?? {})) {
        if (server.type !== 'stdio' && /\$\{/.test(JSON.stringify(server))) add(item, 'mcp-credentials', `${name}: portable HTTP configuration cannot interpolate environment variables.`);
        if (server.type === 'stdio' && /\$\{(?!PLUGIN_ROOT\}|PLUGIN_DATA\})/.test(JSON.stringify(server))) add(item, 'mcp-environment', `${name}: nonportable environment interpolation.`);
      }
    }
  }
  return issues;
}

export function exportChannel(root, config, channelName, destination) {
  const channel = config.channels[channelName];
  if (!channel) throw new Error(`Unknown channel: ${channelName}`);
  if (exists(destination)) throw new Error(`Export destination must be new: ${destination}`);
  const stale = writePlan(root, plan(root, config), true);
  if (stale.length) throw new Error('Generate current manifests before exporting.');
  fs.mkdirSync(destination, { recursive: true });
  const copyFile = (source, target) => {
    fs.mkdirSync(path.dirname(target), { recursive: true });
    fs.copyFileSync(source, target);
    fs.chmodSync(target, fs.statSync(source).mode & 0o777);
  };
  for (const item of config.plugins.filter(p => p.channel === channelName)) {
    const source = path.join(root, item.path);
    const target = contained(destination, path.relative(channel.root, item.path));
    fs.mkdirSync(target, { recursive: true });
    const selected = item.path === channel.root
      ? ['plugin.json', '.codex-plugin/plugin.json', '.cursor-plugin/plugin.json', ...['skills', ...Object.values(item.components).flat()].flatMap(d => files(path.join(source, d)).map(f => path.join(d, f)))]
      : files(source);
    for (const file of selected) copyFile(path.join(source, file), contained(target, file));
  }
  for (const file of ['.agents/plugins/marketplace.json', '.cursor-plugin/marketplace.json', '.claude-plugin/marketplace.json']) copyFile(path.join(root, channel.root, file), path.join(destination, file));
  return destination;
}
