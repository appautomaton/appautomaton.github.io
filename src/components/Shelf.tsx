import { Card, Stack, HStack, Text, Link } from '@astryxdesign/core'
import type { ShelfData } from '../data/catalog'

export function Shelf({ shelf }: { shelf: ShelfData }) {
  return (
    <section
      id={`shelf-${shelf.key}`}
      className="aa-shelf"
      style={{ margin: '0 0 3.5rem' }}
    >
      {/* Shelf plate: index letter, label, rail, unit count */}
      <HStack align="center" gap={4}>
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
      </HStack>

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
              className={featured ? 'aa-cell aa-cell-wide' : 'aa-cell'}
              style={{ ['--aa-span' as string]: p.span }}
            >
              <Card
                className="aa-card"
                style={{
                  height: '100%',
                  padding: featured
                    ? '1.4rem 1.4rem 1.5rem 0'
                    : '1.15rem 1.15rem 1.35rem 0',
                  background: 'transparent',
                  border: 'none',
                  borderTop: '1px solid var(--color-border)',
                  borderRadius: 0,
                  boxShadow: 'none',
                }}
              >
                <Stack gap={2} style={{ height: '100%' }}>
                  <HStack
                    justify="between"
                    gap={2}
                    style={{ alignItems: 'baseline' }}
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
                  </HStack>

                  {/* spec line: plain stamped type, no chrome */}
                  <Text
                    as="div"
                    type="label"
                    style={{
                      fontFamily: 'var(--aa-font-mono)',
                      fontSize: '0.64rem',
                      letterSpacing: '0.14em',
                      textTransform: 'uppercase',
                      color: 'var(--color-text-secondary)',
                    }}
                  >
                    {p.chips.join(' · ')}
                  </Text>

                  <Text
                    as="p"
                    type="body"
                    style={{ flex: 1, marginTop: '0.35rem' }}
                  >
                    {p.description}
                  </Text>

                  <Link
                    href={p.href}
                    target="_blank"
                    rel="noopener"
                    hasUnderline={false}
                    className="aa-view"
                    style={{
                      alignSelf: 'flex-start',
                      marginTop: '0.55rem',
                      fontFamily: 'var(--aa-font-mono)',
                      fontSize: '0.74rem',
                      letterSpacing: '0.12em',
                      textTransform: 'uppercase',
                      color: 'var(--aa-brass)',
                      textDecoration: 'none',
                    }}
                  >
                    View →
                  </Link>
                </Stack>
              </Card>
            </div>
          )
        })}
      </div>
    </section>
  )
}
