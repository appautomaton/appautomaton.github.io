import { useState } from 'react'
import { flushSync } from 'react-dom'
import { Theme } from '@astryxdesign/core'
import { workshopTheme, WORKSHOP_VIBE_DAY, WORKSHOP_VIBE_NIGHT } from './theme'
import { Nav } from './components/Nav'
import { Hero } from './components/Hero'
import { Workbench } from './components/Workbench'
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
  const vibe = mode === 'light' ? WORKSHOP_VIBE_DAY : WORKSHOP_VIBE_NIGHT

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
        '--aa-brass': vibe.brass,
        '--aa-font-mono': vibe.fontMono,
        '--aa-grid-line': vibe.gridLine,
        '--aa-lamp': vibe.lamp,
        '--aa-card-hover': vibe.cardHover,
      }}
    >
      <Theme theme={workshopTheme} mode={mode}>
        <div
          className="aa-paper"
          style={{ backgroundColor: 'var(--color-background-body)', minHeight: '100vh' }}
        >
          <Nav mode={mode} onModeChange={changeMode} />
          <Hero />
          <Workbench />
          <Footer />
        </div>
        {mode === 'dark' && <Spotlight />}
        <StructuredData />
      </Theme>
    </div>
  )
}

export default App
