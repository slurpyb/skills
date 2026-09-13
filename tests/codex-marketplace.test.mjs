import { test, expect } from 'bun:test';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { readJSON, discoverSkills } from '../scripts/marketplace/lib.mjs';

test.skipIf(!process.env.CODEX_BIN)('Codex registers, enumerates, and installs from each isolated channel', () => {
  const root = fileURLToPath(new URL('../', import.meta.url));
  const config = readJSON(path.join(root, 'marketplace.config.json'));
  const profile = fs.mkdtempSync(path.join(os.tmpdir(), 'codex-marketplace-test-'));
  const run = args => {
    const result = spawnSync(process.env.CODEX_BIN, args, { encoding: 'utf8', env: { ...process.env, CODEX_HOME: profile } });
    if (result.status !== 0) throw new Error(result.stderr || result.error?.message);
    return JSON.parse(result.stdout);
  };
  try {
    for (const [name, channel] of Object.entries(config.channels)) {
      const added = run(['plugin', 'marketplace', 'add', path.join(root, channel.root), '--json']);
      expect(added.marketplaceName).toBe(channel.name);
      const listed = run(['plugin', 'list', '--marketplace', channel.name, '--available', '--json']);
      expect(listed.installed).toEqual([]);
      expect(listed.available.map(p => p.name).sort()).toEqual(config.plugins.filter(p => p.channel === name).map(p => p.name).sort());
      const sample = { stable: 'slurpyb-skills', wip: 'slurpyb-wip-skills', deprecated: 'sbx-agent' }[name];
      const installed = run(['plugin', 'add', `${sample}@${channel.name}`, '--json']);
      expect(fs.realpathSync(installed.installedPath).startsWith(fs.realpathSync(profile) + path.sep)).toBe(true);
      const source = config.plugins.find(p => p.channel === name && p.name === sample);
      expect(discoverSkills(installed.installedPath)).toEqual(discoverSkills(path.join(root, source.path)));
    }
  } finally { fs.rmSync(profile, { recursive: true, force: true }); }
});
