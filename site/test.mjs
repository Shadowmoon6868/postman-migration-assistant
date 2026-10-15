import assert from 'node:assert/strict';
import { readFile, stat } from 'node:fs/promises';
import { resolve } from 'node:path';

const root = resolve(import.meta.dirname, '..');
const html = await readFile(resolve(root, '_site/index.html'), 'utf8');
assert(!html.includes('__SITE_URL__') && !html.includes('__REPO_URL__') && !html.includes('__STRUCTURED_DATA__'));
const legacyBrand = String.fromCharCode(86, 65, 76);
assert(!new RegExp(`\\b${legacyBrand}\\b`, 'i').test(html), 'Public site must not use the old brand');
for (const file of ['assets/site.css', 'assets/icon.svg', 'assets/import-demo.mp4', 'assets/demo-poster.png', 'assets/og-card.png', 'assets/import-demo.vi.vtt', 'robots.txt', 'sitemap.xml', 'llms.txt']) {
  const info = await stat(resolve(root, '_site', file));
  assert(info.size > 0, `${file} is empty`);
}
const json = JSON.parse(html.match(/<script type="application\/ld\+json" id="structured-data">([\s\S]*?)<\/script>/)?.[1] || '');
assert.equal(json['@graph'][0].name, 'Postman Migration Assistant');
assert.equal(json['@graph'][3].mainEntity.length, 7);
assert(html.includes('97,2%') && html.includes('không phải tỷ lệ chạy thành công'));
assert(html.includes('kind="captions"') && html.includes('id="transcript"'));
const vtt = await readFile(resolve(root, '_site/assets/import-demo.vi.vtt'), 'utf8');
assert(vtt.startsWith('WEBVTT'));
console.log('Site checks passed');
