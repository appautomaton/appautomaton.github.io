# appautomaton.github.io

The landing page for [App Automaton](https://appautomaton.github.io/), the open-source workshop of AppCubic. It catalogs everything public on four shelves: SKILLs for coding agents, harnesses and runtimes, pure-MLX work for Apple silicon, and creative harnesses.

## Stack

- [Vite](https://vite.dev) + React 19, TypeScript
- [Astryx](https://github.com/facebook/astryx), Meta's open design system, as the component and token layer. The whole visual identity is a single `defineTheme()` call in `src/theme.ts` plus a small set of vibe variables.
- Self-hosted fonts: League Gothic (display, OFL), Gambetta (body, ITF Free Font License), Martian Mono (labels and metadata, OFL). Each font's license ships in `src/fonts/LICENSES/`.
- Six public-domain/CC0 engravings — Vaucanson's automata on their 1738 stage, a Rijksmuseum rocaille cartouche, the Encyclopédie's cloud-machine and Comédie-Française plates, the Amsterdam Schouwburg — recolored live with CSS filters: sepia-ink on celadon paper by day, limelight silver-sage on the darkened house by night. Sources and license notes in `src/plates/SOURCES.md`.

## Develop

```sh
npm install
npm run dev
```

## Build

```sh
npm run build
```

The build typechecks, bundles, then runs `scripts/prerender.mjs`, which renders the page in headless Chromium and writes the result back to `dist/index.html`. Crawlers that skip JavaScript still see the full catalog as static HTML. The prerender needs a Playwright Chromium: `npx playwright install chromium`.

## Deploy

Pushes to `main` deploy through `.github/workflows/deploy.yml` (GitHub Pages, workflow build type).

## Content

The catalog lives in `src/data/catalog.ts` and is the single source of truth: the shelves, the cards, the unit counts, and the JSON-LD structured data all render from it. Agent-facing copy is mirrored in `public/llms.txt`.

One structural rule for this org: this site never owns a bare one-segment path like `/some-project/`, because project repos' own GitHub Pages resolve there and would silently shadow it. Any future page on this site lives under a two-segment path such as `/projects/<slug>/`.

## License

MIT for everything in this repo except the fonts, which keep their own licenses (OFL for League Gothic and Martian Mono, ITF Free Font License for Gambetta). The engravings in `src/plates/` are public domain or CC0. See `LICENSE`.
