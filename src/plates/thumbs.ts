import gears from './gears.webp'
import cloudMachine from './cloud-machine.webp'
import stageTrio from './stage-trio.webp'
import comedie from './comedie-section.webp'
import schouwburg from './schouwburg.webp'
import duck from './duck.webp'
import imprimerie from './imprimerie.webp'
import cameraObscura from './camera-obscura.webp'
import magicLantern from './magic-lantern.webp'
import serinette from './serinette.webp'
import durerPerspective from './durer-perspective.webp'

// ---------------------------------------------------------------------------
// Card art: an engraved detail matched to what each unit does, cropped live
// with object-position/scale. `layout` picks the card species — plate on
// top, plate below the text, a side strip, or an image-led split — and
// units with no entry set as pure type. The distribution across each shelf
// is curated by hand so no two neighboring cases repeat a shape; it should
// read as arranged, never templated. Decorative throughout: alt="".
// ---------------------------------------------------------------------------

export type CardArt = {
  src: string
  layout: 'top' | 'bottom' | 'side' | 'split'
  /** object-position crop window into the plate */
  position?: string
  /** extra zoom into the detail */
  scale?: number
}

// The catalog's spans were drawn for a flat 12-track flow. The featured
// cases now stand two rows tall, which changes the packing arithmetic, so
// the desktop grid re-deals widths here: every visual row sums to twelve
// tracks with the tall tiles accounted for — flush columns, no voids.
// Layout concern only; catalog.ts stays untouched.
export const layoutSpans: Record<string, number> = {
  // Act I — agent-designer 7×2 tall; document + presentation stack beside
  // it at 5; the three quiet cases close the act at 4 + 4 + 4.
  presentation: 5,
  webmaton: 4,
  'playwright-skill': 4,
  'latex-arxiv-SKILL': 4,
  // Act II — automux 7×2 tall; automaton + openclaw stack beside it at 5;
  // markmaton + docker close at 6 + 6.
  'openclaw-monorepo': 5,
  markmaton: 6,
  'docker-for-apple-container': 6,
  // Act III — mlx-speech 8×2 tall; tnt-asr + ltx-video stack beside it at
  // 4; camera obscura and Dürer close at 6 + 6.
  'mlx-cv': 6,
  'mlx-spatial': 6,
}

export const cardArt: Record<string, CardArt> = {
  // --- Act I · SKILLs --- (top L, top, side, type, bottom, bottom)
  // The skills workspace — the whole stage, all three automata at work.
  'agent-designer': { src: stageTrio, layout: 'top', position: '50% 30%', scale: 1.15 },
  // Documents — the Encyclopédie's composing room, type set by hand.
  'document-SKILLs': { src: imprimerie, layout: 'top', position: '50% 22%', scale: 1.3 },
  // Decks presented to the room — the Schouwburg stage, a tall side strip.
  presentation: { src: schouwburg, layout: 'side', position: '50% 42%', scale: 1.7 },
  // webmaton: pure type — the catalog needs quiet cases too.
  // Browser automation performs the script — the drummer, below the text.
  'playwright-skill': { src: stageTrio, layout: 'bottom', position: '86% 32%', scale: 2.1 },
  // Papers — the printed page under the compositor's hands.
  'latex-arxiv-SKILL': { src: imprimerie, layout: 'bottom', position: '50% 78%', scale: 1.6 },

  // --- Act II · Harnesses & runtimes --- (top, top L, type, side, bottom)
  // A stage-gated harness — the clock's gear train, one wheel driving the next.
  automaton: { src: gears, layout: 'top', position: '50% 26%', scale: 1.35 },
  // Multi-agent orchestration — the cloud machine: many set pieces, one rig.
  automux: { src: cloudMachine, layout: 'top', position: '50% 20%', scale: 1.5 },
  // openclaw-monorepo: pure type.
  // HTML to Markdown — the roof truss: structure carrying structure.
  markmaton: { src: comedie, layout: 'side', position: '52% 10%', scale: 2.4 },
  // Containers — the duck's pedestal, a box that holds a machine.
  'docker-for-apple-container': { src: duck, layout: 'bottom', position: '50% 72%', scale: 1.45 },

  // --- Act III · On-device MLX --- (top L, type, top, bottom, side)
  // Speech from a machine — the flute player, breath made mechanical.
  'mlx-speech': { src: stageTrio, layout: 'top', position: '12% 30%', scale: 1.9 },
  // tnt-asr: pure type.
  // Moving pictures — Kircher's magic lantern throwing an image on the wall.
  'ltx-video-mlx': { src: magicLantern, layout: 'top', position: '42% 40%', scale: 1.2 },
  // Vision — Kircher's camera obscura, the world drawn through a lens.
  'mlx-cv': { src: cameraObscura, layout: 'bottom', position: '50% 45%', scale: 1.3 },
  // Spatial understanding — Dürer's perspective machine, a tall side strip.
  'mlx-spatial': { src: durerPerspective, layout: 'side', position: '48% 45%', scale: 1.8 },

  // --- Act IV · Creative --- (split marquee)
  // Mechanical music with the human at the taste gate — the serinette,
  // a bird-organ played to teach a living bird its song. Image-led.
  setloom: { src: serinette, layout: 'split', position: '50% 26%', scale: 1.15 },
}
