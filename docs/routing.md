# Pilot routing and production handoff

## Verified by this implementation

- The aggregate contains `/`, `/mlx-speech/`, and `/pi-arcweld/` as independent
  documents with separate assets. Local navigation keeps canonical metadata.
- Unknown files return a real 404. External project routes remain live links.
- Validation rejects duplicate mounts, escaped outputs, and homepage files
  attempting to claim a registered project's directory.
- `dist-production/` contains the homepage and root discovery files only. Pages
  uploads this output while `dist/` remains the review artifact.
- The central index references leaf sitemaps, including MLX Atomistic's flattened
  documentation sitemap. Existing public addresses are preserved.

## Hosting behavior requiring a controlled test

GitHub documents that an organization site's domain is inherited by project
sites, exposing each at `/<repository>/`. It does not document precedence between
a project publisher and a same-named directory in an organization artifact, or
fallback timing after unpublishing a project. [GitHub custom-domain documentation](https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site/about-custom-domains-and-github-pages).

Local tests prove aggregate files and routes, not delivery through an occupied
GitHub project mount. The pilot does not change project Pages settings, remove
publishing workflows, or upload project directories through the homepage.

## Controlled handoff test

Before switching a real project, use an isolated Pages test arrangement with
the same organization/project relationship and no user-facing route changes:

1. Put distinct marker files in the root artifact's project directory and the
   project artifact. Record bodies, status codes, and redirects for the directory,
   a nested asset, an unknown path, and a slashless request.
2. Test publisher retirement and measure when ownership changes. Confirm the
   intended marker at each required path.
3. Restore the original publication and verify rollback. Record the exact
   settings and artifacts needed to restore it.
4. If this cannot provide an acceptable handoff, evaluate a static origin with
   explicit routing before production changes. Preserve all public URLs.

Do not create a public routing experiment or retire a production publisher as
an incidental part of reviewing a visual preview.

## Production release procedure

Refresh the baseline, build the complete candidate, and check it at the
destination. Retain previous artifacts and configuration. Follow the tested
handoff sequence, then verify live page and asset hashes, redirects, canonicals,
sitemaps, and root links. Retire the old editable website source and update its
repository guidance after the new publisher is confirmed.

If delivery differs from the candidate, restore the previous artifact and
publisher configuration using the tested rollback. Do not address an uncertain
handoff by removing more live publishers. Each route needs one authoritative
source.
