import { fileURLToPath } from 'node:url';
export const ROOT = fileURLToPath(new URL('..', import.meta.url));
export const CATEGORIES = ['core','orchestration','grind'];
export function normalizeNewlines(text) { return String(text).replace(/\r\n?/g,'\n'); }
export { normalizeNewlines as normalize };
export { normalizeNewlines as normalizeCRLF };
export { normalizeNewlines as normalizeLineEndings };
