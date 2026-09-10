/* Pre-build sync: read what the org actually contains and write it to
   src/data/org.generated.ts.

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
import { serves } from './probe-response.mjs'
import { readRepositories } from './github-repositories.mjs'
import { homepageProblem, projectAddress, selectExhibits } from './catalog-policy.mjs'
import { auditProjectPage } from './page-audit.mjs'
const { shelves, notShown } = await import('../src/data/shelves.ts')
const placed = new Set(shelves.flatMap(s => s.items.map(p => p.repo)))

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..')
/* Node 24 reads the typed catalog directly at build time. */
const OUT = join(ROOT, 'src', 'data', 'org.generated.ts')

const ORG = 'appautomaton'
const ORIGIN = 'https://appautomaton.com'

const token = process.env.GITHUB_TOKEN ?? process.env.GH_TOKEN

const fetchRepos = () => readRepositories(ORG, token)

/* A configured About URL must answer successfully without a redirect.
   GET also audits canonical and robot metadata. The expected Pages address
   is probed for existing source-only exhibits to notice a newly published
   site whose About field still needs configuration. */

async function probe(repo) {
  const name=repo.name
  try {
    const url = repo.homepage || projectAddress(ORIGIN,name)
    const page = await serves(url, 'GET')
    if (!page) return { hasSite: false }

    const {problems,warnings} = auditProjectPage(url, await page.text(), page.headers)
    for(const warning of warnings)console.warn(`warn: ${name} ${warning}`)

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
      try {
        const response=await serves(url,'GET')
        if(response) {
          const xml=await response.text()
          if(!/^\s*(?:<\?xml[\s\S]*?\?>\s*)?(?:<!--[\s\S]*?-->\s*)*<(?:\w+:)?(?:urlset|sitemapindex)(?:\s|>)/.test(xml))problems.push(`${url} is not a sitemap XML document`)
          sitemap=url
          break
        }
      } catch(error) {
        // A sitemap outage must not discard a page's already-detected errors.
        sitemap=previous?.repos.find(repo=>repo.name===name)?.sitemap??null
        console.warn(`warn: ${name} sitemap check unavailable, retained the previous map (${error})`)
        break
      }
    }

    return {
      hasSite: true,
      lastmod: stamp && !Number.isNaN(stamp.valueOf()) ? stamp.toISOString().slice(0, 10) : null,
      sitemap,
      problems,
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
  if (!previous || process.env.GITHUB_ACTIONS === 'true') throw new Error(`cannot refresh GitHub metadata; keeping the previous deployment: ${e}`)
  console.warn(`warn: keeping the committed org snapshot, the API was unreachable (${e})`)
  process.exit(0)
}

const invalidHomepages=repos.filter(r=>!Object.hasOwn(notShown,r.name)).map(r=>homepageProblem(r,ORIGIN)).filter(Boolean)
if(invalidHomepages.length)throw new Error(invalidHomepages.join('\n'))
const probes = await Promise.all(repos.map(r => Object.hasOwn(notShown,r.name)||(!r.homepage&&!placed.has(r.name))?{hasSite:false}:probe(r)))

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

for (const name of unreachable) {
  const index = repos.findIndex((repo) => repo.name === name)
  console.warn(`warn: could not probe ${name}, kept the last answer (${probes[index].error})`)
}

const invalidPages = repos.flatMap((r, i) => (probes[i].problems ?? []).map((p) => `  ${r.name}: ${p}`))
if (invalidPages.length)
  throw new Error(`project page discovery checks failed:\n${invalidPages.join('\n')}`)

// A serving page must be advertised at its canonical address in GitHub About.
const missingHomepages=merged.filter(r=>r.hasSite&&!Object.hasOwn(notShown,r.name)&&!r.homepage)
if(missingHomepages.length)throw new Error(`Published projects need their About URL configured: ${missingHomepages.map(r=>r.name).join(', ')}`)
const selected=selectExhibits(merged,shelves,notShown)
for(const repo of selected.filter(r=>r.automaticGroup))console.log(`auto: ${repo.name} placed in ${repo.automaticGroup}`)

/* Existing editorial entries may intentionally point only to source code.
   Keep an unfinished website visible as a warning without inventing a reason. */
const placementByRepo = new Map(shelves.flatMap((s) => s.items.map((p) => [p.repo, p])))

for (const r of merged) {
  const placement = placementByRepo.get(r.name)
  if (!placement) continue
  if (!r.hasSite && !placement.noPage)
    console.warn(`warn: ${r.name} is on a shelf, publishes no page, and gives no noPage reason`)
  if (r.hasSite && placement.noPage)
    console.warn(
      `warn: ${r.name} publishes a page now, but shelves.ts still says noPage: ${placement.noPage}`,
    )
}

const exhibits = selected
  .map(({ name, description, topics, homepage, automaticGroup, hasSite, lastmod, sitemap }) => ({
    name,
    description,
    topics,
    homepage,
    ...(automaticGroup?{automaticGroup}:{}),
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
  /** Canonical website from the repository About field. */
  homepage: string
  /** Fallback category for newly published sites without editorial placement. */
  automaticGroup?: string
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
const byChoice = exhibits.filter((r) => !r.hasSite && placementByRepo.get(r.name)?.noPage).length
console.log(
  `synced ${exhibits.length} exhibits from the ${ORG} org, ${live} publishing a page ` +
    `(${dated} dated, ${mapped} with their own sitemap), ` +
    `${byChoice} shelved without one on purpose, ` +
    `${Object.keys(notShown).length} deliberately unlisted`,
)
