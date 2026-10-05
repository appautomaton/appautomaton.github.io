# Setloom website module

Public mount: `/setloom/`. Static source: `public/`.

Imported byte-for-byte from the successful [Setloom Pages run](https://github.com/appautomaton/setloom/actions/runs/34728403349)
at commit `ff29f4e20328d565da3cc8728556219b340a8dcf`, which includes the merged
copy revision from PR #10. The artifact's nine published files match the hashes
in `registry/baselines.json`.

Use the root build and preview commands. `public/og-card.html` is the social-card
source, not a content route. Setloom is now centrally published at `/setloom/`.
Its former Pages configuration, website workflow, and website-only source were
retired after the route was verified. Runtime code and technical documentation
stay in the Setloom repository. See the imported [license](LICENSE).

## Redesign (2026-10-05)

The page was redesigned after import, so it no longer matches the historical
baseline in `registry/baselines.json`; that record is kept as provenance.

- The page is a score and scrolling is its transport: a played five-line staff
  in the hero, a ring for the six-step loop, and a final barline in the footer.
  Motion is CSS scroll-driven animation plus a small script for scroll speed,
  direction and icon playback. It honours `prefers-reduced-motion`. Nothing on
  the page plays audio.
- Type: Outward Block (Velvetyne, OFL, self-hosted in `assets/fonts/` with its
  licence) for the name only; Melodrama, Supreme and Tabular from Fontshare.
  Palette: Bone and Acid, light and dark.
- The words are written as answers to the questions people and agents ask, and
  every visible fact is mirrored in the page's JSON-LD and in `llms.txt`.
- `og-card.html` is the source of `og-card.png`; `assets/mark.svg` is the source
  of `assets/touch-icon.png` (rendered at 180 × 180).
