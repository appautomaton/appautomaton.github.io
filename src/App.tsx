import { useState } from 'react'
import { flushSync } from 'react-dom'
import { Theme } from '@astryxdesign/core'
import { theaterTheme, THEATER_VIBE_DAY, THEATER_VIBE_NIGHT } from './theme'
import { Nav } from './components/Nav'
import { Stage } from './components/Stage'
import { Playbill } from './components/Playbill'
import { Workbench } from './components/Workbench'
import { ApparatusPlate } from './components/Plates'
import { Footer } from './components/Footer'
import { Spotlight } from './components/Spotlight'
import { StructuredData } from './components/StructuredData'
import './fonts.css'
import './workshop.css'

type Mode = 'light' | 'dark'

function initialMode(): Mode {
  try {
    const saved = localStorage.getItem('aa-mode')
    if (saved === 'light' || saved === 'dark') return saved
  } catch {
    /* storage unavailable */
  }
  return window.matchMedia?.('(prefers-color-scheme: dark)').matches
    ? 'dark'
    : 'light'
}

function App() {
  const [mode, setMode] = useState<Mode>(initialMode)
  const vibe = mode === 'light' ? THEATER_VIBE_DAY : THEATER_VIBE_NIGHT

  const changeMode = (next: Mode) => {
    try {
      localStorage.setItem('aa-mode', next)
    } catch {
      /* storage unavailable */
    }
    const apply = () => setMode(next)
    if (
      document.startViewTransition &&
      !window.matchMedia('(prefers-reduced-motion: reduce)').matches
    ) {
      document.startViewTransition(() => {
        flushSync(apply)
      })
    } else {
      apply()
    }
  }

  return (
    <div
      style={{
        display: 'contents',
        // @ts-expect-error -- custom properties aren't in CSSProperties
        '--aa-font-mono': vibe.fontMono,
        '--aa-patina': vibe.patina,
        '--aa-lamp': vibe.lamp,
        '--aa-plate-filter': vibe.plateFilter,
        '--aa-plate-blend': vibe.plateBlend,
        '--aa-plate-bloom': vibe.plateBloom,
        '--aa-flood-plate-filter': vibe.floodPlateFilter,
        '--aa-flood-plate-blend': vibe.floodPlateBlend,
        '--aa-flood-bg': vibe.floodBg,
        '--aa-flood-text': vibe.floodText,
        '--aa-flood-muted': vibe.floodMuted,
        '--aa-flood-accent': vibe.floodAccent,
        '--aa-flood-patina': vibe.floodPatina,
      }}
    >
      <Theme theme={theaterTheme} mode={mode}>
        <div style={{ backgroundColor: 'var(--color-background-body)', minHeight: '100vh' }}>
          <Nav mode={mode} onModeChange={changeMode} />
          <Stage />
          <Playbill />
          <Workbench />
          <ApparatusPlate />
          <Footer />
        </div>
        {mode === 'dark' && <Spotlight />}
        <StructuredData />
      </Theme>
    </div>
  )
}

export default App
