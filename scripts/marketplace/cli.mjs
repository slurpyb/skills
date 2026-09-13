import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { readJSON, json, plan, writePlan, audit, exportChannel } from './lib.mjs';

const root = fileURLToPath(new URL('../../', import.meta.url));
const config = readJSON(path.join(root, 'marketplace.config.json'));
const command = process.argv[2];
if (!['generate', 'check', 'audit', 'release', 'export'].includes(command)) throw new Error('Use generate, check, audit, release, or export.');
if (command === 'export') {
  if (!process.argv[3] || !process.argv[4]) throw new Error('export <stable|wip|deprecated> <new-destination>');
  process.stdout.write(exportChannel(root, config, process.argv[3], path.resolve(process.argv[4])) + '\n');
} else if (command === 'generate' || command === 'check') {
  const differences = writePlan(root, plan(root, config), command === 'check');
  process.stdout.write(`${command}: ${differences.length} ${command === 'check' ? 'stale' : 'updated'} files\n`);
  if (command === 'check' && differences.length) { process.stderr.write(differences.join('\n') + '\n'); process.exitCode = 1; }
} else {
  if (writePlan(root, plan(root, config), true).length) throw new Error('Generated files are stale; run marketplace:generate.');
  const issues = audit(root, config);
  process.stdout.write(json({ portable: issues.length === 0, issues }));
  if (command === 'release' && issues.length) process.exitCode = 1;
}
