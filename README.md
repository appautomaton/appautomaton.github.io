# appautomaton.github.io

Landing page for the App Automaton GitHub org. Published at <https://appautomaton.github.io>.

## What's here

A static HTML/CSS/JS site — no build step, no framework. The page introduces the org's open-source work: SKILLs for coding agents (Claude Code, Codex, Gemini, OpenCode), the runtimes that hold them together, and a small constellation of pure-MLX models for Apple Silicon.

## Stack

- Plain HTML, CSS, and a small vanilla `app.js` for the install-tab and clipboard-copy interactions.
- [Lucide](https://lucide.dev) icons loaded from unpkg.
- Design tokens in `styles/colors_and_type.css`; the blue palette override in `styles/palette-blue.css`.

## Develop locally

```bash
python3 -m http.server 8080
# then open http://localhost:8080
```

Any static server will do — there is nothing to compile.

## File layout

```
index.html               page markup
app.js                   install-tab switching, clipboard copy
styles/
├── site.css             component styles
├── colors_and_type.css  design tokens (typography, spacing, motion)
├── palette-blue.css     blue palette override
└── fonts/
    └── Quicksand-wght.ttf
```

## Deployment

GitHub Pages publishes from `main` automatically. Each push to `main` triggers a rebuild; typically live within a minute.

## License

MIT.
