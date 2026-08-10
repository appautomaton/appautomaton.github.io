import { Card, Stack, HStack, Text, Link } from '@astryxdesign/core'
import type { Project, ShelfData } from '../data/catalog'
import { cardArt, layoutSpans } from '../plates/thumbs'

const ROMANS = ['I', 'II', 'III', 'IV', 'V', 'VI']

/** Two destinations per exhibit: the project's own page on this domain, and
    the repository it is cut from. The page link is the primary one and stays
    in the tab, which also keeps the catalog a connected site rather than a
    list of departures. Projects without a page show the source alone. */
function CardLinks({ project }: { project: Project }) {
  return (
    <HStack gap={3} align="center">
      {project.site && (
        <Link href={project.site} hasUnderline={false} className="aa-view">
          View →
        </Link>
      )}
      <Link
        href={project.source}
        target="_blank"
        rel="noopener"
        hasUnderline={false}
        className="aa-view aa-view-quiet"
      >
        Source ↗
      </Link>
    </HStack>
  )
}

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

                  {/* The name carries the link when the project has a page,
                      so the anchor text is the project's name rather than a
                      bare "view". Styled to inherit, so nothing shifts. */}
                  <Text
                    as="div"
                    type="body"
                    className="aa-card-name"
                    style={{ fontSize: featured ? '1.9rem' : '1.6rem' }}
                  >
                    {p.site ? (
                      <a href={p.site} className="aa-card-namelink">
                        {p.repo}
                      </a>
                    ) : (
                      p.repo
                    )}
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
                    <div style={{ alignSelf: 'flex-start', marginTop: '0.5rem' }}>
                      <CardLinks project={p} />
                    </div>
                  )}
                </Stack>
                {layout === 'bottom' && plate}
                {layout === 'bottom' && (
                  /* the links stay on the card's bottom line, under the plate,
                     so every row's links sit on one rule */
                  <div className="aa-card-viewbar">
                    <CardLinks project={p} />
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
