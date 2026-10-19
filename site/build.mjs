import { cp, mkdir, readFile, readdir, writeFile } from 'node:fs/promises';
import { basename, resolve } from 'node:path';

const root = resolve(import.meta.dirname, '..');
const source = resolve(root, 'site');
const output = resolve(root, '_site');
const repository = process.env.GITHUB_REPOSITORY || '';
const repoUrl = process.env.REPO_URL || (repository ? `https://github.com/${repository}` : 'https://github.com/');
const marketplaceUrl = process.env.MARKETPLACE_URL || 'https://plugins.jetbrains.com/search?search=Postman%20Migration%20Assistant';
const rawSiteUrl = process.env.SITE_URL || (repository
  ? `https://${repository.split('/')[0]}.github.io/${repository.split('/')[1]}/`
  : 'http://localhost:4173/');
const siteUrl = new URL(rawSiteUrl.endsWith('/') ? rawSiteUrl : `${rawSiteUrl}/`).href;
const template = await readFile(resolve(source, 'index.html'), 'utf8');
const localeDir = resolve(source, 'locales');
const localeFiles = (await readdir(localeDir)).filter(name => name.endsWith('.json')).sort();
const locales = await Promise.all(localeFiles.map(async name => {
  const data = JSON.parse(await readFile(resolve(localeDir, name), 'utf8'));
  if (data.code !== basename(name, '.json') || !/^[a-z]{2,3}$/.test(data.code)) {
    throw new Error(`Invalid locale code in ${name}`);
  }
  return data;
}));
const english = locales.find(locale => locale.code === 'en');
if (!english) throw new Error('locales/en.json is required as the default language');

function assertSameShape(reference, translation, location) {
  if (Array.isArray(reference)) {
    if (!Array.isArray(translation) || reference.length !== translation.length) throw new Error(`Locale mismatch: ${location}`);
    reference.forEach((entry, index) => assertSameShape(entry, translation[index], `${location}[${index}]`));
  } else if (reference && typeof reference === 'object') {
    if (!translation || typeof translation !== 'object' || Array.isArray(translation)) throw new Error(`Locale mismatch: ${location}`);
    for (const key of Object.keys(reference)) {
      if (!(key in translation)) throw new Error(`Missing translation: ${location}.${key}`);
      assertSameShape(reference[key], translation[key], `${location}.${key}`);
    }
  } else if (typeof translation !== typeof reference || !String(translation).trim()) {
    throw new Error(`Invalid translation: ${location}`);
  }
}
for (const locale of locales) assertSameShape(english, locale, locale.code);
const esc = value => String(value).replace(/[&<>"']/g, char => ({
  '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
})[char]);
const localeUrl = locale => `${siteUrl}${locale.code === 'en' ? '' : `${locale.code}/`}`;
const hrefs = locales.map(locale => `<link rel="alternate" hreflang="${esc(locale.htmlLang)}" href="${localeUrl(locale)}">`).join('\n  ')
  + `\n  <link rel="alternate" hreflang="x-default" href="${siteUrl}">`;
const timecodes = [
  ['00:00:00.000', '00:00:04.000'],
  ['00:00:04.000', '00:00:08.000'],
  ['00:00:08.000', '00:00:13.000'],
  ['00:00:13.000', '00:00:18.000']
];
await mkdir(output, { recursive: true });
await cp(resolve(source, 'assets'), resolve(output, 'assets'), { recursive: true });
const eulaTemplate = await readFile(resolve(source, 'eula', 'index.html'), 'utf8');
await mkdir(resolve(output, 'eula'), { recursive: true });
await writeFile(resolve(output, 'eula', 'index.html'), eulaTemplate.replaceAll('[[siteUrl]]', siteUrl));

