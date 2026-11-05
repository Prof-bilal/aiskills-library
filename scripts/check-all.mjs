import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { join } from 'node:path';

const scriptDir = fileURLToPath(new URL('.', import.meta.url));
const node = process.execPath;

const checks = [
  { name: 'build-index', args: ['--check'] },
  { name: 'validate-skills', args: [] },
  { name: 'check-links', args: [] },
  { name: 'check-evaluation', args: [] },
];

let anyFailed = false;

for (const check of checks) {
  const scriptPath = join(scriptDir, `${check.name}.mjs`);
  try {
    const output = execFileSync(node, [scriptPath, ...check.args], {
      encoding: 'utf8',
      stdio: 'pipe',
    });
    console.log(`PASS ${check.name}`);
    if (output.trim()) console.log(output.trim());
  } catch (err) {
    anyFailed = true;
    console.log(`FAIL ${check.name}`);
    if (err.stdout) console.log(err.stdout.toString().trim());
    if (err.stderr) console.error(err.stderr.toString().trim());
    if (err.message) console.error(err.message);
  }
}

if (anyFailed) {
  process.exit(1);
}