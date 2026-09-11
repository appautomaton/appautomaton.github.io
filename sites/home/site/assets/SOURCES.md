# Production assets

## Type and marks

Uncut Sans Regular and Medium by Kasper Nordkvist is self-hosted from
https://github.com/kaspernordkvist/uncut_sans, revision
`b3b42467781e3bd98c68f2d70eba325196e7d9c5`. Its SIL Open Font License is retained
in `fonts/UncutSans-LICENSE.txt`. No Google Fonts request is used.

The rounded-square outline and circular core adapt App Automaton's existing
brand mark. Interface SVGs are authored in `scripts/interface.mjs`.

## Public model collection

The `art/model-*.webp` images are our renders of public CC0 models from
[Poly Haven](https://polyhaven.com/models). Model titles, individual artists,
source pages, licenses, viewing angles, selected mesh objects, and image
descriptions are recorded in `site/artwork.json`. The exact source files and
SHA-256 checksums are recorded in `site/artwork-sources.json`.

All source models are freely downloadable from their linked original pages.
The public colophon provides a browsable gallery with artist credits.
The lighting environment is [Studio Small 09](https://polyhaven.com/a/studio_small_09)
by Sergej Majboroda, also CC0. These assets were selected for different
silhouettes and materials, including optical instruments, paper, wood, shells,
stone, bronze, and sound equipment.

Source glTF files, binary buffers, textures, and intermediate PNGs live in the
private brand workspace. They are not deployed or loaded in the browser.
The page uses responsive 320, 480, and 720px WebP renders.

## Original work

The aperture, folio, wave, lens, knot, orbital instrument, and architectural
scenes are original Blender work authored by `scripts/render-art.py`. Earlier
SVG sculpture experiments remain in `scripts/sculptures.mjs`. Historical
prototype assets retain their separate provenance under `src/plates/SOURCES.md`.

Floema (https://floema.com/en) informed the original spatial composition and
editorial rhythm. None of its assets are redistributed.

The share image combines the current artwork, original SVG brand mark, and
licensed type. `scripts/social-preview.mjs` creates local export canvases that
are excluded from publication.
