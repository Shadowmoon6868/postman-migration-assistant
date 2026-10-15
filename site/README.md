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

For deployment, set **Settings → Pages → Build and deployment → Source** to
**GitHub Actions**. Pushing changes under `site/` on `main` runs the Pages
workflow. The workflow derives the canonical URL and repository links from
GitHub repository metadata. The repository must allow GitHub Pages.

The demo video is an **illustration generated from the controlled CRUD fixture**,
not a native IntelliJ screen capture. Caption and written transcript are
provided. Replace it with an authenticated, explicitly labeled native recording
if one becomes available. Do not claim runtime parity from static conversion
coverage.
