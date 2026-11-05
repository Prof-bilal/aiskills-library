import { readdir, readFile } from 'node:fs/promises';
import { join } from 'node:path';
import { ROOT, CATEGORIES, normalizeNewlines } from './lib.mjs';
const root = ROOT, errors = [], names = new Set();
for (const category of CATEGORIES) {
  for (const entry of await readdir(join(root, 'skills', category), { withFileTypes: true })) {
    if (!entry.isDirectory()) continue;
    const name = entry.name, file = join(root, 'skills', category, name, 'SKILL.md');
    let source; try { source = normalizeNewlines(await readFile(file, 'utf8')); } catch (err) { errors.push(`${category}/${name}: ${err.code === 'ENOENT' ? 'missing SKILL.md' : `cannot read SKILL.md (${err.code})`}`); continue; }
    const fm = source.match(/^---\n([\s\S]*?)\n---/); if (!fm) { errors.push(`${category}/${name}: missing frontmatter`); continue; }
    const nf = fm[1].match(/^name:\s*(\S+)$/m)?.[1], d = fm[1].match(/^description:\s*(.+)$/m)?.[1]?.trim();
    if (nf !== name) errors.push(`${category}/${name}: name mismatch`);
    if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(name) || name.length > 64) errors.push(`${category}/${name}: invalid name`);
    if (!d || d.length > 1024) errors.push(`${category}/${name}: invalid description`);
    if (source.split('\n').length > 500) errors.push(`${category}/${name}: over 500 lines`);
    for (const heading of ['## Workflow', '## Verification', '## Output contract']) if (!source.includes(heading)) errors.push(`${category}/${name}: missing ${heading}`);
    if (names.has(name)) errors.push(`duplicate skill: ${name}`); names.add(name);
    for (const m of source.matchAll(/\]\(([^)]+)\)/g)) { if (m[1].startsWith('http')) continue; try { await readFile(join(root, 'skills', category, name, m[1])); } catch (err) { if (err.code !== 'ENOENT') { errors.push(`${category}/${name}: cannot read link ${m[1]} (${err.code})`); continue; } errors.push(`${category}/${name}: missing link ${m[1]}`); } }
  }
}
const links = JSON.parse(await readFile(join(root, 'sources.json'), 'utf8'));
for (const s of links.sources) if (!/^https:\/\//.test(s.url)) errors.push(`${s.id}: source URL must be HTTPS`);
if (errors.length) { console.error(errors.join('\n')); process.exit(1); }
console.log(`Validated ${names.size} skills and ${links.sources.length} sources`);
