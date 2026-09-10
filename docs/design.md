# An open workshop

The design treats the projects as a collection of useful objects. A held
opening gallery leads into four full-screen material studies, a typographic
collection index, and a complete searchable project list.

Floema inspired the staged image transitions, anchored typography, and the
alternation of large category names with small portrait images. Its products,
photographs, fonts, illustrations, and copy are not used here.

Self-hosted Uncut Sans uses regular weight, controlled line length, and close
tracking. Warm paper, green charcoal, cobalt, and mineral accent colors form
the day and night palettes. The brand mark preserves App Automaton's rounded
square and circular core.

## A collection with material character

Twenty-seven CC0 models from Poly Haven bring optical instruments, books,
woodworking tools, sound equipment, sculpture, and natural forms into the
collection. Each current project has a distinct object. `site/artwork.json`
records art direction, artists, licenses, and camera settings;
`site/artwork-sources.json` pins downloaded packages with checksums. Raw models
stay in a private authoring cache. The browser receives only responsive WebP
renders. The public colophon links to every source model and artist.

## Original material studies

`scripts/render-art.py` builds the sculptures and studio environments in a
fresh Blender scene. Ceramic folios, an anodized aperture, woven metal,
concentric lenses, a continuous knot, and an orbital instrument give the
collection a shared material vocabulary. These original forms and their materials, lighting, and cameras were authored
for this site. They complement the separately credited public model collection.

The script is an optional authoring tool. Run Blender with
`--background --factory-startup --python scripts/render-art.py -- --output PATH`,
then compress the PNG output with `cwebp`. The committed WebP assets are the
production inputs. A normal Node build requires neither Blender nor an image
encoder. The earlier vector studies remain in `scripts/sculptures.mjs` as
source experiments.

Curated artwork is assigned explicitly. New automatic entries receive spare
objects and retain that assignment through their GitHub repository ID.
The published registry preserves those choices across subsequent builds. Finished images are
reused across the gallery, index, and project list. Explicit dimensions reserve
space, and below-the-fold images load lazily. There is no canvas or WebGL runtime.

## Native scroll, separately timed layers

On sufficiently large viewports, the opening composition sticks to the top
while the first scene rises over it. The following four chapters share one
sticky stage. Incoming imagery begins its wipe before outgoing copy leaves.
Heading lines, supporting text, buttons, chapter numbers, and a thin progress
rule have separate timing. Scroll input remains native and is never intercepted.

One requestAnimationFrame callback processes scroll updates. Layout metrics
are measured on resize. The frame writes transforms and opacity without
reading layout again. It stops when idle or in the background. A chapter's
links are inert only while its enhanced presentation is out of view. The
complete collection below provides direct access to every project throughout.

Phones, short windows, motion-off mode, and visitors without JavaScript get
readable normal-flow chapters. Device reduced-motion preferences override the
persistent motion control. Toggling motion while reading a chapter preserves
that chapter's position. Keyboard focus on the opening gallery returns it to
view. Search and filters never delay links behind an animation.

The typographic index reveals portrait artwork while keeping labels at full
contrast. Process columns settle at staggered offsets. The footer introduces
its large lettering through a mask and extends its divider rule. All copy,
links, structured data, and discovery files exist in the built HTML.

## Review

Inspect phone, tablet, desktop, and wide layouts in both palettes. Test the
middle of transitions as well as their endpoints. Verify keyboard access,
search and filters, empty/reset states, index links, motion persistence,
reduced-motion handling, and the page with scripts blocked. Read detailed
audit findings and measure the eventual public deployment independently.
