import test from 'node:test'
import assert from 'node:assert/strict'
import {mkdtemp, mkdir, writeFile, readFile, rm, realpath, symlink} from 'node:fs/promises'
import {tmpdir} from 'node:os'
import {join} from 'node:path'
import {once} from 'node:events'
import {buildWorkspace} from './build.mjs'
import {fileHashes, validateRegistry, flattenSitemaps, parseSitemap} from './sites.mjs'
import {createPreviewServer, localNavigation, byteRange} from './serve.mjs'

const origin = 'https://appautomaton.com'
const mapXML = (...urls) => `<?xml version="1.0"?><urlset>${urls.map(url => `<url><loc>${url}</loc></url>`).join('')}</urlset>`
const page = (path, body) => `<!doctype html><html><head><title>Example</title><link rel="canonical" href="${origin}${path}"></head><body><h1>Example</h1>${body}</body></html>`
const registry = () => ({version: 1, phase: 'preview-pilot', origin, sites: [
  {id: 'home', publicPath: '/', currentPublisher: 'appautomaton/appautomaton.github.io', sourceDir: 'sites/home/public', outputDir: '.', build: {kind: 'static'}, pages: ['/'], sitemaps: [origin + '/sitemap.xml']},
  {id: 'sound', publicPath: '/sound/', currentPublisher: 'appautomaton/sound', sourceDir: 'sites/sound/public', outputDir: '.', build: {kind: 'static'}, pages: ['/sound/'], sitemaps: [origin + '/sound/sitemap.xml']},
  {id: 'external', publicPath: '/external/', currentPublisher: 'appautomaton/external', sitemaps: [origin + '/external/sitemap.xml']}
]})

async function fixture(t) {
  const root = await realpath(await mkdtemp(join(tmpdir(), 'web-modules-')))
  t.after(() => rm(root, {recursive: true, force: true}))
  const write = async (path, text) => { await mkdir(join(root, path, '..'), {recursive: true}); await writeFile(join(root, path), text) }
  await write('sites/home/public/index.html', page('/', `<a href="${origin}/sound/#models">Sound</a><a href="${origin}/external/">External</a>`))
  await write('sites/home/public/sitemap.xml', mapXML(origin + '/', origin + '/sound/', origin + '/external/'))
  await write('sites/home/public/robots.txt', 'User-agent: *\nAllow: /\nSitemap: ' + origin + '/sitemap.xml\n')
  await write('sites/home/public/404.html', '<h1>Missing page</h1>')
  await write('sites/sound/public/index.html', page('/sound/', '<section id="models">Models</section><img src="sample.svg" alt="Example">'))
  await write('sites/sound/public/sample.svg', '<svg xmlns="http://www.w3.org/2000/svg"/>')
  await write('sites/sound/public/data.bin', Buffer.from('0123456789abcdefghijklmnopqrstuv'))
  await write('sites/sound/public/sitemap.xml', mapXML(origin + '/sound/'))
  return {root, write}
}

test('registry rejects ambiguous mounts, escaping sources, and cross-origin sitemap leaves', () => {
  assert.doesNotThrow(() => validateRegistry(registry()))
  const duplicate = registry(); duplicate.sites[2].publicPath = '/sound/'
  assert.throws(() => validateRegistry(duplicate), /Duplicate public mount/)
  const escaped = registry(); escaped.sites[1].sourceDir = 'sites/../../outside'
  assert.throws(() => validateRegistry(escaped), /normalized|escapes/)
  const sibling = registry(); sibling.sites[1].sourceDir = 'sites/../registry'
  assert.throws(() => validateRegistry(sibling), /normalized/)
  const foreign = registry(); foreign.sites[1].sitemaps = ['https://elsewhere.example/sound/sitemap.xml']
  assert.throws(() => validateRegistry(foreign), /origin/)
})

test('sitemap indexes become leaf URLs and cannot form cycles or cross sites', async () => {
  const pages = new Map([
    [origin + '/docs/index.xml', `<sitemapindex><sitemap><loc>${origin}/docs/leaf.xml</loc></sitemap></sitemapindex>`],
    [origin + '/docs/leaf.xml', mapXML(origin + '/docs/guide/')]
  ])
  assert.deepEqual(await flattenSitemaps(origin + '/docs/index.xml', origin, '/docs/', async url => pages.get(url)), [origin + '/docs/leaf.xml'])
  pages.set(origin + '/docs/leaf.xml', `<sitemapindex><sitemap><loc>${origin}/docs/index.xml</loc></sitemap></sitemapindex>`)
  await assert.rejects(flattenSitemaps(origin + '/docs/index.xml', origin, '/docs/', async url => pages.get(url)), /cycle/)
  await assert.rejects(flattenSitemaps('https://other.example/docs/map.xml', origin, '/docs/', async () => ''), /origin/)
  assert.throws(() => parseSitemap('<html><urlset></urlset></html>'), /Expected/)
  assert.throws(() => parseSitemap('<urlset><url><loc>https://example.com</loc></url>'), /complete/)
  assert.deepEqual(parseSitemap('<!-- An existing site note. -->' + mapXML(origin + '/docs/')).locations, [origin + '/docs/'])
})

test('preview navigation changes anchors without changing canonical or social metadata', () => {
  const input = `<link rel="canonical" href="${origin}/sound/"><meta property="og:image" content="${origin}/sound/card.png"><a href="${origin}/sound/?q=a&amp;b=c#models">Local</a><a href="${origin}/external/">Live</a>`
  const output = localNavigation(input, registry())
  assert(output.includes('href="/sound/?q=a&amp;b=c#models"'))
  assert(output.includes(`rel="canonical" href="${origin}/sound/"`))
  assert(output.includes(`content="${origin}/sound/card.png"`))
  assert(output.includes(`href="${origin}/external/"`))
})

