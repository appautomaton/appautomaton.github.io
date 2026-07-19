import { HStack, Stack, Link, Text } from '@astryxdesign/core'
import schouwburg from '../plates/schouwburg.webp'

const linkStyle = {
  fontFamily: 'var(--aa-font-mono)',
  fontSize: '0.68rem',
  textTransform: 'uppercase',
  letterSpacing: '0.15em',
  color: 'var(--color-accent)',
} as const

export function Footer() {
  return (
    <footer style={{ borderTop: '1px solid var(--color-border)' }}>
      <HStack
        align="start"
        justify="between"
        gap={8}
        wrap="wrap"
        style={{ maxWidth: 1120, margin: '0 auto', padding: '3rem 1.5rem 3.4rem' }}
      >
        <Stack gap={4} style={{ flex: '1 1 22rem', maxWidth: '36rem' }}>
          <Text as="p" type="body" style={{ fontSize: '1.05rem', lineHeight: 1.6 }}>
            The open workshop of AppCubic. Everything here is MIT licensed and
            built in public.
          </Text>
          <HStack gap={6}>
            <Link href="https://github.com/appautomaton" style={linkStyle}>
              GitHub org
            </Link>
            <Link href="https://appcubic.com" style={linkStyle}>
              AppCubic
            </Link>
          </HStack>
          <Text
            as="p"
            type="label"
            style={{
              marginTop: '0.8rem',
              fontFamily: 'var(--aa-font-mono)',
              fontSize: '0.58rem',
              letterSpacing: '0.08em',
              lineHeight: 1.9,
              textTransform: 'uppercase',
              color: 'var(--color-text-secondary)',
            }}
          >
            Engravings, public domain &amp; CC0 — Vaucanson's automata, 1738 ·
            the Encyclopédie, 1765–72 · Rijksmuseum prints, 1712–60 ·
            Kircher, 1646 · Dürer, 1525 · Cars after Chardin. Full sources in
            the repo.
          </Text>
        </Stack>

        {/* The house itself signs the page off. */}
        <figure
          className="aa-colophon-frame aa-bloom"
          style={{ flex: '0 1 20rem', minWidth: '14rem', margin: 0 }}
        >
          <img
            className="aa-plate-img"
            src={schouwburg}
            alt="Engraving of a performance in the Amsterdam Schouwburg seen through the proscenium, 1738"
            loading="lazy"
            width={1200}
            height={904}
            style={{ width: '100%', height: 'auto', display: 'block' }}
          />
          <figcaption>
            <span>
              <b>The house</b> — Amsterdam Schouwburg
            </span>
            <span>1738</span>
          </figcaption>
        </figure>
      </HStack>
    </footer>
  )
}
