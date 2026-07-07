import { useState } from 'react'
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

function App() {
  const [mode, setMode] = useState<'light' | 'dark'>('light')
  const vibe = mode === 'light' ? WORKSHOP_VIBE_DAY : WORKSHOP_VIBE_NIGHT

  return (
    <div
      style={{
        display: 'contents',
        // @ts-expect-error -- custom properties aren't in CSSProperties
        '--aa-brass': vibe.brass,
        '--aa-font-mono': vibe.fontMono,
        '--aa-grid-line': vibe.gridLine,
        '--aa-lamp': vibe.lamp,
      }}
    >
      <Theme theme={workshopTheme} mode={mode}>
        <div
          className="aa-paper"
          style={{ backgroundColor: 'var(--color-background-body)', minHeight: '100vh' }}
        >
          <Nav mode={mode} onModeChange={setMode} />
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
