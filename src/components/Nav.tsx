import { HStack, Text } from '@astryxdesign/core'
import { AdaptiveMark } from './Logo'

export function Nav({
  mode,
  onModeChange,
}: {
  mode: 'light' | 'dark'
  onModeChange: (mode: 'light' | 'dark') => void
}) {
  const night = mode === 'dark'
  return (
    <nav
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 10,
        background: 'var(--color-background-body)',
        borderBottom: '1px solid var(--color-border)',
      }}
    >
      <HStack
        align="center"
        justify="between"
        gap={4}
        style={{
          maxWidth: 1120,
          margin: '0 auto',
          padding: '0.65rem 1.5rem',
        }}
      >
        <HStack align="center" gap={2}>
          <AdaptiveMark size={22} />
          <Text
            as="div"
            type="body"
            style={{
              fontFamily: "'League Gothic', 'Arial Narrow', sans-serif",
              fontSize: '1.3rem',
              textTransform: 'uppercase',
              color: 'var(--color-text-primary)',
              letterSpacing: '0.05em',
              lineHeight: 1,
            }}
          >
            App Automaton
          </Text>
        </HStack>
        <HStack align="center" gap={3}>
          <a className="aa-ticket" href="https://github.com/appautomaton">
            GitHub
          </a>
          {/* The house lights: one control, two states, styled like a
              ticket stub — the active side is printed. */}
          <button
            className="aa-mode-toggle"
            role="switch"
            aria-checked={night}
            aria-label="Night mode"
            onClick={() => onModeChange(night ? 'light' : 'dark')}
          >
            <span className={night ? '' : 'aa-on'}>Day</span>
            <span className={night ? 'aa-on' : ''}>Night</span>
          </button>
        </HStack>
      </HStack>
    </nav>
  )
}