test('byte ranges handle seeks, suffixes, bounds, and invalid requests', () => {
  assert.deepEqual(byteRange('bytes=10-15', 32), {start: 10, end: 15})
  assert.deepEqual(byteRange('bytes=-5', 32), {start: 27, end: 31})
  assert.deepEqual(byteRange('bytes=27-', 32), {start: 27, end: 31})
  assert.deepEqual(byteRange('bytes=0-100', 32), {start: 0, end: 31})
  for (const value of ['bytes=33-', 'bytes=15-10', 'bytes=-0', 'bytes=1-2,5-6', 'bytes=-', 'nonsense']) assert.equal(byteRange(value, 32), false)
})

test('a failed module preserves both complete artifacts and root output cannot take a project mount', async t => {
  const {root, write} = await fixture(t)
  await buildWorkspace(root, registry())
  const preview = await fileHashes(join(root, 'dist'))
  const production = await fileHashes(join(root, 'dist-production'))
  assert(preview['sound/index.html'])
  assert(!production['sound/index.html'])
  assert(production['sitemap-index.xml'])
  await rm(join(root, 'sites/sound/public/sample.svg'))
  await assert.rejects(buildWorkspace(root, registry()), /Missing local destination/)
  assert.deepEqual(await fileHashes(join(root, 'dist')), preview)
  assert.deepEqual(await fileHashes(join(root, 'dist-production')), production)
  await write('sites/sound/public/sample.svg', '<svg/>')
  await write('sites/home/public/sound/intruder.html', 'Wrong publisher')
  await assert.rejects(buildWorkspace(root, registry()), /another site's mount/)
  assert.deepEqual(await fileHashes(join(root, 'dist')), preview)
  assert.deepEqual(await fileHashes(join(root, 'dist-production')), production)
})

test('preview serves directory routes, ranges, real 404s, and isolated external sites', async t => {
  const {root, write} = await fixture(t)
  await buildWorkspace(root, registry())
  const server = createPreviewServer(join(root, 'dist'), registry(), {noScripts: true})
  server.listen(0, '127.0.0.1')
  await once(server, 'listening')
  t.after(() => new Promise(resolve => { server.close(resolve); server.closeAllConnections() }))
  const url = 'http://127.0.0.1:' + server.address().port
  const response = await fetch(url)
  assert.equal(response.status, 200)
  assert.equal(response.headers.get('x-robots-tag'), 'noindex, nofollow')
  assert.equal(response.headers.get('content-security-policy'), "script-src 'none'")
  assert((await response.text()).includes('href="/sound/#models"'))
  const slash = await fetch(url + '/sound', {redirect: 'manual'})
  assert.equal(slash.status, 308)
  assert.equal(slash.headers.get('location'), '/sound/')
  const external = await fetch(url + '/external/guide/', {redirect: 'manual'})
  assert.equal(external.status, 302)
  assert.equal(external.headers.get('location'), origin + '/external/guide/')
  const range = await fetch(url + '/sound/data.bin', {headers: {Range: 'bytes=10-15'}})
  assert.equal(range.status, 206)
  assert.equal(range.headers.get('content-range'), 'bytes 10-15/32')
  assert.equal(await range.text(), 'abcdef')
  assert.equal((await fetch(url + '/sound/data.bin', {headers: {Range: 'bytes=100-'}})).status, 416)
  const head = await fetch(url + '/sound/data.bin', {method: 'HEAD'})
  assert.equal(head.headers.get('content-length'), '32')
  assert.equal(await head.text(), '')
  assert.equal((await fetch(url + '/sound/missing.html')).status, 404)
  assert.equal((await fetch(url + '/%ZZ')).status, 400)
  assert.equal((await fetch(url + '/%2e%2e%2fsecret')).status, 403)
  await write('private.txt', 'Outside the preview')
  await symlink(join(root, 'private.txt'), join(root, 'dist/leak.txt'))
  assert.equal((await fetch(url + '/leak.txt')).status, 403)
})

test('staged and central modules publish only through explicit ownership', async t => {
  const {root, write} = await fixture(t)
  const r = registry()
  r.sites[1].publication = 'staged'
  assert.throws(() => validateRegistry(r), /handoff phase/)
  r.phase = 'publisher-handoff'
  await buildWorkspace(root, r)
  let files = await fileHashes(join(root, 'dist-production'))
  assert(files['sound/index.html'])
  assert(files['sound/.well-known/publisher.json'])
  const before = files
  await write('sites/sound/public/index.html', page('/sound/', '<section id="models">Models</section><img src="missing.svg" alt="Missing">'))
  await assert.rejects(buildWorkspace(root, r), /Missing local destination/)
  assert.deepEqual(await fileHashes(join(root, 'dist-production')), before)
  await write('sites/sound/public/index.html', page('/sound/', '<section id="models">Models</section>'))
  r.sites[1].publication = 'central'
  assert.throws(() => validateRegistry(r), /publisher mismatch/)
  r.sites[1].currentPublisher = 'appautomaton/appautomaton.github.io'
  r.phase = 'modular-production'
  await buildWorkspace(root, r)
  const manifest = JSON.parse(await readFile(join(root, 'dist-production/release-manifest.json')))
  assert.equal(manifest.scope, 'registered-site-modules')
  assert.deepEqual(manifest.modules.map(site => site.id), ['home', 'sound'])
  r.sites[2].publication = 'central'
  assert.throws(() => validateRegistry(r), /local module/)
})
