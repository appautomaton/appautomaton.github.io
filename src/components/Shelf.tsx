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

/* Boustrophedon: as the ox plows. One act runs right, the next turns and runs
   left. The direction comes from the shelf's own position in the catalog, not
   from its position after filtering, so a filtered view does not resequence
   the furrows under the reader.

   Only the presentation turns. In the document the heading is still followed
   by its units in one straight line, which is what a crawler and a screen
   reader both read. The band is moved with a transform; nothing leaves flow. */
export function Shelf({ shelf, index }: { shelf: ShelfData; index: number }) {
  const dir = index % 2 === 0 ? 'ltr' : 'rtl'
  return (
    <section id={`shelf-${shelf.key}`} className="aa-shelf aa-act" data-dir={dir}>
      <div
        className="aa-act-rail"
        style={{ ['--aa-units' as string]: shelf.items.length }}
      >
        <div className="aa-act-stage">
          <div className="aa-act-no" aria-hidden="true">
            {ROMANS[index]}
          </div>

          <div className="aa-bento">
            <header className="aa-act-head">
              <div className="aa-act-meta">
                Act {ROMANS[index]} · {String(shelf.items.length).padStart(2, '0')} units
              </div>
              <Text as="h2" type="label" className="aa-act-label">
                {shelf.label}
              </Text>
              <Text as="p" type="supporting" className="aa-act-blurb">
                {shelf.blurb}
              </Text>
              <div className="aa-act-dir" aria-hidden="true">
                {dir === 'ltr' ? 'reading ————→ right' : 'left ←———— reading'}
              </div>
            </header>

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
                      bare "view". Styled to inherit, so nothing shifts.

                      It is a heading, not a div. The outline is how a crawler
                      and a language model both reconstruct what this page
                      contains, and a catalog whose entries are divs reads as
                      four shelf names with nothing on them. */}
                  <Text
                    as="h3"
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
        </div>
      </div>
    </section>
  )
}

/* The turn. An ox reaching the headland does not jump to the next furrow, it
   swings around, and the reader should see the same thing rather than a cut.
   Decoration only: aria-hidden, and it sits between acts, so it never lands
   between a heading and the units that belong to it. */
export function Turn({ to, numeral }: { to: 'ltr' | 'rtl'; numeral: string }) {
  return (
    <div className="aa-turn" data-to={to} aria-hidden="true">
      <span className="aa-turn-no">{numeral}</span>
      <svg viewBox="0 0 1060 220" role="presentation">
        <path
          pathLength={100}
          d="M 12 34 H 936 A 74 74 0 0 1 936 182 H 12 M 12 182 l 26 -12 M 12 182 l 26 12"
        />
      </svg>
      <span className="aa-turn-cap">
        {to === 'rtl' ? 'the turn · now reading left' : 'the turn · now reading right'}
      </span>
    </div>
  )
}
