import { Switch, Link, Text } from '@astryxdesign/core'
import { BrandMark } from './Logo'

export function Nav({
  mode,
  onModeChange,
}: {
  mode: 'light' | 'dark'
  onModeChange: (mode: 'light' | 'dark') => void
}) {
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
      <div
        style={{
          maxWidth: 1040,
          margin: '0 auto',
          padding: '0.7rem 1.5rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '1rem',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.55rem' }}>
          <BrandMark size={22} />
          <Text
            as="div"
            type="body"
            style={{
              fontFamily: "'Sirin Stencil', sans-serif",
              fontSize: '1.15rem',
              color: 'var(--color-accent)',
              letterSpacing: '0.02em',
            }}
          >
            App Automaton
          </Text>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.4rem' }}>
          <Link
            href="https://github.com/appautomaton"
            style={{
              fontFamily: 'var(--aa-font-mono)',
              fontSize: '0.78rem',
              textTransform: 'uppercase',
              letterSpacing: '0.1em',
              color: 'var(--aa-brass)',
            }}
          >
            GitHub
          </Link>
          <Switch
            label="Night"
            value={mode === 'dark'}
            onChange={(checked) => onModeChange(checked ? 'dark' : 'light')}
          />
        </div>
      </div>
    </nav>
  )
}
