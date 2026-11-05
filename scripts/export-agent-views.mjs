import { mkdir, rm, symlink, readdir } from 'node:fs/promises';
import { execFileSync } from 'node:child_process';
import { join } from 'node:path';
import { CATEGORIES, ROOT, normalizeNewlines } from './lib.mjs';
const windows=process.platform==='win32';
for(const view of ['.agents/skills','.claude/skills']) {
  const dir=join(ROOT,view); await rm(dir,{recursive:true,force:true}); await mkdir(dir,{recursive:true});
  for(const category of CATEGORIES) for(const entry of await readdir(join(ROOT,'skills',category),{withFileTypes:true})) {
    if(!entry.isDirectory()) continue;
    const link=join(dir,entry.name);
    if(windows) execFileSync('cmd',['/c','mklink','/J',link,join(ROOT,'skills',category,entry.name)],{stdio:'ignore'});
    else await symlink(`../../skills/${category}/${entry.name}`,link);
  }
}
console.log('Exported agent views');
