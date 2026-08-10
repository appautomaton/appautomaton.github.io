/* Pre-build sync: read what the org actually contains and write it to
   src/data/org.generated.json.

   Everything factual about a project already lives on GitHub or on the wire.
   Whether a repository exists, what it calls itself, whether it publishes a
   page, and when that page was last deployed are all answerable without
   anyone retyping them here, and an answer that is fetched cannot drift from
   the thing it describes. What stays hand-written is the part with taste:
   which shelf a project belongs on, the sentence that introduces it, and how
   wide its case sits on the grid. Those live in src/data/shelves.ts.

   The generated file is committed. It is the audit trail for what the org
   looked like at each build, and it lets the site build with no network. */

import { writeFileSync, existsSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..')
/* A TypeScript module rather than JSON: Vite, tsc, and Node's own loader all
   read it the same way, where a .json import would need an import attribute
   in one of them and not the others. */
const OUT = join(ROOT, 'src', 'data', 'org.generated.ts')

const ORG = 'appautomaton'
const ORIGIN = 'https://appautomaton.renocrypt.com'
/* The org site repo is this site; it is the root, not an exhibit. */
const SITE_REPO = `${ORG}.github.io`

const token = process.env.GITHUB_TOKEN ?? process.env.GH_TOKEN

async function fetchRepos() {
  const res = await fetch(
    `https://api.github.com/orgs/${ORG}/repos?per_page=100&type=public&sort=full_name`,
    {
      headers: {
        accept: 'application/vnd.github+json',
        'user-agent': `${ORG}-landing-build`,
        ...(token ? { authorization: `Bearer ${token}` } : {}),
      },
      signal: AbortSignal.timeout(20000),
    },
  )
  if (!res.ok) throw new Error(`GitHub API returned ${res.status} ${res.statusText}`)
  const all = await res.json()
  if (all.length === 100) console.warn('warn: hit the first page limit, add pagination')
  /* Templates stay: latex-arxiv-SKILL is marked one because it is meant to be
     cloned, which makes it more of a project here rather than less. Only
     archived work, forks of other people's code, and this site drop out. */
  return all
    .filter((r) => !r.archived && !r.fork && r.name !== SITE_REPO)
    .map((r) => ({
      name: r.name,
      description: (r.description ?? '').trim(),
      topics: r.topics ?? [],
      homepage: (r.homepage ?? '').trim(),
    }))
}

/* A project has a page when its address answers 200 here. Asking the wire
   rather than the repo's homepage field means the flag cannot claim a site
   that stopped being served, and a redirect is not a site: the address that
   belongs in a link is the one that answered. */
async function serves(url) {
  const res = await fetch(url, {
    method: 'HEAD',
    redirect: 'manual',
    signal: AbortSignal.timeout(15000),
  })
  return res.status === 200 ? res : null
}

async function probe(name) {
  try {
    const page = await serves(`${ORIGIN}/${name}/`)
    if (!page) return { hasSite: false }

    /* GitHub Pages reports when it last wrote the document, which is the only
       honest lastmod available for a page built in another repository. */
    const header = page.headers.get('last-modified')
    const stamp = header ? new Date(header) : null

    /* A project that grows past one page keeps its own sitemap, and the host's
       robots.txt is where a crawler is told those exist. Asking which of the
       two conventional names answers is how that list stops being a thing
       somebody has to remember to update. */
    let sitemap = null
    for (const name_ of ['sitemap-index.xml', 'sitemap.xml']) {
      const url = `${ORIGIN}/${name}/${name_}`
      if (await serves(url)) {
        sitemap = url
        break
      }
    }

    return {
      hasSite: true,
      lastmod: stamp && !Number.isNaN(stamp.valueOf()) ? stamp.toISOString().slice(0, 10) : null,
      sitemap,
    }
  } catch (e) {
    return { hasSite: null, error: String(e) }
  }
}

async function loadPrevious() {
  if (!existsSync(OUT)) return null
  try {
    return await import(pathToFileURL(OUT).href)
  } catch {
    return null
  }
}

const previous = await loadPrevious()

let repos
try {
  repos = await fetchRepos()
} catch (e) {
  if (!previous) throw new Error(`cannot reach the GitHub API and no committed copy exists: ${e}`)
  console.warn(`warn: keeping the committed org snapshot, the API was unreachable (${e})`)
  process.exit(0)
}

const probes = await Promise.all(repos.map((r) => probe(r.name)))

/* A probe that could not complete says nothing about the project, so the
   last known answer stands rather than a repo silently losing its page. */
const previousByName = new Map((previous?.repos ?? []).map((r) => [r.name, r]))
const unreachable = []

const merged = repos.map((r, i) => {
  const p = probes[i]
  if (p.hasSite === null) {
    unreachable.push(r.name)
    const before = previousByName.get(r.name)
    return {
      ...r,
      hasSite: before?.hasSite ?? false,
      lastmod: before?.lastmod ?? null,
      sitemap: before?.sitemap ?? null,
    }
  }
  return {
    ...r,
    hasSite: p.hasSite,
    lastmod: p.hasSite ? p.lastmod : null,
    sitemap: p.hasSite ? p.sitemap : null,
  }
})

for (const name of unreachable) console.warn(`warn: could not probe ${name}, kept the last answer`)

/* The homepage field is what GitHub shows beside the repo and what a reader
   follows from the org page, so it should name the address that serves the
   project rather than one that redirects to it. */
for (const r of merged) {
  const want = r.hasSite ? `${ORIGIN}/${r.name}/` : ''
  if (want && r.homepage !== want)
    console.warn(`warn: ${r.name} homepage is "${r.homepage || 'unset'}", expected ${want}`)
}

/* --- The gate ----------------------------------------------------------
   Automation finds the repositories; a person decides what to do with each
   one. What must never happen is the third thing: a project quietly absent
   from the catalog because nobody noticed it shipped. Every repo is either
   placed on a shelf or listed as deliberately unlisted, and anything in
   neither stops the build here, before a page is rendered around it. */

const { shelves, notShown } = await import('../src/data/shelves.ts')
const placed = new Set(shelves.flatMap((s) => s.items.map((p) => p.repo)))
const known = new Set([...placed, ...Object.keys(notShown)])

const strays = merged.filter((r) => !known.has(r.name))
if (strays.length) {
  const lines = strays.map(
    (r) =>
      `  ${r.name}${r.hasSite ? `  (publishes ${ORIGIN}/${r.name}/)` : '  (no page)'}\n` +
      `    ${r.description || 'no description'}`,
  )
  throw new Error(
    `${strays.length} repository/repositories are in neither a shelf nor notShown:\n` +
      `${lines.join('\n')}\n\n` +
      `Add each to src/data/shelves.ts: to a shelf's items to exhibit it, or to\n` +
      `notShown with a reason to leave it out on purpose.`,
  )
}

const missing = [...placed].filter((name) => !merged.some((r) => r.name === name))
if (missing.length)
  throw new Error(
    `src/data/shelves.ts places repositories the org no longer returns: ${missing.join(', ')}`,
  )

const exhibits = merged
  .filter((r) => placed.has(r.name))
  .map(({ name, description, topics, hasSite, lastmod, sitemap }) => ({
    name,
    description,
    topics,
    hasSite,
    lastmod,
    sitemap,
  }))
  .sort((a, b) => a.name.localeCompare(b.name))

const module = `/* Generated by scripts/sync-catalog.mjs. Do not edit.

   What the ${ORG} org contained at the last build, and what each project's
   address answered when it was asked. Committed so the diff shows when a
   project's description changed or a page went live, and so the site still
   builds with no network. Run \`npm run sync\` to refresh. */

export type OrgRepo = {
  name: string
  /** The repository's own one-liner, as GitHub reports it. */
  description: string
  topics: string[]
  /** True when ${ORIGIN}/<name>/ answered 200. */
  hasSite: boolean
  /** The date that page was last built, from its Last-Modified header. */
  lastmod: string | null
  /** The project's own sitemap, when it serves one. */
  sitemap: string | null
}

export const org = ${JSON.stringify(ORG)}
export const origin = ${JSON.stringify(ORIGIN)}

export const repos: OrgRepo[] = ${JSON.stringify(exhibits, null, 2)}
`

writeFileSync(OUT, module)

const live = exhibits.filter((r) => r.hasSite).length
const dated = exhibits.filter((r) => r.lastmod).length
const mapped = exhibits.filter((r) => r.sitemap).length
console.log(
  `synced ${exhibits.length} exhibits from the ${ORG} org, ${live} publishing a page ` +
    `(${dated} dated, ${mapped} with their own sitemap), ` +
    `${Object.keys(notShown).length} deliberately unlisted`,
)
