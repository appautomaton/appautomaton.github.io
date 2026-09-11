import {mkdir, rm, rename, writeFile} from 'node:fs/promises'
import {spawnSync} from 'node:child_process'
import {randomUUID} from 'node:crypto'
import {resolve, join} from 'node:path'
import {fileURLToPath, pathToFileURL} from 'node:url'
import {readJSON, validateRegistry, sourceOutput, copyModule, writeDiscovery, validatePublication, fileHashes, inside} from './sites.mjs'

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

export async function buildWorkspace(root = workspaceRoot, registry) {
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
      if (site.publicPath === '/') await copyModule(source, production, site, registry, productionClaims)
      outputs.push({id: site.id, publicPath: site.publicPath, sourceDir: site.sourceDir})
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
    for (const [directory, scope, modules, checks] of [[preview, 'aggregate-preview', outputs, previewCheck], [production, 'homepage-and-discovery', outputs.filter(site => site.publicPath === '/'), productionCheck]]) {
      await writeFile(join(directory, 'release-manifest.json'), JSON.stringify({...provenance, scope, modules, checks, files: await fileHashes(directory)}, null, 2) + '\n')
    }
    await promote([[preview, join(root, 'dist')], [production, join(root, 'dist-production')]], scratch)
    console.log(`Built ${outputs.length} isolated modules; ${previewCheck.contentPages} content pages; ${previewCheck.sitemaps} sitemap leaves.`)
    console.log('dist/: aggregate preview. dist-production/: homepage and discovery only; project publishers remain authoritative.')
    return {preview: previewCheck, production: productionCheck}
  } finally {
    await rm(scratch, {recursive: true, force: true})
  }
}

if (process.argv[1] && pathToFileURL(resolve(process.argv[1])).href === import.meta.url) await buildWorkspace()
