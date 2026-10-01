# iSuite macOS project showcase

This is a static English/Spanish showcase for five personal macOS applications: iVoz, iOrganize, Screen Bridge, iStats, and iBrain. It keeps the original site's blue/white visual language and app icons while presenting public source, verified technology, and honest limitations.

The current release builds are staged as **drafts** for the creator's hands-on smoke test. The site links to source repositories and intentionally has no checkout or public download buttons for those drafts. Screen Bridge is explicitly experimental. Generated product mockups from the earlier sales page are not used as evidence of app UI.

## Run locally

No build step is required. Serve the repository root with a static HTTP server, for example `python3 -m http.server 8765`, then open `http://127.0.0.1:8765/`. The primary pages are `index.html` and `index-es.html`; the older mobile URLs redirect to those responsive pages. Styling uses the existing Tailwind CDN configuration plus a small local style rule. Internet access is required for the CDN fonts and Tailwind stylesheet.

## Update/publish

After the creator smoke-tests an artifact and publishes its GitHub release, add its verified release URL to the corresponding project card. Keep the GitHub source link and the known limitation. If a build fails hands-on testing, retain the source-only status until it is fixed.

The checkout was previously linked to an unrelated Vercel account. Before deploying, verify the linked Vercel project belongs to the intended **Hikari Studio AI** account. The local `.vercel` link is ignored by Git. Do not infer the active account from the public URL alone.

## Verification

The English and Spanish pages were opened in a local browser. The five project links, page order, asset paths, mobile redirects, and absence of checkout/download links can be checked from the static files. There is no app test suite or bundler in this repository.
