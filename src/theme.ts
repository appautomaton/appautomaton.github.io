import { defineTheme } from '@astryxdesign/core/theme'

// ---------------------------------------------------------------------------
// App Automaton — "Workshop" theme. One theme, day + night.
//
// defineTheme covers one accent (Verdigris) and two type roles (heading/body).
// It has no slot for a second accent or a mono role, so those ride a custom
// "vibe" — plain CSS custom properties set on a wrapper element — the same
// pattern proven in Vena for anything defineTheme's token list doesn't cover.
// ---------------------------------------------------------------------------

export type Vibe = {
  brass: string
  fontMono: string
  /* drafting-paper grid line, kept near-invisible */
  gridLine: string
  /* workbench lamp glow for the night cursor spotlight */
  lamp: string
}

export const WORKSHOP_VIBE_DAY: Vibe = {
  brass: '#9C6B2E',
  fontMono: "'Routed Gothic', ui-monospace, monospace",
  gridLine: 'rgba(96, 74, 42, 0.055)',
  lamp: 'rgba(0, 0, 0, 0)',
}

export const WORKSHOP_VIBE_NIGHT: Vibe = {
  brass: '#C08A3E',
  fontMono: "'Routed Gothic', ui-monospace, monospace",
  gridLine: 'rgba(214, 158, 84, 0.05)',
  lamp: 'rgba(216, 160, 88, 0.09)',
}

export const workshopTheme = defineTheme({
  name: 'app-automaton-workshop',
  color: { accent: '#3F6E60', neutralStyle: 'warm', contrast: 'standard' },
  typography: {
    scale: { base: 16, ratio: 1.25 },
    heading: { family: 'Sirin Stencil', fallbacks: '"Arial Narrow", sans-serif' },
    body: { family: 'Secuela', fallbacks: '"Helvetica Neue", sans-serif' },
  },
  // multiplier: 0 zeroes every scalable radius (inner/element/container/page) —
  // sharp, stamped-metal corners, not Astryx's default soft-rounded card.
  radius: { base: 2, multiplier: 0 },
  motion: { fast: 120, medium: 260, ratio: 0.85 },
  tokens: {
    '--color-background-body': ['#F3EEE3', '#241C15'],
    '--color-background-surface': ['#E8E0CE', '#2F251C'],
    '--color-background-card': ['#E8E0CE', '#2F251C'],
    '--color-background-popover': ['#E8E0CE', '#2F251C'],
    '--color-border': ['#c9bea3', '#493a29'],
    '--color-border-emphasized': ['#9C6B2E', '#C08A3E'],
    '--color-accent': ['#3F6E60', '#5B8A7C'],
  },
})
