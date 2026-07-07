import { Card, Button, Stack, Grid, Text } from '@astryxdesign/core'
import type { ShelfData } from '../data/catalog'

export function Shelf({ shelf }: { shelf: ShelfData }) {
  return (
    <section id={`shelf-${shelf.key}`} style={{ margin: '0 0 3.5rem' }}>
      {/* Shelf plate: index letter, label, rail, unit count */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.9rem' }}>
        <div
          aria-hidden="true"
          style={{
            width: 34,
            height: 34,
            flexShrink: 0,
            display: 'grid',
            placeItems: 'center',
            border: '1px solid var(--aa-brass)',
            fontFamily: "'Sirin Stencil', sans-serif",
            fontSize: '1.2rem',
            lineHeight: 1,
            color: 'var(--aa-brass)',
          }}
        >
          {shelf.letter}
        </div>
        <Text
          as="h2"
          type="label"
          style={{
            fontFamily: 'var(--aa-font-mono)',
            textTransform: 'uppercase',
            letterSpacing: '0.12em',
            fontSize: '0.82rem',
            color: 'var(--color-accent)',
          }}
        >
          {shelf.label}
        </Text>
        <div
          aria-hidden="true"
          style={{ flex: 1, borderTop: '1px solid var(--color-border)' }}
        />
        <Text
          as="div"
          type="label"
          style={{
            fontFamily: 'var(--aa-font-mono)',
            fontSize: '0.72rem',
            letterSpacing: '0.1em',
            color: 'var(--color-text-secondary)',
          }}
        >
          {String(shelf.items.length).padStart(2, '0')}
        </Text>
      </div>

      <Text
        as="p"
        type="supporting"
        style={{
          maxWidth: '62ch',
          margin: '0.7rem 0 1.4rem',
          fontSize: '0.92rem',
          lineHeight: 1.55,
        }}
      >
        {shelf.blurb}
      </Text>

      <Grid columns={{ minWidth: 260, repeat: 'fit' }} gap={3}>
        {shelf.items.map((p) => (
          <Card
            key={p.repo}
            className="aa-card"
            style={{
              padding: '1.2rem 1.25rem 1.35rem',
              border: '1px solid var(--color-border)',
              borderRadius: 0,
            }}
          >
            <Stack gap={3} style={{ height: '100%' }}>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'baseline',
                  gap: '0.5rem',
                }}
              >
                <Text
                  as="div"
                  type="body"
                  className="aa-card-name"
                  style={{
                    fontFamily: 'var(--aa-font-mono)',
                    color: 'var(--aa-brass)',
                    fontSize: '1.08rem',
                    wordBreak: 'break-word',
                  }}
                >
                  {p.repo}
                </Text>
                <Text
                  as="div"
                  type="label"
                  style={{
                    fontFamily: 'var(--aa-font-mono)',
                    fontSize: '0.68rem',
                    letterSpacing: '0.12em',
                    color: 'var(--color-text-secondary)',
                    flexShrink: 0,
                  }}
                >
                  {p.tag}
                </Text>
              </div>
              <Text as="p" type="body" style={{ flex: 1 }}>
                {p.description}
              </Text>
              <Button
                label="View"
                onClick={() => window.open(p.href, '_blank', 'noopener')}
                size="sm"
                style={{ alignSelf: 'flex-start', borderRadius: 0 }}
              />
            </Stack>
          </Card>
        ))}
      </Grid>
    </section>
  )
}
