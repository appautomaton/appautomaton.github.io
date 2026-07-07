import { Card, Button, Stack, Text, Badge } from '@astryxdesign/core'
import type { ShelfData } from '../data/catalog'

export function Shelf({ shelf }: { shelf: ShelfData }) {
  return (
    <section
      id={`shelf-${shelf.key}`}
      className="aa-shelf"
      style={{ margin: '0 0 3.5rem' }}
    >
      <div className="aa-ghost" aria-hidden="true">
        {shelf.letter}
      </div>

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
          className="aa-plate-rail"
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

      <div className="aa-bento">
        {shelf.items.map((p) => {
          const featured = p.span >= 7
          return (
            <div
              key={p.repo}
              className={p.span >= 7 ? 'aa-cell aa-cell-wide' : 'aa-cell'}
              style={{ ['--aa-span' as string]: p.span }}
            >
              <Card
                className="aa-card"
                style={{
                  height: '100%',
                  padding: featured
                    ? '1.5rem 1.5rem 1.5rem'
                    : '1.2rem 1.25rem 1.35rem',
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
                        fontSize: featured ? '1.3rem' : '1.08rem',
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
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      gap: '0.6rem',
                      flexWrap: 'wrap',
                    }}
                  >
                    <Button
                      label="View"
                      onClick={() => window.open(p.href, '_blank', 'noopener')}
                      size="sm"
                      style={{ borderRadius: 0 }}
                    />
                    <div style={{ display: 'flex', gap: '0.35rem', flexWrap: 'wrap' }}>
                      {p.chips.map((c) => (
                        <Badge
                          key={c}
                          label={c}
                          variant="neutral"
                          style={{
                            borderRadius: 0,
                            fontFamily: 'var(--aa-font-mono)',
                            letterSpacing: '0.05em',
                          }}
                        />
                      ))}
                    </div>
                  </div>
                </Stack>
              </Card>
            </div>
          )
        })}
      </div>
    </section>
  )
}
