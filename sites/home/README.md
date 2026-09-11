# App Automaton

An open workshop for coding agents, local intelligence, and creative tools.

[Explore the website](https://appautomaton.com/) · [GitHub organization](https://github.com/appautomaton) · [RenoCrypt field guide](https://appautomaton.renocrypt.com/)

## The website

The page is complete HTML, with a curated public 3D model collection, original sculptures, and SVG interface marks,
self-hosted Uncut Sans, day and night palettes, and optional motion. Browser
JavaScript adds search, filtering, and presentation controls. There is no
runtime framework, client-side catalog fetch, or hydration step.

A Node 24 build uses only the standard library. It renders the same catalog
into the page, JSON-LD, `catalog.json`, `llms.txt`, and the discovery files.
The browser receives compressed WebP images, not a 3D rendering engine.
Blender is an optional artwork-authoring tool and is not needed for the site build.

## Project discovery

`scripts/sync-catalog.mjs` paginates GitHub's public organization API. The
current catalog includes active, original repositories, excluding the
organization site itself. `src/data/shelves.ts` holds editorial placement and
explicit reasons for work that is not exhibited. New repositories with a valid About URL and a working page are included
automatically, with an initial category derived from their name and topics. Editorial
placements override that fallback; explicit exclusions remain excluded.

Display order never comes from API response order. The curated entries keep
the order in `shelves.ts`. Automatic additions follow them within each field,
in first-publication order. A successful build saves each repository ID,
category, order, and artwork in `catalog-state.json`. The next build reads
that published registry, so new projects, changed topics, and renamed automatic
entries cannot rearrange existing artwork. The initial batch is ordered by
creation date and repository ID. `site/artwork.json` remains the explicit art
direction override.

`src/data/catalog-state.json` is the checked-in offline checkpoint. Refresh it
with `npm run sync`; do not hand-edit generated state. Scheduled builds carry
the latest registry in their Pages artifact and diagnostic artifact without
committing back to GitHub. Main deployments are serialized. A missing known
repository or lost registry fails publication for review instead of silently
removing a project or resetting its presentation.

Project page availability, canonical metadata, modification dates, and
sitemaps are checked against the serving site. Definitive 404/410 responses
can remove a curated page link. An automatic entry becoming ineligible stops
publication until its disposition is reviewed. Access blocks, rate limits, and outages retain the previous
known result and report a warning. A missing or incorrect canonical, an indexing prohibition, or an incorrect
GitHub About URL fails the build. URLs come from the verified About field. The GitHub credential is sent only to the GitHub API.

The daily publication must refresh the API successfully. An API failure in CI
stops deployment, preserving the previous live site. Local work can use the
committed snapshot. See [the discovery contract](docs/search-discovery.md).

## Local development

Use Node 24 or newer. No dependency installation is needed.

```sh
npm run dev
```

This renders the committed catalog and serves `http://127.0.0.1:4174/`.
After changing source, run `npm run build:offline` and reload the preview.
For a fresh metadata build and publication checks:

```sh
npm test
npm run lint
npm run build
```

For a static fallback check, run `node scripts/serve.mjs --no-js` and open
`http://127.0.0.1:4175/`. That local preview blocks page JavaScript with a
Content Security Policy.

The generated `dist/` directory is disposable. Edit source, never its output.
The publication check verifies crawlable project entries, indexing metadata,
sitemaps, local assets, unique IDs, and compressed CSS/JavaScript budgets.

## Delivery and routing

This module builds into its own `dist/`. The repository's shared assembly
copies that output into the aggregate preview and a homepage-only production
artifact, then adds the central sitemap index. Follow [the root delivery
contract](../../README.md#publication-boundary) when publishing. Run the root
commands for a preview that includes the imported project sites.

[Deploy to GitHub Pages](https://github.com/appautomaton/appautomaton.github.io/actions/workflows/deploy.yml)
retains daily refresh at 05:17 UTC and manual dispatch. Pull requests build
from known inputs; publication runs explicitly refresh catalog and sitemap data.

Scheduled public workflows can be disabled after prolonged repository
inactivity. GitHub schedules can also be delayed. A manual run is available
when an immediate refresh is needed.

GitHub Pages still serves project websites beneath `/<repository>/` from their
existing publishers. This module must not write those directories. Its content
sitemap includes the linked project homepages; shared assembly owns the final
root crawler policy and sitemap index.

## Art and provenance

[Design notes](docs/design.md) describe the gallery and motion system.
Uncut Sans by Kasper Nordkvist is served under the SIL Open Font License.
The collection combines CC0 models from Poly Haven with original sculptures and SVG interface marks. All current project cards use distinct artwork; the larger library supplies spare objects for newly discovered projects. [Asset provenance](site/assets/SOURCES.md) records their
origins. Floema was a reference for spatial composition and editorial rhythm;
its assets are not used here.

Historical experiments remain under `prototypes/`. Their original fonts and
engraving assets remain under `src/fonts/` and `src/plates/` so those prototypes
can still be viewed. Production publishes assets only from `site/assets/`.

Application code and original artwork are released under the [MIT License](LICENSE).
Font and historical-asset licenses retain their own terms.

## Optional artwork authoring

The website build never downloads models or invokes Blender. To recreate the
public model renders, use a cache outside the public repository:

```sh
node scripts/fetch-art-models.mjs /path/to/private-model-cache
blender --background --factory-startup --disable-autoexec --python scripts/render-model-library.py -- --manifest site/artwork.json --cache /path/to/private-model-cache --output /path/to/renders --hdri /path/to/studio_small_09_1k.hdr
```

The downloader verifies the recorded source checksums and restricts model
resources to their declared package. The renderer selects the intended mesh
objects and fits their camera-space bounds without clipping. Rendering was
verified with Blender 5.2.1. Image compression uses WebP at quality 82 in 320,
480, and 720px variants.

`site/artwork.json` controls the collection and explicit repository assignments.
New repositories receive an unused object when one is available. If a future
catalog outgrows the library, reuse is balanced so artwork never blocks a
project from being published.
