import assert from 'node:assert/strict'
import {readFile} from 'node:fs/promises'
import {join} from 'node:path'
import test from 'node:test'
import {workspaceRoot} from './build.mjs'

test('Docker for Apple Container release stamp stays consistent across the central site', async () => {
  const site = join(workspaceRoot, 'sites/docker-for-apple-container/public')
  const html = await readFile(join(site, 'index.html'), 'utf8')
  const sitemap = await readFile(join(site, 'sitemap.xml'), 'utf8')
  const block = html.match(/<script type="application\/ld\+json">\s*([\s\S]*?)\s*<\/script>/)
  assert.ok(block, 'website JSON-LD exists')
  const schema = JSON.parse(block[1])
  const application = schema['@graph'].find(item => item['@type'] === 'SoftwareApplication')
  assert.ok(application, 'SoftwareApplication metadata exists')
  assert.match(application.softwareVersion, /^\d+\.\d+\.\d+$/)
  assert.match(application.dateModified, /^\d{4}-\d{2}-\d{2}$/)
  assert.ok(html.includes(`<span>v${application.softwareVersion} · updated ${application.dateModified}</span>`))
  const lastmods = [...sitemap.matchAll(/<lastmod>([^<]+)<\/lastmod>/g)].map(match => match[1])
  assert.deepEqual(lastmods, [application.dateModified])
})
