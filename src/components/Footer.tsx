import { Link, Text, Divider } from '@astryxdesign/core'

export function Footer() {
  return (
    <footer style={{ maxWidth: 1040, margin: '0 auto', padding: '0 1.5rem 2.5rem' }}>
      <Divider />
      <div
        style={{
          display: 'flex',
          alignItems: 'baseline',
          justifyContent: 'space-between',
          gap: '1rem',
          flexWrap: 'wrap',
          paddingTop: '1.4rem',
        }}
      >
        <Text as="p" type="supporting" style={{ fontSize: '0.85rem' }}>
          The open workshop of AppCubic. Everything here is MIT licensed and
          built in public.
        </Text>
        <div style={{ display: 'flex', gap: '1.4rem' }}>
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
            GitHub org
          </Link>
          <Link
            href="https://appcubic.com"
            style={{
              fontFamily: 'var(--aa-font-mono)',
              fontSize: '0.78rem',
              textTransform: 'uppercase',
              letterSpacing: '0.1em',
              color: 'var(--aa-brass)',
            }}
          >
            AppCubic
          </Link>
        </div>
      </div>
    </footer>
  )
}
