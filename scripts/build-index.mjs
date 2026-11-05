import { readdir, readFile, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { CATEGORIES, ROOT, normalizeNewlines } from './lib.mjs';
const check=process.argv.includes('--check');
const indexFile=join(ROOT,'skills-index.json');
const skills=[];
const errors=[];
for (const category of CATEGORIES) {
  for (const entry of await readdir(join(ROOT,'skills',category), {withFileTypes:true})) {
    if (!entry.isDirectory()) continue;
    const file=join(ROOT,'skills',category,entry.name,'SKILL.md');
    const rel=`skills/${category}/${entry.name}/SKILL.md`;
    const text=normalizeNewlines(await readFile(file,'utf8'));
    const fm=text.match(/^---\n([\s\S]*?)\n---/);
    if (!fm) { errors.push(`${rel}: missing frontmatter`); continue; }
    const name=fm[1].match(/^name:\s*(\S+)/m)?.[1];
    const description=fm[1].match(/^description:\s*(.+)$/m)?.[1]?.trim();
    if (!name) { errors.push(`${rel}: missing name`); continue; }
    if (!description) { errors.push(`${rel}: missing description`); continue; }
    skills.push({category,name,description,path:rel});
  }
}
if (errors.length) {
  for (const error of errors) console.error(error);
  process.exit(1);
}
skills.sort((a,b)=>a.name.localeCompare(b.name));
const output=JSON.stringify({schemaVersion:1,skills},null,2)+'\n';
if (check) {
  let current;
  try { current=normalizeNewlines(await readFile(indexFile,'utf8')); }
  catch { console.error('skills-index.json is missing; run node scripts/build-index.mjs'); process.exit(1); }
  if (current!==output) { console.error('skills-index.json is out of date; run node scripts/build-index.mjs'); process.exit(1); }
  console.log(`Index current for ${skills.length} skills`);
} else {
  await writeFile(indexFile,output);
  console.log(`Indexed ${skills.length} skills`);
}
