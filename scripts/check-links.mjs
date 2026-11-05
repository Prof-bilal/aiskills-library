import { execFileSync } from 'node:child_process';
import { access, readFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { ROOT, normalizeNewlines } from './lib.mjs';
const files = execFileSync('git', ['ls-files', '-z', '--', '*.md'], { cwd: ROOT, encoding: 'utf8' }).split('\0').filter(Boolean);
const errors = [];
for (const f of files) {
  const text = normalizeNewlines(await readFile(join(ROOT, f), 'utf8'));
  for (const m of text.matchAll(/\]\(([^)\s]+)(?:\s+"[^"]*")?\)/g)) {
    const raw = m[1];
    if (/^[a-z][a-z0-9+.-]*:/i.test(raw) || raw.startsWith('//') || raw.startsWith('#')) continue;
    const target = raw.split('#')[0].split('?')[0];
    if (!target) continue;
    try { await access(join(dirname(join(ROOT, f)), target)); }
    catch { errors.push(`${f}: missing link ${raw}`); }
  }
}
if (errors.length) { console.error(errors.join('\n')); process.exit(1); }
console.log(`Checked links in ${files.length} Markdown files`);
