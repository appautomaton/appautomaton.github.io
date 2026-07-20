<div align="center">

<img src="./public/favicon.svg" alt="App Automaton" width="88" height="88">

# App Automaton

**Open-source research and engineering for collaborative agents, context-rich systems, and efficient machine intelligence.**

An [AppCubic](https://www.appcubic.com/) workshop.

[![Production](https://img.shields.io/badge/Production-appautomaton.renocrypt.com-315c52?style=flat-square)](https://appautomaton.renocrypt.com/)
[![Deploy to GitHub Pages](https://github.com/appautomaton/appautomaton.github.io/actions/workflows/deploy.yml/badge.svg)](https://github.com/appautomaton/appautomaton.github.io/actions/workflows/deploy.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-665f57?style=flat-square)](./LICENSE)

[Production](https://appautomaton.renocrypt.com/) · [GitHub](https://github.com/appautomaton) · [AppCubic](https://www.appcubic.com/) · [RenoCrypt](https://www.renocrypt.com/)

</div>

---

## Scope

App Automaton develops the working layers around model capability: coordination between agents, the construction of context, and efficient model execution on real hardware.

Projects are released as reusable tools with inspectable interfaces, resumable workflows, and verifiable outputs.

### Engineering focus

**Collaborative agents.** Clear ownership, isolated execution, and durable state for work that spans multiple agents.

**Context-rich systems.** Grounded retrieval, explicit provenance, and controlled context across the full workflow.

**Efficient machine intelligence.** Model capability preserved through implementation, optimization, and integration.

Verification is designed into each layer.

## Selected work

### Capabilities

Portable skills for delegation, research, browser control, documents, presentations, and technical writing.

[`agent-designer`](https://github.com/appautomaton/agent-designer) · [`document-SKILLs`](https://github.com/appautomaton/document-SKILLs) · [`presentation`](https://github.com/appautomaton/presentation) · [`webmaton`](https://github.com/appautomaton/webmaton) · [`playwright-skill`](https://github.com/appautomaton/playwright-skill) · [`latex-arxiv-SKILL`](https://github.com/appautomaton/latex-arxiv-SKILL)

### Harnesses and runtimes

Stage-gated execution, multi-agent worktrees, agent workspaces, data conversion, and native container operations.

[`automaton`](https://github.com/appautomaton/automaton) · [`automux`](https://github.com/appautomaton/automux) · [`openclaw-monorepo`](https://github.com/appautomaton/openclaw-monorepo) · [`markmaton`](https://github.com/appautomaton/markmaton) · [`docker-for-apple-container`](https://github.com/appautomaton/docker-for-apple-container)

### On-device intelligence

Speech, vision, video, and spatial systems implemented for Apple silicon.

[`mlx-speech`](https://github.com/appautomaton/mlx-speech) · [`tnt-asr`](https://github.com/appautomaton/tnt-asr) · [`ltx-video-mlx`](https://github.com/appautomaton/ltx-video-mlx) · [`mlx-cv`](https://github.com/appautomaton/mlx-cv) · [`mlx-spatial`](https://github.com/appautomaton/mlx-spatial)

### Creative systems

Human-led production with the same explicit stages and inspectable artifacts.

[`setloom`](https://github.com/appautomaton/setloom)

The full index is maintained at **[appautomaton.renocrypt.com](https://appautomaton.renocrypt.com/)**.

## This repository

This repository is the organization’s presentation and discovery layer.

| Layer | Source of truth |
| --- | --- |
| Project catalog and JSON-LD | `src/data/catalog.ts` |
| Visual system | `src/theme.ts` and Astryx design tokens |
| Agent-readable index | `public/llms.txt` |
| Search discovery | `public/robots.txt` and `public/sitemap.xml` |
| Delivery | `.github/workflows/deploy.yml` |

The application uses React 19, TypeScript, and Vite. Production builds run type-checking and bundling before a Playwright prerender writes the complete catalog into `dist/index.html`, preserving meaningful HTML for crawlers and constrained clients.

### Visual system

`Cabinet Theater` is implemented as a token system, not a collection of page-level overrides. Astryx supplies the component vocabulary; `src/theme.ts` defines paired day and night palettes, typography, motion, and engraving treatments. Fonts are self-hosted with their licenses, and every historical plate is public domain or CC0 with provenance recorded in `src/plates/SOURCES.md`.

## Development and delivery

```sh
npm install
npm run dev
```

Build the production artifact:

```sh
npx playwright install chromium
npm run build
```

Every push to `main` runs the [GitHub Pages workflow](./.github/workflows/deploy.yml): locked dependency installation, Chromium provisioning, type-checking, bundling, prerendering, artifact upload, and deployment.

### Routing contract

The organization site does not claim bare one-segment paths such as `/some-project/`. GitHub Pages reserves those paths for repository-owned project sites. New landing-site routes therefore live beneath an explicit namespace such as `/projects/<slug>/`.

## Related work

- **[AppCubic](https://www.appcubic.com/)** carries applied AI research, systems, and ventures through to production.
- **[RenoCrypt](https://www.renocrypt.com/)** publishes long-form work on machine learning, systems, and security, keeping derivations, benchmarks, and code close to the claims.

## License and provenance

The application code is released under the [MIT License](./LICENSE). League Gothic and Martian Mono retain their OFL terms; Gambetta retains the ITF Free Font License. Historical image sources and rights statements are recorded in `src/plates/SOURCES.md`.

---

<div align="center">

[App Automaton](https://github.com/appautomaton) · An [AppCubic](https://www.appcubic.com/) workshop

</div>
