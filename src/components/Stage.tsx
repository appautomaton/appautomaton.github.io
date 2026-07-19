import { useEffect, useRef } from 'react'
import { Text, Link } from '@astryxdesign/core'
import { unitCount, shelfCount } from '../data/catalog'
import stageTrio from '../plates/stage-trio.webp'
import cartouche from '../plates/cartouche.webp'

/** The 1738 presentation of Vaucanson's automata, full bleed, with the
    title mounted over a Rijksmuseum rocaille cartouche. The plaque sits at
    the left third so the duck can walk out from behind it; on phones the
    stage re-composes with the plaque at the bottom. */
export function Stage() {
  const bgRef = useRef<HTMLDivElement>(null)

  // The stage leans gently away from the cursor, like a set piece on rails.
  useEffect(() => {
    const stage = bgRef.current?.parentElement
    if (!stage) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const onMove = (e: PointerEvent) => {
      const b = stage.getBoundingClientRect()
      const x = (e.clientX - b.left) / b.width - 0.5
      const y = (e.clientY - b.top) / b.height - 0.5
      if (bgRef.current) {
        bgRef.current.style.translate = `${x * -16}px ${y * -9}px`
      }
    }
    stage.addEventListener('pointermove', onMove)
    return () => stage.removeEventListener('pointermove', onMove)
  }, [])

  return (
    <header className="aa-stage">
      <div
        ref={bgRef}
        className="aa-stage-bg"
        style={{ backgroundImage: `url(${stageTrio})` }}
        role="img"
        aria-label="Engraving of Vaucanson's three automata presented on a curtained stage, 1738"
      />
      <div className="aa-stage-vig" aria-hidden="true" />

      <div className="aa-plaque aa-bloom">
        <img className="aa-plaque-frame aa-plate-img" src={cartouche} alt="" />
        <div className="aa-plaque-panel">
          <Text
            as="p"
            type="body"
            style={{ fontStyle: 'italic', fontSize: '1rem', color: 'var(--color-text-secondary)' }}
          >
            The open workshop of AppCubic
          </Text>
          <Text
            as="h1"
            type="display-1"
            style={{
              fontFamily: "'League Gothic', 'Arial Narrow', sans-serif",
              fontSize: 'clamp(2.5rem, 6.5vw, 4.4rem)',
              textTransform: 'uppercase',
              letterSpacing: '0.02em',
              lineHeight: 0.9,
              margin: '0.45rem 0 0.6rem',
            }}
          >
            App Automaton
          </Text>
          <Text
            as="p"
            type="body"
            style={{
              fontSize: 'clamp(0.85rem, 1.3vw, 0.98rem)',
              lineHeight: 1.5,
              maxWidth: '30ch',
              margin: '0 auto 0.75rem',
            }}
          >
            An open-source workshop for engineering with coding agents.
          </Text>
          <Link
            href="#catalog"
            hasUnderline={false}
            style={{
              fontFamily: 'var(--aa-font-mono)',
              fontSize: '0.6rem',
              letterSpacing: '0.2em',
              textTransform: 'uppercase',
              color: 'var(--aa-patina)',
              textDecoration: 'none',
            }}
          >
            {unitCount} units · {shelfCount} shelves ↓
          </Link>
        </div>
      </div>
    </header>
  )
}
