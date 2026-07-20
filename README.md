<div align="center">

<img src="./public/favicon.svg" alt="App Automaton" width="88" height="88">

# App Automaton

**Portable systems for agents, Apple silicon, and creative computation.**

The open-source workshop of [AppCubic](https://www.appcubic.com/), built in public and shaped by real production work.

[![Visit the workshop](https://img.shields.io/badge/Visit_the_workshop-appautomaton.renocrypt.com-315c52?style=for-the-badge&logo=githubpages&logoColor=white)](https://appautomaton.renocrypt.com/)

[![Deploy to GitHub Pages](https://github.com/appautomaton/appautomaton.github.io/actions/workflows/deploy.yml/badge.svg)](https://github.com/appautomaton/appautomaton.github.io/actions/workflows/deploy.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-7c6f64?style=flat-square)](./LICENSE)
[![React 19](https://img.shields.io/badge/React-19-149eca?style=flat-square&logo=react&logoColor=white)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-6-3178c6?style=flat-square&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-8-646cff?style=flat-square&logo=vite&logoColor=white)](https://vite.dev/)

[Production](https://appautomaton.renocrypt.com/) · [GitHub organization](https://github.com/appautomaton) · [AppCubic](https://www.appcubic.com/) · [RenoCrypt](https://www.renocrypt.com/)

</div>

---

## The workshop

App Automaton is where AppCubic publishes the tools it uses to make agents more capable, inspectable, and useful. The catalog gathers the organization’s public work into four shelves, from portable agent instructions to native machine-learning systems for Apple silicon.

| Shelf | What lives there |
| --- | --- |
| **SKILLs** | Portable capabilities for coding agents, designed to travel cleanly across Claude Code, Codex, Gemini, and OpenCode. |
| **Runtimes** | Stage-gated harnesses for orchestration, browser work, document production, and repeatable agent workflows. |
| **MLX** | Pure-MLX speech, vision, spatial, and generative systems built for Apple silicon. |
| **Creative** | The same disciplined machinery turned toward performance, sound, and creative tooling. |

Visit the living catalog at **[appautomaton.renocrypt.com](https://appautomaton.renocrypt.com/)**.

## A cabinet of machines

The site borrows the visual language of an eighteenth-century cabinet theater: mechanical drawings, engraved automata, celadon paper, sepia ink, and a stage that darkens into silver sage at night.

- [Vite](https://vite.dev/) and [React 19](https://react.dev/) provide the application shell, with TypeScript throughout.
- [Astryx](https://github.com/facebook/astryx), Meta’s open design system, supplies the component and token layer. The visual identity resolves from one `defineTheme()` call in `src/theme.ts` plus a small set of atmosphere variables.
- League Gothic, Gambetta, and Martian Mono are self-hosted. Their licenses live beside the font files in `src/fonts/LICENSES/`.
- Six public-domain or CC0 engravings are recolored live with CSS filters. Sources and rights notes are recorded in `src/plates/SOURCES.md`.

## Run it locally

```sh
npm install
npm run dev
```

For a production build:

```sh
npx playwright install chromium
npm run build
```

The build type-checks the project, bundles it with Vite, and runs `scripts/prerender.mjs`. That final pass renders the complete catalog into `dist/index.html`, so crawlers and no-JavaScript clients receive meaningful HTML rather than an empty application shell.

## Content as a system

`src/data/catalog.ts` is the source of truth for shelves, cards, counts, links, and JSON-LD. Agent-facing copy is mirrored in `public/llms.txt`; discovery metadata lives in `public/robots.txt` and `public/sitemap.xml`.

The rule is simple: change the catalog once, then let every public representation derive from it.

## Delivery

Every push to `main` runs [the GitHub Pages workflow](./.github/workflows/deploy.yml): install from the lockfile, provision Chromium, build and prerender, upload the Pages artifact, then deploy it. The production home is [appautomaton.renocrypt.com](https://appautomaton.renocrypt.com/).

### Pages routing contract

This organization site deliberately does not claim bare one-segment paths such as `/some-project/`. GitHub Pages reserves those paths for project sites, and a page here would silently collide with a repository’s own deployment. New landing-site routes therefore live beneath a namespace such as `/projects/<slug>/`.

## The wider constellation

App Automaton belongs to a small family of work with distinct public faces:

- **[AppCubic](https://www.appcubic.com/)** is the applied AI studio behind the workshop: systems, research, and ventures carried through to production.
- **[RenoCrypt](https://www.renocrypt.com/)** is the long-form technical publication: machine learning, systems, and security with the mathematics and working code intact.
- **[App Automaton](https://appautomaton.renocrypt.com/)** is the open-source shelf: reusable skills, runtimes, MLX implementations, and creative machinery.

## License

The application code is released under the [MIT License](./LICENSE). League Gothic and Martian Mono retain their OFL terms; Gambetta retains the ITF Free Font License. The engraved source material is public domain or CC0, with provenance documented in `src/plates/SOURCES.md`.

---

<div align="center">

Built in public by [App Automaton](https://github.com/appautomaton) · An open-source workshop of [AppCubic](https://www.appcubic.com/)

</div>
