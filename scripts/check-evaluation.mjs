import { readFile } from 'node:fs/promises';
import { join } from 'node:path';
import { ROOT, normalizeNewlines } from './lib.mjs';
const OUTCOMES = ['challenge-before-build','evidence-and-falsifiable-experiment','bounded-stop-or-escalate','escalate'];
const idx=JSON.parse(normalizeNewlines(await readFile(join(ROOT,'skills-index.json'),'utf8')));
const available=new Set(idx.skills.map(x=>x.name));
const suite=JSON.parse(normalizeNewlines(await readFile(join(ROOT,'evaluation-cases.json'),'utf8')));
const errors=[], ids=new Set();
for (const c of suite.cases) {
  if (ids.has(c.id)) errors.push(`${c.id}: duplicate case id`);
  ids.add(c.id);
  const skills=c.expectedSkills ?? [];
  if (!skills.length) errors.push(`${c.id}: expectedSkills is empty`);
  for (const s of skills) if (!available.has(s)) errors.push(`${c.id}: missing ${s}`);
  if (c.expectedOutcome !== undefined && !OUTCOMES.includes(c.expectedOutcome)) errors.push(`${c.id}: invalid expectedOutcome ${c.expectedOutcome}`);
}
if (errors.length) { console.error(errors.join('\n')); process.exit(1); }
console.log(`Evaluation suite validates ${suite.cases.length} cases against ${available.size} skills`);
