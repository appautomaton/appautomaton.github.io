# Search discovery

The production origin is `https://appautomaton.com/`. The RenoCrypt field guide
at `appautomaton.renocrypt.com` is a separate publication. The domain migration
and project metadata correction are recorded in [PR #7](https://github.com/appautomaton/appautomaton.github.io/pull/7).

## One catalog, several useful views

`scripts/sync-catalog.mjs` reads the public GitHub organization, checks project
pages, and writes `src/data/org.generated.ts`. `src/data/catalog.ts` joins those
facts to the editorial placement in `src/data/shelves.ts`. New public websites
with a valid GitHub About URL are included automatically. Name and topics
select an initial fallback category, which editorial placement can override.
GitHub repository IDs bind the saved order, category, and artwork. New entries
append within their field. The published `catalog-state.json` carries that
state into subsequent builds; the checked-in checkpoint supports offline work.
Missing known identities or a lost registry stop publication for review. Existing
source-only exhibits and deliberate exclusions retain their explicit choices.

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

A missing or incorrect canonical, an indexing prohibition in page metadata or
HTTP headers, and an incorrect GitHub About URL fail the sync. Sitemap
candidates must serve XML documents. Missing descriptions and absent backlinks
are reported for the owning project to resolve. Outages and access blocks do
not prove that a project page has disappeared. Only a definitive 404/410 can
remove a curated page link. An automatic entry that becomes ineligible stops
publication until its exclusion or restoration is reviewed.

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

## Link and image semantics

A project's artwork, heading, and primary action share one HTML anchor. A
separate source link is present when the project also publishes a website.
Every link has descriptive HTML text, and publication rejects duplicated
destinations within a project entry. Catalog illustrations have concise descriptions of the actual objects.
Repeated hero/index previews and ambient backgrounds use empty alt attributes.
The model images are illustrations, not product screenshots or diagrams.

Open Graph and Twitter card fields point to the same composed 1200 by 630 PNG. A native share control uses the
canonical URL, with clipboard and selectable-text fallbacks.
Sharing metadata is served in the initial HTML without a social-plugin runtime.
