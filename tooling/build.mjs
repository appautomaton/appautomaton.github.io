import {mkdir, rm, rename, writeFile} from 'node:fs/promises'
import {spawnSync} from 'node:child_process'
import {randomUUID} from 'node:crypto'
import {resolve, join} from 'node:path'
import {fileURLToPath, pathToFileURL} from 'node:url'
import {readJSON, validateRegistry, sourceOutput, copyModule, writeDiscovery, validatePublication, fileHashes, inside, inProduction} from './sites.mjs'

export const workspaceRoot = resolve(fileURLToPath(new URL('..', import.meta.url)))

async function promote(pairs, backupRoot) {
  const saved = [], installed = []
  try {
    for (const [candidate, destination] of pairs) {
      const backup = join(backupRoot, String(saved.length))
      try { await rename(destination, backup); saved.push([backup, destination]) }
      catch (error) { if (error.code !== 'ENOENT') throw error }
      await rename(candidate, destination)
      installed.push(destination)
    }
  } catch (error) {
    for (const destination of installed) await rm(destination, {recursive: true, force: true})
    for (const [backup, destination] of saved) await rename(backup, destination)
    throw error
  }
}

export async function buildWorkspace(root = workspaceRoot, registry, {routingProbe = false} = {}) {
  registry = validateRegistry(registry || await readJSON(join(root, 'registry/sites.json')))
  const scratch = join(root, '.build', randomUUID())
  const preview = join(scratch, 'preview'), production = join(scratch, 'production')
  await mkdir(preview, {recursive: true})
  await mkdir(production)
  try {
    const previewClaims = new Set(), productionClaims = new Set(), outputs = []
    for (const site of registry.sites.filter(site => site.sourceDir)) {
      if (site.build.kind === 'node') for (const script of [site.build.script, site.build.check]) {
        const result = spawnSync(process.execPath, [script], {cwd: inside(root, site.sourceDir), stdio: 'inherit'})
        if (result.status !== 0) throw result.error || new Error(`${site.id} failed ${script}`)
      }
      const source = await sourceOutput(root, site)
      await copyModule(source, preview, site, registry, previewClaims)
      if (inProduction(site)) await copyModule(source, production, site, registry, productionClaims)
      outputs.push({id: site.id, publicPath: site.publicPath, sourceDir: site.sourceDir})
    }
    if (routingProbe) for (const directory of [preview, production]) {
      const probe = join(directory, 'web-publisher-probe-20260911')
      await mkdir(join(probe, 'nested'), {recursive: true})
      const page = marker => `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="robots" content="noindex,nofollow"><title>Publication routing check</title></head><body><h1>${marker}</h1></body></html>`
      await writeFile(join(probe, 'index.html'), page('organization-root-marker'))
      await writeFile(join(probe, 'nested/index.html'), page('organization-nested-marker'))
      await writeFile(join(probe, 'root-only.txt'), 'organization-only-marker\n')
    }
    const revision = spawnSync('git', ['rev-parse', 'HEAD'], {cwd: root, encoding: 'utf8'})
    for (const site of registry.sites.filter(site => site.sourceDir && site.publicPath !== '/' && inProduction(site))) {
      for (const directory of [preview, production]) {
        const marker = join(directory, site.publicPath.slice(1), '.well-known')
        await mkdir(marker, {recursive: true})
        await writeFile(join(marker, 'publisher.json'), JSON.stringify({repository: 'appautomaton/appautomaton.github.io', sourceRevision: revision.status === 0 ? revision.stdout.trim() : null, site: site.id, sourceDir: site.sourceDir}) + '\n')
      }
    }
    await writeDiscovery(preview, registry)
    await writeDiscovery(production, registry)
    const previewCheck = await validatePublication(preview, registry)
    const productionCheck = await validatePublication(production, registry, {production: true})
    const git = spawnSync('git', ['rev-parse', 'HEAD'], {cwd: root, encoding: 'utf8'})
    const status = spawnSync('git', ['status', '--porcelain', '--untracked-files=normal'], {cwd: root, encoding: 'utf8'})
    const provenance = {version: 1, phase: registry.phase, origin: registry.origin,
      sourceRevision: git.status === 0 ? git.stdout.trim() : null,
      sourceHasChanges: status.status === 0 ? Boolean(status.stdout.trim()) : null,
      currentPublishers: registry.sites.map(({id, publicPath, currentPublisher}) => ({id, publicPath, repository: currentPublisher}))}
    const productionOutputs = outputs.filter(output => inProduction(registry.sites.find(site => site.id === output.id)))
    for (const [directory, scope, modules, checks] of [[preview, 'aggregate-preview', outputs, previewCheck], [production, productionOutputs.length > 1 ? 'registered-site-modules' : 'homepage-and-discovery', productionOutputs, productionCheck]]) {
      await writeFile(join(directory, 'release-manifest.json'), JSON.stringify({...provenance, scope, modules, checks, files: await fileHashes(directory)}, null, 2) + '\n')
    }
    await promote([[preview, join(root, 'dist')], [production, join(root, 'dist-production')]], scratch)
    console.log(`Built ${outputs.length} isolated modules; ${previewCheck.contentPages} content pages; ${previewCheck.sitemaps} sitemap leaves.`)
    console.log(`dist/: aggregate preview. dist-production/: ${productionOutputs.map(site => site.id).join(', ')} and shared discovery.`)
    return {preview: previewCheck, production: productionCheck}
  } finally {
    await rm(scratch, {recursive: true, force: true})
  }
}

if (process.argv[1] && pathToFileURL(resolve(process.argv[1])).href === import.meta.url) await buildWorkspace(workspaceRoot, undefined, {routingProbe: process.env.PAGES_ROUTING_PROBE === 'true'})
