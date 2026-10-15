import { cp, readFile, readdir } from 'node:fs/promises';
import { resolve } from 'node:path';

const root = resolve(import.meta.dirname, '..');
const output = resolve(root, '_site');
const html = await readFile(resolve(output, 'index.html'), 'utf8');
if (!html.includes('https://shadowmoon6868.github.io/postman-migration-assistant/')) {
  throw new Error('Build with the production SITE_URL before syncing to the published root.');
}
for (const name of await readdir(output)) {
  await cp(resolve(output, name), resolve(root, name), { recursive: true, force: true });
}
console.log('Copied verified static output to the repository root.');
