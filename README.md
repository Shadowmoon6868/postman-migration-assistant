# Postman Migration Assistant

A marketing site and illustrated demo for a plugin that converts Postman
Collection v2.0/v2.1 into IntelliJ HTTP Client files.

**Website:** [English](https://shadowmoon6868.github.io/postman-migration-assistant/)
· [Русский](https://shadowmoon6868.github.io/postman-migration-assistant/ru/)
· [简体中文](https://shadowmoon6868.github.io/postman-migration-assistant/zh/)
· [Tiếng Việt](https://shadowmoon6868.github.io/postman-migration-assistant/vi/)

The plugin analyzes collections locally, reads optional environment and
globals files, identifies dependencies, and exports `scenario.http`,
`independent.http`, environment files, a compatibility script, and a
migration report. Requests without a safe mapping are flagged for manual
review. Version 1.0 uses a Free/Pro model and targets IntelliJ IDEA Ultimate 2025.3.2;
see the [compatibility matrix](site/docs/COMPATIBILITY.md).

Free analyzes the complete collection and exports safe independent basic
requests. Pro preserves supported scripts, dependencies, advanced OAuth2 and
HTTP runtime semantics, and adds differential verification. Unsupported
behavior stays in manual review in both editions.

The site includes an 18-second illustrated video with four caption languages,
a written transcript for each language, and before-and-after code from a
[controlled CRUD fixture](site/qa/fixtures/crud.postman_collection.json).
The video is not a native IntelliJ screen recording.

The 97.2% figure is **static conversion coverage** across 20 public
collections, not a runtime request success rate. Read the
[methodology](site/docs/CORPUS-BENCHMARK.md).

For Marketplace launch and pricing updates, email
[shadowmoon6868@gmail.com](mailto:shadowmoon6868@gmail.com?subject=Postman%20Migration%20Assistant%201.0).
Do not send tokens, secrets, or customer data by email.

## Updating the site

The editable source is in `site/`. English at `/` is the default;
other languages have separate static routes. To add a language, copy
`site/locales/en.json` to `site/locales/<code>.json`, set its locale
metadata, and translate every field. The build automatically creates the
route, language switch, captions, canonical/hreflang tags, localized FAQ
schema, sitemap entry, and `llms.txt` link.

This repository publishes the built files at its root from the `main`
branch. The current Git credential cannot create or update GitHub Actions
workflow files, so deployment uses a verified static build:

```powershell
$env:SITE_URL = "https://shadowmoon6868.github.io/postman-migration-assistant/"
$env:REPO_URL = "https://github.com/Shadowmoon6868/postman-migration-assistant"
node site/build.mjs
node site/test.mjs
node site/sync-root.mjs
git add .
git commit -m "Update site"
git push
```

The site has no tracking script or third-party font. It includes a sitemap,
robots.txt, Open Graph metadata, JSON-LD, and llms.txt.

Postman Migration Assistant is an independent tool, not affiliated with or
endorsed by Postman or JetBrains.
