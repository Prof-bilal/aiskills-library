import { mkdir, rm, symlink, readdir } from 'node:fs/promises';
import { join } from 'node:path';
const root=new URL('..',import.meta.url).pathname;
for(const view of ['.agents/skills','.claude/skills']) {
  const dir=join(root,view); await rm(dir,{recursive:true,force:true}); await mkdir(dir,{recursive:true});
  for(const category of ['core','orchestration','grind']) for(const entry of await readdir(join(root,'skills',category),{withFileTypes:true})) if(entry.isDirectory()) await symlink(`../../skills/${category}/${entry.name}`,join(dir,entry.name));
}
console.log('Exported agent views');
