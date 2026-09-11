# App Automaton websites

This repository owns the homepage source and previews independent project
websites. Each module under `sites/` owns its visual identity, content, fonts,
assets, styles, scripts, and build inputs. Keep application and library code in
the original project repositories. Do not introduce a shared page shell or
global project styles. Homepage guidance is in `sites/home/AGENTS.md`.

- Read `registry/sites.json` before changing routes. It records public mounts,
  current publishers, sitemap leaves, and imported modules.
- Publication ownership is explicit in `registry/sites.json`. `external` modules
  enter preview only; `staged` modules also enter the production artifact while
  their previous publisher remains active; `central` modules are served here.
  Use `staged` only during `publisher-handoff`. A noindex, unlisted routing probe
  may be enabled through a manual workflow run to verify the isolated test path.
  Pages always uploads the validated `dist-production/` artifact.
- Build with Node 24 and the standard library. `npm run build` is offline.
  `npm run sync` explicitly refreshes catalog and sitemap inputs. Keep scheduled
  refresh, durable project identities, and failure behavior intact.
- Import from a successful publication, not an arbitrary local branch.
  `registry/baselines.json` records initial deployed file hashes. Preserve
  provenance and licenses; do not refresh hashes to conceal a mismatch.
- Shared checks cover paths, links, metadata, and assembly. Typography, layout,
  palette, motion, and component choices belong to each site. Preserve imported
  choices during an equivalence migration.
- Keep content in HTML, scrolling native, keyboard controls usable, and motion
  optional. Never autoplay samples or play audio during automated review.
- Run `npm test`, `npm run lint`, and `npm run build` for tooling changes.
  `npm run check:baseline` verifies the initial import. Intentional later design
  changes should document differences from that historical baseline.
- Reuse the existing browser tab for preview. Do not create a browser window
  or tab for review.
- Write code, comments, and documents in English. Avoid the excluded terms
  `SEO`, `GEO`, and `GO` in commit messages and PR titles or descriptions.
- Keep private plans and account-only observations in the parent App Automaton
  workspace, outside this public repository.
