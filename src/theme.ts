import { defineTheme } from '@astryxdesign/core/theme'

// ---------------------------------------------------------------------------
// App Automaton — "Gallery" theme. One theme, day + night.
//
// A single cobalt accent on a neutral, faintly-cool gallery wall. defineTheme
// covers the one accent plus two type roles (heading/body). It has no slot for
// a mono role, so that rides a small custom "vibe" — plain CSS custom
// properties set on a wrapper element — alongside the day/night motion tints.
// ---------------------------------------------------------------------------

export type Vibe = {
  fontMono: string
  /* cool pool of light for the night cursor spotlight */
  lamp: string
  /* faint accent wash under a wall-label on hover, like a spotlight settling */
  cardHover: string
}

export const GALLERY_VIBE_DAY: Vibe = {
  fontMono: "'Routed Gothic', ui-monospace, monospace",
  lamp: 'rgba(0, 0, 0, 0)',
  cardHover: 'rgba(36, 69, 180, 0.05)',
}

export const GALLERY_VIBE_NIGHT: Vibe = {
  fontMono: "'Routed Gothic', ui-monospace, monospace",
  lamp: 'rgba(122, 160, 255, 0.06)',
  cardHover: 'rgba(122, 160, 255, 0.05)',
}

export const galleryTheme = defineTheme({
  name: 'app-automaton-gallery',
  // Cool neutrals carry a faint cobalt bias, so the wall and the accent read
  // as one family rather than a grey with a colour dropped on top.
  color: { accent: '#2445B4', neutralStyle: 'cool', contrast: 'standard' },
  typography: {
    scale: { base: 16, ratio: 1.25 },
    heading: { family: 'Sirin Stencil', fallbacks: '"Arial Narrow", sans-serif' },
    body: { family: 'Secuela', fallbacks: '"Helvetica Neue", sans-serif' },
  },
  // multiplier: 0 zeroes every scalable radius — sharp gallery-label corners,
  // not Astryx's default soft-rounded card.
  radius: { base: 2, multiplier: 0 },
  motion: { fast: 120, medium: 260, ratio: 0.85 },
  tokens: {
    // A neutral gallery wall: bone-white by day, cool charcoal by night.
    '--color-background-body': ['#F4F5F6', '#15171A'],
    '--color-background-surface': ['#FFFFFF', '#1E2126'],
    '--color-background-card': ['#FFFFFF', '#1E2126'],
    '--color-background-popover': ['#FFFFFF', '#1E2126'],
    '--color-border': ['#D9DBDE', '#2A2D31'],
    '--color-border-emphasized': ['#2445B4', '#7AA0FF'],
    '--color-accent': ['#2445B4', '#7AA0FF'],
    // Neutral ink and muted grey, matched to the approved palette study.
    '--color-text-primary': ['#1A1C1F', '#E8EAEC'],
    '--color-text-secondary': ['#6B6E73', '#969A9F'],
  },
})
