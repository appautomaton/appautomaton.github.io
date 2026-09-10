# Search discovery

The production origin is `https://appautomaton.com/`. The RenoCrypt field guide
at `appautomaton.renocrypt.com` is a separate publication. The domain migration
and project metadata correction are recorded in [PR #7](https://github.com/appautomaton/appautomaton.github.io/pull/7).

## One catalog, several useful views

`scripts/sync-catalog.mjs` reads the public GitHub organization, checks project
pages, and writes `src/data/org.generated.ts`. `src/data/catalog.ts` joins those
facts to the editorial placement in `src/data/shelves.ts`.

`scripts/build.mjs` uses that catalog to generate:

- Complete HTML descriptions and normal followable links to project pages and
  source repositories. Search and filtering are optional browser enhancements.
- A WebSite, Organization, CollectionPage, and ItemList of SoftwareSourceCode
  records. Existing organization and project identifiers remain consistent.
- A JSON catalog and `llms.txt` text edition.
- A sitemap containing the homepage, linked project homepages, and colophon.
- robots.txt allowing crawling and declaring the project sitemaps found by
  the sync step.

The homepage and colophon use self-canonical URLs and permit indexing.
The 404 page remains noindex. Project modification dates come from their
serving host; the homepage does not invent a fresh modification date every day.

## Publication checks

The build must not ship missing catalog entries, restrictive backlink
attributes, a wrong canonical origin, or incomplete discovery files. It
also verifies local assets and compressed browser-code budgets.

A canonical pointing at the wrong project address fails the sync. A missing
canonical, missing description, outdated homepage field, or absent backlink
is reported for the owning project to resolve. Outages and access blocks do
not prove that a project page has disappeared. Only a definitive 404/410 can
remove a known page link.

GitHub API pagination prevents a future page-one cutoff. API failures in CI
stop publication instead of silently deploying an old snapshot. The previous
successful website stays live.

## Boundaries

Project websites are built in their own repositories. The organization site
must preserve their `/<repository>/` routes and their individual indexing
choices. New organization-page routes should use explicit filenames or an
appropriate namespace.

The related RenoCrypt field guide and AppCubic workshop page have contextual
links. They are genuine related publications, not manufactured link lists.

Lighthouse validates technical basics. It does not measure actual Google
indexing, search rankings, or citations by assistants. Use Search Console for
those account-specific observations and keep raw account reports outside
this public repository.
