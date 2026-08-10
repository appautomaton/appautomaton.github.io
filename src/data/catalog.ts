/* The catalog the page renders: the org's own account of itself, joined to
   the placements in shelves.ts.

   Nothing here is typed by hand. Addresses are derived from the repository
   name, whether a project has a page comes from a probe of that address, and
   the date a page was last built comes from the server that serves it. The
   join happens once, so the rendered cards, the structured data, and the
   sitemap are three views of one list rather than three lists to keep level.

   Run `npm run sync` to refresh the generated half. */

/* Extensions are explicit here because the prerender step imports this module
   through Node's own loader, which resolves nothing implicitly. */
import { org, origin, repos } from './org.generated.ts'
import { shelves } from './shelves.ts'
import type { Placement } from './shelves.ts'

export const ORIGIN = origin
const GITHUB_ORG = `https://github.com/${org}`

export type Project = {
  repo: string
  description: string
  /** The project's own page on this domain. Absent when it publishes none. */
  site?: string
  /** The GitHub repository. Every project has one. */
  source: string
  /** Two short, factual chips. */
  chips: string[]
  /** When the page was last built, from the serving host. Null without a page. */
  lastmod: string | null
  /** Stable catalog plate, stamped from shelf letter + position: "A-01". */
  tag: string
  /** Bento width on the 12-column desktop grid. */
  span: number
}

export type ShelfData = {
  key: string
  letter: string
  label: string
  blurb: string
  items: Project[]
}

const byName = new Map(repos.map((r) => [r.name, r]))

function join(placement: Placement, letter: string, index: number): Project {
  const facts = byName.get(placement.repo)
  if (!facts) throw new Error(`${placement.repo} is on a shelf but absent from org.generated.ts`)
  return {
    repo: placement.repo,
    /* The repository's own one-liner is the default. A placement overrides it
       where the catalog wants a sentence written for this page rather than
       for a search box. */
    description: placement.description ?? facts.description,
    site: facts.hasSite ? `${ORIGIN}/${placement.repo}/` : undefined,
    source: `${GITHUB_ORG}/${placement.repo}`,
    chips: placement.chips ?? facts.topics.slice(0, 2),
    lastmod: facts.lastmod,
    tag: `${letter}-${String(index + 1).padStart(2, '0')}`,
    span: placement.span,
  }
}

export const catalog: ShelfData[] = shelves.map((s) => ({
  key: s.key,
  letter: s.letter,
  label: s.label,
  blurb: s.blurb,
  items: s.items.map((p, i) => join(p, s.letter, i)),
}))

export const unitCount = catalog.reduce((n, s) => n + s.items.length, 0)
export const shelfCount = catalog.length
