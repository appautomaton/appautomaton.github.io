import assert from 'node:assert/strict'
import {createHash} from 'node:crypto'
import {readFile, readdir, lstat, realpath, mkdir, copyFile, writeFile} from 'node:fs/promises'
import {resolve, relative, sep, join} from 'node:path'

export const readJSON = async path => JSON.parse(await readFile(path, 'utf8'))
export const xmlEscape = text => text.replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;')
export const xmlDecode = text => text.replace(/&#(x[\da-f]+|\d+);/gi, (_, n) => String.fromCodePoint(n[0].toLowerCase() === 'x' ? parseInt(n.slice(1), 16) : Number(n))).replaceAll('&amp;', '&').replaceAll('&lt;', '<').replaceAll('&gt;', '>').replaceAll('&quot;', '"').replaceAll('&apos;', "'")

export function inside(root, path) {
  const target = resolve(root, path)
  assert(target === resolve(root) || target.startsWith(resolve(root) + sep), `Path escapes its source: ${path}`)
  return target
}

export function ownerFor(registry, pathname) {
  return registry.sites.filter(site => pathname.startsWith(site.publicPath))
    .sort((a, b) => b.publicPath.length - a.publicPath.length)[0]
}

export const inProduction = site => site.publicPath === '/' || ['staged', 'central'].includes(site.publication)

export function validateRegistry(registry) {
  assert.equal(registry.version, 1, 'Unsupported site registry version')
  assert(['preview-pilot', 'publisher-handoff', 'modular-production'].includes(registry.phase), 'Unknown publication phase')
  const origin = new URL(registry.origin)
  assert.equal(origin.origin, registry.origin, 'Origin must not contain a path')
  assert.equal(origin.protocol, 'https:', 'Production requires HTTPS')
  const ids = new Set(), mounts = new Set()
  for (const site of registry.sites) {
    assert(/^[a-z\d][a-z\d._-]*$/i.test(site.id), `Invalid site ID: ${site.id}`)
    assert(!ids.has(site.id), `Duplicate site ID: ${site.id}`)
    ids.add(site.id)
    assert(/^\/(?:[a-z\d][a-z\d._-]*\/)*$/i.test(site.publicPath), `Invalid public mount: ${site.publicPath}`)
    assert(!mounts.has(site.publicPath.toLowerCase()), `Duplicate public mount: ${site.publicPath}`)
    mounts.add(site.publicPath.toLowerCase())
    assert(/^appautomaton\/[a-z\d._-]+$/i.test(site.currentPublisher), `Missing current publisher: ${site.id}`)
    assert(['external', 'staged', 'central'].includes(site.publication || 'external'), `Unknown publication state: ${site.id}`)
    if (inProduction(site)) assert(site.sourceDir, `Production requires a local module: ${site.id}`)
    if (site.publication === 'central') assert.equal(site.currentPublisher, 'appautomaton/appautomaton.github.io', `Central publisher mismatch: ${site.id}`)
    if (site.publication === 'staged') assert.equal(registry.phase, 'publisher-handoff', `Staging requires the handoff phase: ${site.id}`)
    if (registry.phase === 'preview-pilot') assert(site.publicPath === '/' || !inProduction(site), `Pilot cannot publish project modules: ${site.id}`)
    if (site.sourceDir) {
      assert(site.sourceDir.startsWith('sites/'), `Sources must be site modules: ${site.id}`)
      assert(site.sourceDir.split('/').every(part => part && part !== '.' && part !== '..') && !site.sourceDir.includes('\\'), `Source path must be normalized: ${site.id}`)
      inside('/workspace', site.sourceDir)
      assert(['node', 'static'].includes(site.build?.kind), `Unknown build adapter: ${site.id}`)
      assert(site.outputDir, `Missing output directory: ${site.id}`)
      inside('/module', site.outputDir)
      if (site.build.kind === 'node') {
        for (const key of ['script', 'check']) {
          assert(site.build[key]?.endsWith('.mjs'), `Missing Node ${key}: ${site.id}`)
          inside('/module', site.build[key])
        }
      }
      assert(site.pages?.length, `Missing content routes: ${site.id}`)
      for (const page of site.pages) assert(page.startsWith(site.publicPath), `Content route leaves its mount: ${page}`)
    }
    assert(site.sitemaps?.length, `Missing sitemap leaves: ${site.id}`)
    for (const address of site.sitemaps) {
      const url = new URL(address)
      assert.equal(url.origin, registry.origin, `Sitemap leaves the production origin: ${address}`)
      assert(url.pathname.startsWith(site.publicPath), `Sitemap leaves its mount: ${address}`)
      assert(!url.hash && !url.search && url.pathname.endsWith('.xml'), `Invalid sitemap leaf: ${address}`)
    }
  }
  const home = registry.sites.filter(site => site.publicPath === '/')
  assert.equal(home.length, 1, 'Exactly one root module is required')
  assert(home[0].sourceDir, 'The root site must have a local module')
  return registry
}

export async function walkFiles(root) {
  const files = []
  async function visit(directory) {
    for (const item of (await readdir(directory, {withFileTypes: true})).sort((a, b) => a.name.localeCompare(b.name))) {
      const path = join(directory, item.name)
      assert(!item.isSymbolicLink(), `Publication contains a symbolic link: ${path}`)
      if (item.isDirectory()) await visit(path)
      else {
        assert(item.isFile(), `Unsupported publication entry: ${path}`)
        files.push(relative(root, path).split(sep).join('/'))
      }
    }
  }
  await visit(root)
  return files
}

export async function fileHashes(root) {
  const entries = []
  for (const path of await walkFiles(root)) {
    entries.push([path, createHash('sha256').update(await readFile(join(root, path))).digest('hex')])
  }
  return Object.fromEntries(entries)
}

export function parseSitemap(xml) {
  xml = xml.replace(/<!--[\s\S]*?-->/g, '')
  assert(!/<!DOCTYPE|<!ENTITY/i.test(xml), 'Sitemap declarations are not supported')
  const type = xml.match(/^\s*(?:<\?xml[^>]*>\s*)?<(urlset|sitemapindex)\b/i)?.[1].toLowerCase()
  assert(type, 'Expected a sitemap XML document')
  assert(new RegExp(`</${type}>\\s*$`, 'i').test(xml), 'Sitemap is not a complete document')
  const locations = [...xml.matchAll(/<loc(?:\s[^>]*)?>([^<]+)<\/loc>/gi)].map(match => xmlDecode(match[1].trim()))
  assert(locations.length, 'Sitemap has no locations')
  return {type, locations}
}

export async function flattenSitemaps(address, origin, publicPath, fetchXML, seen = new Set()) {
  const url = new URL(address)
  assert.equal(url.origin, origin, `Sitemap redirects outside the origin: ${address}`)
  assert(url.pathname.startsWith(publicPath), `Sitemap leaves its site: ${address}`)
  assert(!seen.has(address), `Sitemap index cycle: ${address}`)
  assert(seen.size < 50, 'Sitemap expansion exceeded its limit')
  seen.add(address)
  const sitemap = parseSitemap(await fetchXML(address))
  if (sitemap.type === 'urlset') {
    for (const location of sitemap.locations) {
      const page = new URL(location)
      assert.equal(page.origin, origin, `Page leaves the origin: ${location}`)
      assert(page.pathname.startsWith(publicPath), `Page leaves its site: ${location}`)
    }
    return [address]
  }
  const leaves = []
  for (const child of sitemap.locations) leaves.push(...await flattenSitemaps(child, origin, publicPath, fetchXML, seen))
  return [...new Set(leaves)]
}

export async function copyModule(source, target, site, registry, claimed) {
  const excluded = new Set(site.build.exclude || [])
  for (const file of await walkFiles(source)) {
    if (excluded.has(file)) continue
    const destination = site.publicPath.slice(1) + file
    assert(!registry.sites.some(other => other.id !== site.id && other.publicPath.slice(1, -1).toLowerCase() === destination.toLowerCase()), `Output shadows another site's entry: ${destination}`)
    assert.equal(ownerFor(registry, '/' + destination)?.id, site.id, `Output claims another site's mount: ${destination}`)
    const key = destination.toLowerCase()
    assert(!claimed.has(key), `Publication path collision: ${destination}`)
    claimed.add(key)
    const output = inside(target, destination)
    await mkdir(resolve(output, '..'), {recursive: true})
    await copyFile(join(source, file), output)
  }
}

export async function writeDiscovery(root, registry) {
  const maps = [...new Set(registry.sites.flatMap(site => site.sitemaps))].sort()
  const indexURL = registry.origin + '/sitemap-index.xml'
  assert(!maps.includes(indexURL), 'The central sitemap index cannot reference itself')
  const index = '<?xml version="1.0" encoding="UTF-8"?>\n' +
    '<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n' +
    maps.map(url => `  <sitemap><loc>${xmlEscape(url)}</loc></sitemap>`).join('\n') + '\n</sitemapindex>\n'
  await writeFile(join(root, 'sitemap-index.xml'), index)
  const robots = await readFile(join(root, 'robots.txt'), 'utf8')
  const policy = robots.split(/\r?\n/).filter(line => !/^\s*Sitemap\s*:/i.test(line)).join('\n').trimEnd()
  await writeFile(join(root, 'robots.txt'), policy + '\n\nSitemap: ' + indexURL + '\n')
}

const attributes = tag => Object.fromEntries([...tag.matchAll(/\b([\w:-]+)\s*=\s*(["'])([\s\S]*?)\2/g)].map(match => [match[1].toLowerCase(), xmlDecode(match[3])]))
export const routeFile = pathname => pathname.endsWith('/') ? pathname + 'index.html' : pathname

export async function validatePublication(root, registry, {production = false} = {}) {
  const files = new Set(await walkFiles(root))
  const html = new Map()
  const ids = new Map()
  for (const file of files) {
    if (!file.endsWith('.html')) continue
    const source = await readFile(join(root, file), 'utf8')
    html.set(file, source)
    const values = [...source.matchAll(/\bid\s*=\s*(["'])([^"']+)\1/g)].map(match => match[2])
    assert.equal(values.length, new Set(values).size, `Duplicate page IDs: ${file}`)
    ids.set(file, new Set(values))
  }
  function reference(address, from, {anchor = false} = {}) {
    if (!address || /^(?:data|mailto|tel|javascript):/i.test(address)) return
    const url = new URL(address, registry.origin + '/' + from)
    if (url.origin !== registry.origin) return
    const pathname = decodeURIComponent(url.pathname)
    const owner = ownerFor(registry, pathname)
    if (!owner?.sourceDir || (production && !inProduction(owner))) return
    const target = routeFile(pathname).slice(1)
    assert(files.has(target), `Missing local destination: ${from} -> ${address}`)
    if (anchor && url.hash && ids.has(target)) {
      assert(ids.get(target).has(decodeURIComponent(url.hash.slice(1))), `Missing anchor: ${from} -> ${address}`)
    }
  }
  for (const [file, source] of html) {
    for (const match of source.matchAll(/<(?:a|link|script|img|source|audio|video|use)\b[^>]*>/gi)) {
      const attrs = attributes(match[0])
      for (const key of ['href', 'src', 'poster', 'xlink:href']) if (attrs[key]) reference(attrs[key], file, {anchor: /^<a\b/i.test(match[0])})
      if (attrs.srcset) for (const value of attrs.srcset.split(',')) reference(value.trim().split(/\s+/)[0], file)
    }
    for (const match of source.matchAll(/<meta\b[^>]*>/gi)) {
      const attrs = attributes(match[0])
      if (['og:image', 'twitter:image'].includes(attrs.property || attrs.name)) reference(attrs.content, file)
    }
  }
  for (const file of files) {
    if (!file.endsWith('.css')) continue
    const source = await readFile(join(root, file), 'utf8')
    for (const match of source.matchAll(/url\(\s*(["']?)(.*?)\1\s*\)/g)) {
      if (!match[2].startsWith('#')) reference(match[2], file)
    }
  }
  const rootMap = parseSitemap(await readFile(join(root, 'sitemap.xml'), 'utf8'))
  assert.equal(rootMap.type, 'urlset', 'The root content sitemap must remain a URL set')
  for (const site of registry.sites) {
    assert(rootMap.locations.includes(registry.origin + site.publicPath), `Root sitemap omits ${site.id}`)
    if (!site.sourceDir || (production && !inProduction(site))) continue
    for (const route of site.pages) {
      const file = routeFile(route).slice(1)
      const source = html.get(file)
      assert(source, `Missing content page: ${route}`)
      const canonicalTag = [...source.matchAll(/<link\b[^>]*>/gi)].map(match => attributes(match[0])).find(attrs => attrs.rel === 'canonical')
      assert.equal(canonicalTag?.href, registry.origin + route, `Incorrect canonical: ${route}`)
      assert(!/<meta\b[^>]*(?:name|content)=["'][^"']*noindex/i.test(source), `Content page prohibits indexing: ${route}`)
      assert.equal((source.match(/<h1\b/g) || []).length, 1, `Expected one main heading: ${route}`)
    }
    for (const address of site.sitemaps) {
      const path = new URL(address).pathname.slice(1)
      const map = parseSitemap(await readFile(join(root, path), 'utf8'))
      assert.equal(map.type, 'urlset', `The registry must reference sitemap leaves: ${address}`)
      for (const location of map.locations) reference(location, path)
    }
  }
  const index = parseSitemap(await readFile(join(root, 'sitemap-index.xml'), 'utf8'))
  assert.equal(index.type, 'sitemapindex')
  assert.deepEqual(new Set(index.locations), new Set(registry.sites.flatMap(site => site.sitemaps)))
  const robots = await readFile(join(root, 'robots.txt'), 'utf8')
  assert(!/^Disallow:\s*\/$/mi.test(robots), 'The root crawler policy blocks all content')
  assert(robots.includes('Sitemap: ' + registry.origin + '/sitemap-index.xml'), 'Missing central sitemap declaration')
  if (production) for (const file of files) {
    assert(inProduction(ownerFor(registry, '/' + file)), `Production claims an external project route: ${file}`)
  }
  return {files: files.size, contentPages: registry.sites.filter(site => site.sourceDir && (!production || inProduction(site))).reduce((n, site) => n + site.pages.length, 0), sitemaps: index.locations.length}
}

export async function sourceOutput(root, site) {
  const source = inside(root, site.sourceDir)
  const actual = await realpath(source)
  assert.equal(actual, source, `Module source traverses a symbolic link: ${site.id}`)
  const output = inside(source, site.outputDir)
  assert.equal(await realpath(output), output, `Module output traverses a symbolic link: ${site.id}`)
  const stat = await lstat(output)
  assert(stat.isDirectory() && !stat.isSymbolicLink(), `Missing module output: ${site.id}`)
  return output
}
