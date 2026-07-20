<div align="center">

<img src="./public/favicon.svg" alt="App Automaton" width="88" height="88">

# App Automaton

**Open-source research and engineering for collaborative agents, context-rich systems, and efficient machine intelligence.**

App Automaton is the public engineering workshop of [AppCubic](https://www.appcubic.com/).

[![Production](https://img.shields.io/badge/Production-appautomaton.renocrypt.com-315c52?style=for-the-badge)](https://appautomaton.renocrypt.com/)

[![Deploy to GitHub Pages](https://github.com/appautomaton/appautomaton.github.io/actions/workflows/deploy.yml/badge.svg)](https://github.com/appautomaton/appautomaton.github.io/actions/workflows/deploy.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-665f57?style=flat-square)](./LICENSE)
[![Open source](https://img.shields.io/badge/Open_source-App_Automaton-315c52?style=flat-square)](https://github.com/appautomaton)

[Production](https://appautomaton.renocrypt.com/) · [GitHub](https://github.com/appautomaton) · [AppCubic](https://www.appcubic.com/) · [RenoCrypt](https://www.renocrypt.com/)

</div>

---

## Engineering intelligence as a system

Capable models are only one component of capable software. Reliable intelligent systems also require disciplined delegation, deliberate context construction, explicit tool boundaries, durable state, and verification at every consequential transition.

App Automaton develops those layers together. The work spans multi-agent coordination, reusable capability packages, research and document pipelines, browser-grounded retrieval, native model implementations, and the infrastructure required to operate them. Projects are published as working systems rather than isolated demonstrations: interfaces are inspectable, workflows are reproducible, and outputs are designed to be checked.

### The engineering position

| Principle | Consequence |
| --- | --- |
| **Collaboration is an architecture.** | Delegation needs ownership, isolation, resumable state, and review boundaries. More agents do not produce better work unless coordination is designed. |
| **Context is infrastructure.** | Retrieval, transformation, provenance, persistence, and selective disclosure are part of the system, not prompt decoration. |
| **Models are software.** | Implementation quality, memory behavior, throughput, portability, and integration determine whether model capability survives contact with a real machine. |
| **Verification closes the loop.** | A workflow is incomplete until its claims, artifacts, and operational postconditions have been tested. |

## Programs

The organization’s public work is arranged into four connected programs.

### Collaborative agents

Agent systems that preserve intent across delegation and execution.

- [`agent-designer`](https://github.com/appautomaton/agent-designer) develops portable agent capabilities, MCP tool catalogs, and bridges for agent-to-agent delegation with session continuity.
- [`automaton`](https://github.com/appautomaton/automaton) turns frame, plan, review, execution, and verification into an explicit stage-gated protocol.
- [`automux`](https://github.com/appautomaton/automux) coordinates parallel agents through tmux or kitty, isolated Git worktrees, and file-based state.

### Context and capability engineering

Tools that acquire evidence, transform it without losing structure, and deliver it in forms that agents and people can inspect.

- [`webmaton`](https://github.com/appautomaton/webmaton) combines grounded research, persistent browser sessions, citations, and deterministic HTML-to-Markdown conversion.
- [`document-SKILLs`](https://github.com/appautomaton/document-SKILLs) provides portable workflows for DOCX, XLSX, PPTX, and PDF, including tracked changes, formulas, forms, and structured extraction.
- [`presentation`](https://github.com/appautomaton/presentation) carries analytical intent through story architecture into high-fidelity PDF and editable PowerPoint deliverables.
- [`markmaton`](https://github.com/appautomaton/markmaton) supplies a Go conversion engine and Python interface for dependable HTML-to-Markdown pipelines.

### Model engineering on Apple silicon

Native implementations that treat local execution as an engineering target, not a compatibility afterthought.

- [`mlx-speech`](https://github.com/appautomaton/mlx-speech) covers speech synthesis, recognition, voice cloning, dialogue, and sound generation on MLX.
- [`mlx-cv`](https://github.com/appautomaton/mlx-cv) implements detection, segmentation, and open-vocabulary grounding.
- [`mlx-spatial`](https://github.com/appautomaton/mlx-spatial) brings 3D object, reconstruction, and spatial inference systems to Apple hardware.
- [`ltx-video-mlx`](https://github.com/appautomaton/ltx-video-mlx) supports multimodal video generation and on-device LoRA training.
- [`tnt-asr`](https://github.com/appautomaton/tnt-asr) turns local speech recognition into a responsive terminal instrument.

### Creative systems

The same methods applied where technical correctness is necessary but human judgment remains decisive.

- [`setloom`](https://github.com/appautomaton/setloom) is a stage-gated co-production environment for club music, producing editable tracks, stems, renders, and listening notes while preserving the human taste gate.

The complete and current index lives at **[appautomaton.renocrypt.com](https://appautomaton.renocrypt.com/)**.

## This repository

This repository is the presentation and discovery layer for the organization. The implementation is intentionally small:

| Layer | Source of truth |
| --- | --- |
| Project catalog and JSON-LD | `src/data/catalog.ts` |
| Visual system | `src/theme.ts` and the Astryx token layer |
| Agent-readable index | `public/llms.txt` |
| Search discovery | `public/robots.txt` and `public/sitemap.xml` |
| Delivery | `.github/workflows/deploy.yml` |

The site uses React 19, TypeScript, and Vite. Its production build runs `tsc`, bundles the application, then executes a Playwright prerender pass that writes meaningful HTML into `dist/index.html`. JavaScript-capable clients receive the full interactive application; crawlers and constrained clients still receive the complete catalog.

### Visual system

The `Cabinet Theater` theme is implemented as a token system rather than a layer of page-specific overrides. Astryx defines the component vocabulary; `src/theme.ts` defines paired day and night palettes, typography, motion, and engraving treatments. League Gothic, Gambetta, and Martian Mono are self-hosted, with their licenses stored beside the font assets. Every historical plate is public domain or CC0 and documented in `src/plates/SOURCES.md`.

## Development

```sh
npm install
npm run dev
```

Build the same artifact used by production:

```sh
npx playwright install chromium
npm run build
```

Every push to `main` runs the [GitHub Pages deployment](./.github/workflows/deploy.yml): locked dependency installation, Chromium provisioning, type-checking, bundling, prerendering, artifact upload, and deployment.

### Routing contract

The organization site does not claim bare one-segment paths such as `/some-project/`. GitHub Pages uses those paths for repository-owned project sites; duplicating one here would create an ambiguous deployment boundary. New landing-site routes therefore live beneath an explicit namespace such as `/projects/<slug>/`.

## Institutional context

- **[AppCubic](https://www.appcubic.com/)** is the applied AI studio behind the work, carrying research, systems, and ventures through to production.
- **[RenoCrypt](https://www.renocrypt.com/)** publishes long-form work on machine learning, systems, and security, with derivations, benchmarks, and code kept close to the claims.
- **[App Automaton](https://appautomaton.renocrypt.com/)** publishes the reusable engineering: agent systems, capability infrastructure, model implementations, and creative tools.

## License and provenance

The application code is released under the [MIT License](./LICENSE). League Gothic and Martian Mono retain their OFL terms; Gambetta retains the ITF Free Font License. Historical image sources and rights statements are recorded in `src/plates/SOURCES.md`.

---

<div align="center">

[App Automaton](https://github.com/appautomaton) · Open-source research and engineering from [AppCubic](https://www.appcubic.com/)

</div>
