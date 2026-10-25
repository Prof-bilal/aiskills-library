import { readFile } from 'node:fs/promises';
import { join } from 'node:path';
const root=new URL('..',import.meta.url).pathname;
const idx=JSON.parse(await readFile(join(root,'skills-index.json'))), available=new Set(idx.skills.map(x=>x.name));
const suite=JSON.parse(await readFile(join(root,'evaluation-cases.json'))), errors=[];
for(const c of suite.cases) for(const s of c.expectedSkills) if(!available.has(s)) errors.push(`${c.id}: missing ${s}`);
if(errors.length){console.error(errors.join('\n'));process.exit(1)} console.log(`Evaluation suite references ${suite.cases.length} cases and ${available.size} skills`);
