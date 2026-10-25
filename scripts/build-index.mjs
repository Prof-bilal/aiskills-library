import { readdir, readFile, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
const root = new URL('..', import.meta.url).pathname;
const skills=[];
for (const category of ['core','orchestration','grind']) {
  for (const entry of await readdir(join(root,'skills',category), {withFileTypes:true})) {
    if (!entry.isDirectory()) continue;
    const file=join(root,'skills',category,entry.name,'SKILL.md');
    const text=await readFile(file,'utf8');
    const fm=text.match(/^---\n([\s\S]*?)\n---/);
    const name=fm?.[1].match(/^name:\s*(\S+)/m)?.[1];
    const description=fm?.[1].match(/^description:\s*(.+)$/m)?.[1]?.trim();
    skills.push({category,name,description,path:`skills/${category}/${entry.name}/SKILL.md`});
  }
}
skills.sort((a,b)=>a.name.localeCompare(b.name));
await writeFile(join(root,'skills-index.json'),JSON.stringify({schemaVersion:1,skills},null,2)+'\n');
console.log(`Indexed ${skills.length} skills`);
