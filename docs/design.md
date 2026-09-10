# An open workshop

The design treats the projects as a collection of useful objects. A quiet
reading area sits within a floating gallery, followed by large editorial
studies and a complete, searchable catalog.

Floema inspired the spatial composition, pill navigation, and movement from
small objects to larger scenes. Its products, photographs, illustration,
font files, and copy are not used here.

Uncut Sans supplies a clear, open voice. The paired palettes use warm paper,
soft mineral colors, and deep green charcoal. Original architectural marks
connect the wordmark, navigation, and collection labels.

## Sculptures

`scripts/sculptures.mjs` computes geometry, projection, lighting, and SVG at
build time. The objects include layered sheets, structural portals, wave
surfaces, lenses, knots, molecular studies, and fields of columns. Repository
metadata selects a family; a stable name-derived seed varies its pose.

The browser loads ordinary SVG images. No model loader, canvas, WebGL engine,
or geometry calculation runs in the page. Images have explicit dimensions.
Gallery and catalog images share URLs so the browser can reuse them.

## Motion and reading

The main title and project descriptions are visible immediately. There is no
loading curtain or text reveal. Scroll remains native. Individual objects
float on separate transform layers while the gallery responds gently to the
pointer and scroll position. The frame loop stops after that response settles.

Supported browsers use native scroll timelines for the large studies. Other
browsers retain the static composition. Palette changes use a short native
View Transition where available. Filtering updates the content immediately,
then interpolates the positions of visible results.

A persistent Motion control pauses presentation effects. Device reduced-motion
preferences take precedence. Background tabs pause continuous animation, and
the opening gallery stops when it leaves the viewport. All content and project
links remain available without JavaScript.

## Review

Inspect phone, tablet, desktop, and wide desktop layouts in both palettes.
Exercise keyboard navigation, search combined with filters, empty and reset
states, story-to-catalog links, motion persistence, reduced motion, and the
page without JavaScript. Read detailed accessibility findings as well as the
headline scores. Measure the actual public deployment after changes ship.
