# appautomaton.github.io

Landing page for the App Automaton GitHub org. Published at <https://appautomaton.github.io>.

## What's here

A static HTML/CSS/JS site with no build step and no framework. The page introduces the org's open-source work: SKILLs for coding agents (Claude Code, Codex, Gemini, OpenCode), the runtimes that hold them together, and a small constellation of pure-MLX models for Apple Silicon.

## Stack

- Plain HTML, CSS, and a small vanilla `app.js` for the install-tab and clipboard-copy interactions.
- [Lucide](https://lucide.dev) icons (pinned version) for small functional icons; the GitHub mark is inline SVG.
- Theme system: five palettes (amber, blue, graphite & violet, verdigris & copper, mono ink) × day/night mode. Driven by `data-palette` / `data-mode` attributes on `<html>`, persisted in localStorage, defaulting to the OS color scheme. Switch via the header control or URL params (`?palette=verdigris&mode=night`).
- Design tokens in `styles/colors_and_type.css` (amber day is the base); all other palette and night overrides in `styles/themes.css`.

## Develop locally

```bash
python3 -m http.server 8080
# then open http://localhost:8080
```

Any static server will do. There is nothing to compile.

## File layout

```
index.html               page markup
agent-designer/          deep-dive page for the agent-designer repo
app.js                   install-tab switching, clipboard copy
theme.js                 palette/mode switcher logic
styles/
├── site.css             component styles
├── colors_and_type.css  design tokens (typography, spacing, motion)
├── themes.css           palette + night-mode overrides
└── fonts/
    └── Quicksand-wght.ttf
```

## Deployment

GitHub Pages publishes from `main` automatically. Each push to `main` triggers a rebuild; typically live within a minute.

## License

MIT.
