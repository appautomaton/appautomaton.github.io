import { defineTheme } from '@astryxdesign/core/theme'

// ---------------------------------------------------------------------------
// App Automaton — "Cabinet Theater" theme. One theater, two showtimes.
//
// Day is the rehearsal: green-black ink on celadon laid paper. Night is the
// performance: limelight silver-sage on a darkened house. The green never
// becomes a brand color — it lives in the bias of the neutrals, in the
// patina on the plate numbers, and in one deep viridian accent.
//
// defineTheme covers the accent plus two type roles (heading/body). The mono
// role, the patina, and the engraving treatments ride a custom "vibe" —
// plain CSS custom properties set on a wrapper element — so day/night stays
// a pure token flip with no JS restyling. The engravings themselves are
// never edited: one filter stack re-tones every plate per mode.
// ---------------------------------------------------------------------------

export type Vibe = {
  fontMono: string
  /* patinated bronze for plate numbers and counts */
  patina: string
  /* the follow spot: a faint pool of light on the night cursor */
  lamp: string
  /* engraving finish per mode, plus the verdigris hover bloom */
  plateFilter: string
  plateBlend: string
  plateBloom: string
  /* inside a pressed card the plate re-prints in the opposite mode's ink */
  floodPlateFilter: string
  floodPlateBlend: string
  /* the press-print card flood is always the opposite mode's palette */
  floodBg: string
  floodText: string
  floodMuted: string
  floodAccent: string
  floodPatina: string
}

export const THEATER_VIBE_DAY: Vibe = {
  fontMono: "'Martian Mono', ui-monospace, monospace",
  patina: '#4E7D6C',
  lamp: 'rgba(0, 0, 0, 0)',
  plateFilter:
    'grayscale(1) sepia(0.3) hue-rotate(68deg) saturate(0.45) contrast(1.03) brightness(1.04)',
  plateBlend: 'multiply',
  plateBloom:
    'grayscale(1) sepia(0.5) hue-rotate(85deg) saturate(0.85) contrast(1.06) brightness(1.02)',
  floodPlateFilter:
    'grayscale(1) invert(0.92) sepia(0.45) hue-rotate(75deg) saturate(0.8) brightness(0.82) contrast(1.08)',
  floodPlateBlend: 'screen',
  floodBg: '#131A15',
  floodText: '#DCE4D4',
  floodMuted: '#8A9787',
  floodAccent: '#5FA284',
  floodPatina: '#7FA98F',
}

export const THEATER_VIBE_NIGHT: Vibe = {
  fontMono: "'Martian Mono', ui-monospace, monospace",
  patina: '#7FA98F',
  lamp: 'rgba(150, 200, 170, 0.05)',
  plateFilter:
    'grayscale(1) invert(0.92) sepia(0.45) hue-rotate(75deg) saturate(0.8) brightness(0.82) contrast(1.08)',
  plateBlend: 'screen',
  plateBloom:
    'grayscale(1) invert(0.88) sepia(0.7) hue-rotate(95deg) saturate(1.15) brightness(0.8) contrast(1.12)',
  floodPlateFilter:
    'grayscale(1) sepia(0.3) hue-rotate(68deg) saturate(0.45) contrast(1.03) brightness(1.04)',
  floodPlateBlend: 'multiply',
  floodBg: '#F2F3EA',
  floodText: '#1E241E',
  floodMuted: '#5F6A5D',
  floodAccent: '#2A5847',
  floodPatina: '#4E7D6C',
}

export const theaterTheme = defineTheme({
  name: 'app-automaton-theater',
  color: { accent: '#2A5847', neutralStyle: 'warm', contrast: 'standard' },
  typography: {
    scale: { base: 16, ratio: 1.25 },
    heading: { family: 'League Gothic', fallbacks: '"Arial Narrow", sans-serif' },
    body: { family: 'Gambetta', fallbacks: 'Georgia, serif' },
  },
  // multiplier: 0 zeroes every scalable radius — plates, plaques, and
  // playbills have sharp corners.
  radius: { base: 2, multiplier: 0 },
  motion: { fast: 120, medium: 260, ratio: 0.85 },
  tokens: {
    // Celadon laid paper by day; the darkened house by night.
    '--color-background-body': ['#E9EAE1', '#0E1310'],
    '--color-background-surface': ['#F2F3EA', '#151C17'],
    '--color-background-card': ['#F2F3EA', '#151C17'],
    '--color-background-popover': ['#F2F3EA', '#151C17'],
    '--color-border': ['#CDD0C0', '#28312A'],
    '--color-border-emphasized': ['#2A5847', '#5FA284'],
    '--color-accent': ['#2A5847', '#5FA284'],
    // Green-black intaglio ink on paper; limelight-washed paper on ink.
    '--color-text-primary': ['#1E241E', '#DCE4D4'],
    '--color-text-secondary': ['#5F6A5D', '#8A9787'],
  },
})
