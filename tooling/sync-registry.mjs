import assert from 'node:assert/strict'
import {writeFile, rename} from 'node:fs/promises'
import {join} from 'node:path'
import {workspaceRoot} from './build.mjs'
import {readJSON, flattenSitemaps, validateRegistry} from './sites.mjs'
import {catalog} from '../sites/home/src/data/catalog.ts'

const path = join(workspaceRoot, 'registry/sites.json')
const registry = await readJSON(path)
const byID = new Map(registry.sites.map(site => [site.id, site]))
for (const project of catalog.flatMap(group => group.items).filter(project => project.site)) {
  const url = new URL(project.site)
  assert.equal(url.origin, registry.origin, `Project uses a different origin: ${project.repo}`)
  const existing = byID.get(project.repo)
  if (existing) {
    assert.equal(existing.publicPath, url.pathname, `A public mount changed and needs review: ${project.repo}`)
    if (project.sitemap) existing.sitemapSource = project.sitemap
  } else {
    const site = {id: project.repo, publicPath: url.pathname, currentPublisher: `appautomaton/${project.repo}`,
      sitemapSource: project.sitemap || project.site + 'sitemap.xml', sitemaps: []}
    registry.sites.push(site)
    byID.set(site.id, site)
  }
}
const fetchXML = async address => {
  const response = await fetch(address, {redirect: 'error', signal: AbortSignal.timeout(15000)})
  assert(response.ok, `Sitemap returned ${response.status}: ${address}`)
  const body = await response.text()
  assert(body.length < 5_000_000, `Sitemap is unexpectedly large: ${address}`)
  return body
}
for (const site of registry.sites) {
  site.sitemaps = await flattenSitemaps(site.sitemapSource, registry.origin, site.publicPath, fetchXML)
  console.log(`${site.id}: ${site.sitemaps.length} sitemap leaf${site.sitemaps.length === 1 ? '' : ' files'}`)
}
validateRegistry(registry)
await writeFile(path + '.new', JSON.stringify(registry, null, 2) + '\n')
await rename(path + '.new', path)
console.log('Updated the explicit site registry. Website modules and publisher ownership were preserved.')
