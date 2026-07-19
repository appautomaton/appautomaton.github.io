import { Card, Stack, HStack, Text, Link } from '@astryxdesign/core'
import type { ShelfData } from '../data/catalog'
import { cardArt, layoutSpans } from '../plates/thumbs'

const ROMANS = ['I', 'II', 'III', 'IV', 'V', 'VI']

export function Shelf({ shelf, index }: { shelf: ShelfData; index: number }) {
  return (
    <section id={`shelf-${shelf.key}`} className="aa-shelf">
      {/* Act heading: numeral, label, rail, unit count */}
      <HStack align="end" gap={4}>
        <div className="aa-act-roman" aria-hidden="true">
          {ROMANS[index]}
        </div>
        <Text as="h2" type="label" className="aa-act-label">
          {shelf.label}
        </Text>
        <div
          aria-hidden="true"
          className="aa-plate-rail"
          style={{
            flex: 1,
            alignSelf: 'center',
            borderTop: '1px solid var(--color-border)',
          }}
        />
        <div className="aa-act-count">
          {String(shelf.items.length).padStart(2, '0')}
        </div>
      </HStack>

      <Text
        as="p"
        type="supporting"
        style={{
          maxWidth: '58ch',
          margin: '0.8rem 0 1.5rem',
          fontStyle: 'italic',
          fontSize: '0.98rem',
          lineHeight: 1.55,
        }}
      >
        {shelf.blurb}
      </Text>

      <div className="aa-bento">
        {shelf.items.map((p) => {
          const span = layoutSpans[p.repo] ?? p.span
          const featured = span >= 7
          const size = featured ? 'aa-cell-l' : span >= 5 ? 'aa-cell-m' : 'aa-cell-s'
          const art = cardArt[p.repo]
          const layout = art?.layout ?? 'text'
          const plate = art && (
            <div className="aa-thumb" aria-hidden="true">
              <img
                className="aa-plate-img"
                src={art.src}
                alt=""
                loading="lazy"
                style={{
                  objectPosition: art.position,
                  transform: art.scale ? `scale(${art.scale})` : undefined,
                }}
              />
            </div>
          )
          return (
            <div
              key={p.repo}
              className={`aa-cell ${size}`}
              style={{ ['--aa-span' as string]: span }}
            >
              <Card
                className={`aa-card aa-card-${layout}`}
                style={{
                  height: '100%',
                  padding: 0,
                  border: '1px solid var(--color-text-primary)',
                  outline: '1px solid var(--color-border)',
                  outlineOffset: 3,
                  borderRadius: 0,
                  boxShadow: 'none',
                }}
              >
                {(layout === 'top' || layout === 'side' || layout === 'split') && plate}
                <Stack gap={2} className="aa-card-body">
                  {/* exhibit caption: chips and plate number */}
                  <HStack justify="between" gap={2}>
                    <Text as="div" type="label" className="aa-card-chips">
                      {p.chips.join(' · ')}
                    </Text>
                    <Text
                      as="div"
                      type="label"
                      className="aa-card-tag"
                      style={{ fontSize: '0.6rem' }}
                    >
                      {p.tag}
                    </Text>
                  </HStack>

                  <Text
                    as="div"
                    type="body"
                    className="aa-card-name"
                    style={{ fontSize: featured ? '1.9rem' : '1.6rem' }}
                  >
                    {p.repo}
                  </Text>

                  <Text
                    as="p"
                    type="body"
                    className="aa-card-desc"
                    style={{
                      flex: 1,
                      marginTop: '0.2rem',
                      fontSize: '0.94rem',
                      lineHeight: 1.55,
                    }}
                  >
                    {p.description}
                  </Text>

                  {layout !== 'bottom' && (
                    <Link
                      href={p.href}
                      target="_blank"
                      rel="noopener"
                      hasUnderline={false}
                      className="aa-view"
                      style={{ alignSelf: 'flex-start', marginTop: '0.5rem' }}
                    >
                      View →
                    </Link>
                  )}
                </Stack>
                {layout === 'bottom' && plate}
                {layout === 'bottom' && (
                  /* the view stays on the card's bottom line, under the plate,
                     so every row's links sit on one rule */
                  <div className="aa-card-viewbar">
                    <Link
                      href={p.href}
                      target="_blank"
                      rel="noopener"
                      hasUnderline={false}
                      className="aa-view"
                    >
                      View →
                    </Link>
                  </div>
                )}
              </Card>
            </div>
          )
        })}
      </div>
    </section>
  )
}
