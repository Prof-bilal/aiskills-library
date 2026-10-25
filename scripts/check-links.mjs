import { readFile } from 'node:fs/promises';
import { join } from 'node:path';
const root=new URL('..',import.meta.url).pathname;
const files=['README.md','AGENTS.md','sources.json','references/skill-quality-standard.md','references/progressive-disclosure.md','references/frontend-reference.md','references/backend-reference.md','references/security-reference.md','references/orchestration-reference.md','references/challenge-framework.md'];
for(const f of files) await readFile(join(root,f));
console.log(`Checked ${files.length} required project files`);
