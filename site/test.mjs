import assert from 'node:assert/strict';
import { readFile, readdir, stat } from 'node:fs/promises';
import { resolve } from 'node:path';

const root = resolve(import.meta.dirname, '..');
const site = resolve(root, 'site');
const output = resolve(root, '_site');
const locales = await Promise.all((await readdir(resolve(site, 'locales')))
  .filter(file => file.endsWith('.json'))
  .map(async file => JSON.parse(await readFile(resolve(site, 'locales', file), 'utf8'))));
const english = locales.find(locale => locale.code === 'en');
assert(english, 'English locale must exist');
for (const code of ['en', 'ru', 'zh', 'vi']) assert(locales.some(locale => locale.code === code));
const legacyBrand = String.fromCharCode(86, 65, 76);
const rootHtml = await readFile(resolve(output, 'index.html'), 'utf8');
const eulaHtml = await readFile(resolve(output, 'eula', 'index.html'), 'utf8');
assert(eulaHtml.includes('Trần Việt Anh') && eulaHtml.includes('Shadowmoon6868'));
assert(eulaHtml.includes('seven-day trial'));
const baseUrl = rootHtml.match(/<link rel="canonical" href="([^"]+)"/)?.[1];
assert(baseUrl?.endsWith('/'));

for (const locale of locales) {
  const filename = resolve(output, locale.code === 'en' ? '' : locale.code, 'index.html');
  const html = await readFile(filename, 'utf8');
  assert(html.includes(`<html lang="${locale.htmlLang}">`), `Wrong language tag: ${locale.code}`);
  assert(html.includes(locale.seo.title), `Missing translated title: ${locale.code}`);
  assert(html.includes(locale.hero.title1), `Missing translated hero: ${locale.code}`);
  assert(!html.includes('[['), `Unresolved translation: ${locale.code}`);
  assert(!new RegExp(`\\b${legacyBrand}\\b`, 'i').test(html), 'Public site must not use the old brand');
  assert(html.includes('scenario.http') && html.includes('independent.http'));
  assert(html.includes('kind="captions"') && html.includes('id="transcript"'));
  assert.equal((html.match(/rel="alternate" hreflang=/g) || []).length, locales.length + 1);
  assert.equal((html.match(/<track\b/g) || []).length, locales.length);
  assert(html.includes(`<track default kind="captions" srclang="${locale.htmlLang}"`));
  assert.equal((html.match(/class="feature-mark"/g) || []).length, locale.features.items.length);
  assert(html.includes('id="plans"') && html.includes(locale.plans.freeName) && html.includes(locale.plans.proName));
  assert(html.includes('https://plugins.jetbrains.com/'), `Missing Marketplace link: ${locale.code}`);
  assert.equal((html.match(/https:\/\/plugins\.jetbrains\.com\//g) || []).length, 6);
  assert.equal((html.match(/class="plan-card/g) || []).length, 2);
  const canonical = html.match(/<link rel="canonical" href="([^"]+)"/)?.[1];
  assert.equal(canonical, `${baseUrl}${locale.code === 'en' ? '' : `${locale.code}/`}`);
  for (const option of locales) {
    assert(html.includes(`hreflang="${option.htmlLang}" href="${baseUrl}${option.code === 'en' ? '' : `${option.code}/`}"`));
  }
  const json = JSON.parse(html.match(/<script type="application\/ld\+json" id="structured-data">([\s\S]*?)<\/script>/)?.[1] || '');
  assert.equal(json['@graph'][1].inLanguage, locale.htmlLang);
  assert.equal(json['@graph'][3].mainEntity.length, locale.faq.length);
  assert.equal(json['@graph'][3].mainEntity[0].name, locale.faq[0].question);
  assert(html.includes(locale.faq[0].question));
  const vtt = await readFile(resolve(output, 'assets', `import-demo.${locale.code}.vtt`), 'utf8');
  assert(vtt.startsWith('WEBVTT\n') && vtt.includes(locale.demo.captions[0]));
}
assert(rootHtml.includes('Bring Postman collections into'), 'Root must default to English');
assert(!/technical preview|join the beta|request beta access|closed beta/i.test(rootHtml), 'English launch page must not advertise a beta');
for (const file of ['assets/site.css', 'assets/icon.svg', 'assets/import-demo.mp4', 'assets/demo-poster.png', 'assets/og-card.png', 'robots.txt', 'sitemap.xml', 'llms.txt']) {
  assert((await stat(resolve(output, file))).size > 0, `${file} is empty`);
}
const mp4 = await readFile(resolve(output, 'assets/import-demo.mp4'));
assert.equal(mp4.toString('ascii', 4, 8), 'ftyp');
const sitemap = await readFile(resolve(output, 'sitemap.xml'), 'utf8');
assert.equal((sitemap.match(/<url>/g) || []).length, locales.length + 1);
assert(sitemap.includes(`${baseUrl}eula/`));
assert(sitemap.includes('hreflang="x-default"'));
console.log(`Site checks passed for ${locales.length} languages`);
