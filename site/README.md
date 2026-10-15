# Postman Migration Assistant website

Static, dependency-free GitHub Pages site. English is the default page at `/`;
Vietnamese, Russian, and Simplified Chinese are generated at `/vi/`, `/ru/`,
and `/zh/`. It uses only local assets, with no tracking script or
third-party font.

Build and preview:

```powershell
$env:SITE_URL = "http://localhost:4173/"
$env:REPO_URL = "https://github.com/OWNER/REPO"
node site/build.mjs
node site/test.mjs
python -m http.server 4173 --directory _site
```

This repository publishes built files from `main` at `/`. Build with the
production `SITE_URL` and `REPO_URL`, run `node site/test.mjs`, then
`node site/sync-root.mjs` and commit/push. The sync script rejects a
localhost canonical URL. A workflow can replace these manual steps when
the publishing credential has workflow-management scope.

To add a language, copy `site/locales/en.json` to a new `<code>.json` file,
set `code`, `htmlLang`, `ogLocale`, and the language labels, then translate
every text field. The build discovers the new file automatically and generates
its route, language switch, canonical/hreflang tags, localized FAQ JSON-LD,
captions, sitemap entry, and `llms.txt` link. The build checks that every
locale has the same keys and array lengths as English. Run `node site/build.mjs`
and `node site/test.mjs` before publishing.

The demo video is an **illustration generated from the controlled CRUD fixture**,
not a native IntelliJ screen capture. The video uses English text; each
language has its own captions and written transcript. Replace it with an
authenticated, explicitly labeled native recording
if one becomes available. Do not claim runtime parity from static conversion
coverage.