for (const locale of locales) {
  const canonical = localeUrl(locale);
  const assetPrefix = locale.code === 'en' ? './' : '../';
  const languageLinks = locales.map(option =>
    `<a href="${localeUrl(option)}" lang="${esc(option.htmlLang)}" hreflang="${esc(option.htmlLang)}" title="${esc(option.label)}"${option.code === locale.code ? ' aria-current="page"' : ''}>${esc(option.shortLabel)}</a>`
  ).join('');
  const videoTracks = [locale, ...locales.filter(option => option.code !== locale.code)]
    .map(option => `<track${option.code === locale.code ? ' default' : ''} kind="captions" srclang="${esc(option.htmlLang)}" label="${esc(option.label)}" src="${assetPrefix}assets/import-demo.${option.code}.vtt">`).join('\n        ');
  const stepsHtml = locale.workflow.steps.map((step, index) =>
    `<article><span class="step-number">${String(index + 1).padStart(2, '0')}</span><h3>${esc(step.title)}</h3><p>${esc(step.body)}</p></article>`).join('');
  const marks = ['↗', '◈', '⌘', '◎', '▣', '◇'];
  const featuresHtml = locale.features.items.map((item, index) =>
    `<article><span class="feature-mark" aria-hidden="true">${marks[index % marks.length]}</span><h3>${esc(item.title)}</h3><p>${esc(item.body)}</p></article>`).join('');
  const installStepsHtml = locale.install.steps.map(step => `<li>${esc(step)}</li>`).join('');
  const freeItemsHtml = locale.plans.freeItems.map(item => `<li><span aria-hidden="true">✓</span>${esc(item)}</li>`).join('');
  const proItemsHtml = locale.plans.proItems.map(item => `<li><span aria-hidden="true">✓</span>${esc(item)}</li>`).join('');
  const faqHtml = locale.faq.map(item =>
    `<details><summary>${esc(item.question)}</summary><p>${esc(item.answer)}</p></details>`).join('');
  const structuredData = {
    '@context': 'https://schema.org',
    '@graph': [
      { '@type': 'WebSite', '@id': `${siteUrl}#website`, url: siteUrl, name: 'Postman Migration Assistant', inLanguage: locale.htmlLang },
      { '@type': 'SoftwareApplication', '@id': `${siteUrl}#software`, name: 'Postman Migration Assistant', url: canonical,
        applicationCategory: 'DeveloperApplication', operatingSystem: 'Windows', softwareVersion: '1.0.0', isAccessibleForFree: true,
        description: locale.seo.description, requirements: 'IntelliJ IDEA Ultimate 2025.3.2 (IU-253.30387.90)',
        inLanguage: locale.htmlLang },
      { '@type': 'VideoObject', '@id': `${siteUrl}#demo`, name: locale.demo.title,
        description: locale.demo.intro, thumbnailUrl: `${siteUrl}assets/demo-poster.png`,
        contentUrl: `${siteUrl}assets/import-demo.mp4`, uploadDate: '2026-10-15T00:00:00+07:00',
        duration: 'PT18S', inLanguage: 'en', transcript: locale.demo.transcript },
      { '@type': 'FAQPage', '@id': `${canonical}#faq`, mainEntity: locale.faq.map(item => ({
        '@type': 'Question', name: item.question, acceptedAnswer: { '@type': 'Answer', text: item.answer }
      })) }
    ]
  };
  const raw = {
    siteUrl, canonical, repoUrl, marketplaceUrl, assetPrefix, hreflangLinks: hrefs, languageLinks,
    videoTracks, stepsHtml, featuresHtml, installStepsHtml, freeItemsHtml, proItemsHtml, faqHtml,
    structuredData: JSON.stringify(structuredData).replaceAll('<', '\\u003c')
  };
  const html = template.replace(/\[\[([a-zA-Z][a-zA-Z0-9.]*)\]\]/g, (_, key) => {
    if (key in raw) return raw[key];
    const value = key.split('.').reduce((node, part) => node?.[part], locale);
    if (typeof value !== 'string') throw new Error(`Unknown template key: ${key}`);
    return esc(value);
  });
  if (html.includes('[[')) throw new Error(`Unresolved template marker in ${locale.code}`);
  const destination = resolve(output, locale.code === 'en' ? '' : locale.code);
  await mkdir(destination, { recursive: true });
  await writeFile(resolve(destination, 'index.html'), html);
  const captions = locale.demo.captions;
  if (captions.length !== timecodes.length) throw new Error(`Expected four captions in ${locale.code}`);
  const vtt = 'WEBVTT\n\n' + captions.map((caption, index) =>
    `${timecodes[index][0]} --> ${timecodes[index][1]}\n${caption}\n`).join('\n');
  await writeFile(resolve(output, 'assets', `import-demo.${locale.code}.vtt`), vtt);
}

const sitemapEntries = locales.map(locale => {
  const alternates = locales.map(option =>
    `<xhtml:link rel="alternate" hreflang="${option.htmlLang}" href="${localeUrl(option)}"/>`).join('');
  return `<url><loc>${localeUrl(locale)}</loc><lastmod>2026-10-18</lastmod>${alternates}<xhtml:link rel="alternate" hreflang="x-default" href="${siteUrl}"/></url>`;
}).join('') + `<url><loc>${siteUrl}eula/</loc><lastmod>2026-10-19</lastmod></url>`;
await writeFile(resolve(output, 'sitemap.xml'), `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">${sitemapEntries}</urlset>\n`);
await writeFile(resolve(output, 'robots.txt'), `User-agent: *\nAllow: /\nSitemap: ${siteUrl}sitemap.xml\n`);
await writeFile(resolve(output, 'llms.txt'), `# Postman Migration Assistant\n\n> Offline Postman Collection v2.0/v2.1 migration to IntelliJ HTTP Client. Version 1.0 targets IntelliJ IDEA Ultimate 2025.3.2.\n\nFree analyzes the complete collection and exports safe independent basic requests. Pro preserves supported scripts, ordered dependencies, advanced OAuth2 and HTTP runtime semantics, and adds differential verification. Unsupported behavior remains manual review in both editions.\n\n${locales.map(locale => `- ${locale.label}: ${localeUrl(locale)}`).join('\n')}\n- Documentation: ${repoUrl}/blob/main/README.md\n- Compatibility matrix: ${repoUrl}/blob/main/site/docs/COMPATIBILITY.md\n- Corpus methodology: ${repoUrl}/blob/main/site/docs/CORPUS-BENCHMARK.md\n- JetBrains Marketplace: ${marketplaceUrl}\n- Contact: shadowmoon6868@gmail.com\n\n97.2% is static conversion coverage, not a runtime request success rate.\n`);
await writeFile(resolve(output, '.nojekyll'), '');
console.log(`Built ${locales.length} languages in ${output}; default: English; base: ${siteUrl}`);
