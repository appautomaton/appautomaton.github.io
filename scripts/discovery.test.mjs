import assert from 'node:assert/strict'
import test from 'node:test'
import { renderLlms } from './discovery-files.mjs'
import { serves } from './probe-response.mjs'

test('text catalog follows project additions, copy changes, and page availability', () => {
  const project = { repo: 'forecast', description: 'Forecast locally.', source: 'https://github.com/org/forecast' }
  const catalog = [{ label: 'Models', blurb: 'Local inference.', items: [project] }]
  const before = renderLlms(catalog, 'https://example.com')
  assert.match(before, /\[forecast\]\(https:\/\/github.com\/org\/forecast\)/)
  project.site = 'https://example.com/forecast/'
  project.description = 'Forecast with covariates.'
  catalog[0].items.push({ repo: 'new', description: 'New project.', source: 'https://github.com/org/new' })
  const after = renderLlms(catalog, 'https://example.com')
  assert.match(after, /\[forecast\]\(https:\/\/example.com\/forecast\/\): Forecast with covariates\./)
  assert.match(after, /\[Source\]\(https:\/\/github.com\/org\/forecast\)/)
  assert.match(after, /\[new\]/)
  assert.doesNotMatch(after, /Forecast locally/)
})

test('outages, access blocks, rate limits, and redirects are not missing pages', async () => {
  for (const status of [301, 302, 401, 403, 429, 500, 502, 503]) {
    await assert.rejects(serves('https://example.com/', 'GET', async () => new Response(null, { status })), /HTTP/)
  }
  for (const status of [404, 410]) {
    assert.equal(await serves('https://example.com/', 'GET', async () => new Response(null, { status })), null)
  }
  const page = new Response('content')
  assert.equal(await serves('https://example.com/', 'GET', async () => page), page)
})
