import { useEffect, useRef } from 'react'

/** Night mode only: a warm pool of lamplight follows the pointer.
    Coordinates are written straight to CSS custom properties from a
    rAF-throttled listener, so pointer movement never re-renders React. */
export function Spotlight() {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    let raf = 0
    const onMove = (e: PointerEvent) => {
      if (raf) return
      const x = e.clientX
      const y = e.clientY
      raf = requestAnimationFrame(() => {
        raf = 0
        ref.current?.style.setProperty('--aa-lx', `${x}px`)
        ref.current?.style.setProperty('--aa-ly', `${y}px`)
      })
    }
    window.addEventListener('pointermove', onMove, { passive: true })
    return () => {
      window.removeEventListener('pointermove', onMove)
      if (raf) cancelAnimationFrame(raf)
    }
  }, [])

  return <div ref={ref} className="aa-lamp" aria-hidden="true" />
}
