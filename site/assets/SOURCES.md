# Production assets

- **Uncut Sans Regular and Medium** by Kasper Nordkvist. Original WOFF2 files
  from https://github.com/kaspernordkvist/uncut_sans, revision
  `b3b42467781e3bd98c68f2d70eba325196e7d9c5`. SIL Open Font License 1.1,
  retained in `fonts/UncutSans-LICENSE.txt`. No Google Fonts request is used.
- **Sculptural objects and architectural scenes** are original Blender renders
  authored by `scripts/render-art.py`. The committed `art/*.webp` files are
  compressed from those renders. No third-party model, photograph, texture,
  or generative-image service is used.
- **Brand mark** is a hand-authored SVG variant of App Automaton's existing
  rounded-square outline and circular core. Interface icons are authored in
  `scripts/interface.mjs`. The earlier SVG sculpture experiments remain in
  `scripts/sculptures.mjs` and are not used as production imagery.

Floema (https://floema.com/en) was studied as a design reference. None of its
assets are redistributed. Historical prototype assets have their separate
provenance under `src/plates/SOURCES.md`; production does not copy them.

The share image and touch icon were rendered from these original images, SVGs, and
licensed fonts. `scripts/social-preview.mjs` creates local export canvases at
1200×630 and 180×180. The resulting PNGs are committed assets, while the
preview documents are excluded from publication.
