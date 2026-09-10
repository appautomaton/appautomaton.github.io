# App Automaton website

This repository serves `https://appautomaton.com/`, the organization site for
`appautomaton`. Repository-owned project sites share this hostname beneath
`/<repository>/`. Preserve those routes; organization-page routes must not claim
bare project directories.

- Production source is `site/assets/` and `scripts/build.mjs`. Generate complete
  HTML with Node 24. Browser JavaScript is a progressive enhancement, with no
  framework, runtime data fetch, or content hidden behind a loading animation.
- Project facts come from `scripts/sync-catalog.mjs`; editorial placement lives
  in `src/data/shelves.ts`. New public sites with a validated About URL and a
  working page enter automatically through `scripts/catalog-policy.mjs`;
  explicit placements and exclusions override the fallback classification. Use the joined catalog for visible links, structured
  data, text output, and sitemaps. Do not invent project destinations.
- Keep production indexable and project links normally followable. Preserve
  discovery checks, API pagination, daily/manual refresh, and failure behavior.
- Use original artwork and licensed local fonts. No Google Fonts. Retain asset
  provenance. Historical fonts and plates under `src/` support the archived
  prototypes and are not part of the production asset pipeline.
- Keep scroll native, respect reduced motion, and provide keyboard access and
  a persistent motion control. Verify performance on the deployed result.
- Write precise, human copy without mid-sentence em dashes or habitual semicolons.
- Keep private plans and account-only audit observations in the parent App
  Automaton workspace, outside this public repository.
