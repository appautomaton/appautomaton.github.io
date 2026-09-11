import assert from 'node:assert/strict'
import {join} from 'node:path'
import {workspaceRoot} from './build.mjs'
import {readJSON, fileHashes, sourceOutput} from './sites.mjs'
const registry = await readJSON(join(workspaceRoot, 'registry/sites.json'))
const baseline = await readJSON(join(workspaceRoot, 'registry/baselines.json'))
for (const site of registry.sites.filter(site => site.sourceDir)) {
  const files = await fileHashes(await sourceOutput(workspaceRoot, site))
  for (const name of site.build.exclude || []) delete files[name]
  assert.deepEqual(files, baseline.sites[site.id].files, `${site.id} differs from the recorded deployment artifact`)
  console.log(`${site.id}: all ${Object.keys(files).length} published files match the baseline.`)
}
