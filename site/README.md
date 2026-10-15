# Postman Migration Assistant website

Static, dependency-free GitHub Pages site in Vietnamese. It uses only local
assets; there is no tracking script or third-party font.

Build and preview:

```powershell
$env:SITE_URL = "http://localhost:4173/"
$env:REPO_URL = "https://github.com/OWNER/REPO"
node site/build.mjs
node site/test.mjs
python -m http.server 4173 --directory _site
```

This repository publishes from `main` at `/`. To deploy updates, build with
production `SITE_URL` and `REPO_URL`, run `node site/test.mjs`, then run
`node site/sync-root.mjs` and commit/push the generated root files. Pages
publishes the new commit automatically. The sync script rejects a localhost
canonical URL. GitHub Actions can replace this flow when the publishing
credential has workflow-management scope.

The demo video is an **illustration generated from the controlled CRUD fixture**,
not a native IntelliJ screen capture. Caption and written transcript are
provided. Replace it with an authenticated, explicitly labeled native recording
if one becomes available. Do not claim runtime parity from static conversion
coverage.
