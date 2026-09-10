# App Automaton

An open workshop for coding agents, local intelligence, and creative tools.

[Explore the website](https://appautomaton.com/) · [GitHub organization](https://github.com/appautomaton) · [RenoCrypt field guide](https://appautomaton.renocrypt.com/)

## The website

The page is complete HTML, with original rendered sculptures and SVG interface marks,
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
automatically, with a category derived from their name and topics. Editorial
placements override that fallback; explicit exclusions remain excluded.

Project page availability, canonical metadata, modification dates, and
sitemaps are checked against the serving site. Definitive 404/410 responses
remove a page link. Access blocks, rate limits, and outages retain the previous
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

[Deploy to GitHub Pages](https://github.com/appautomaton/appautomaton.github.io/actions/workflows/deploy.yml) runs on pushes to main, pull requests, daily at
05:17 UTC, and manual dispatch. Pull requests produce a downloadable static
preview. Successful main builds deploy through GitHub Pages.

Scheduled public workflows can be disabled after prolonged repository
inactivity. GitHub schedules can also be delayed. A manual run is available
when an immediate refresh is needed.

This is the organization site. GitHub Pages serves separately maintained
project websites beneath `/<repository>/`. The root site does not replace
those directories. Its sitemap includes linked project homepages, and its
robots.txt declares the project sitemaps discovered by the build.

## Art and provenance

[Design notes](docs/design.md) describe the gallery and motion system.
Uncut Sans by Kasper Nordkvist is served under the SIL Open Font License.
The sculpture geometry, studio lighting, and SVG interface marks were authored
for this website. [Asset provenance](site/assets/SOURCES.md) records their
origins. Floema was a reference for spatial composition and editorial rhythm;
its assets are not used here.

Historical experiments remain under `prototypes/`. Their original fonts and
engraving assets remain under `src/fonts/` and `src/plates/` so those prototypes
can still be viewed. Production publishes assets only from `site/assets/`.

Application code and original artwork are released under the [MIT License](LICENSE).
Font and historical-asset licenses retain their own terms.
