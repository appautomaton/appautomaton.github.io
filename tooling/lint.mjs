import {spawnSync} from 'node:child_process'
import {join} from 'node:path'
import {workspaceRoot} from './build.mjs'
import {walkFiles} from './sites.mjs'
for (const directory of ['tooling', 'sites/mlx-speech/public', 'sites/pi-arcweld/public']) {
  for (const file of await walkFiles(join(workspaceRoot, directory))) {
    if (!file.endsWith('.mjs') && !file.endsWith('.js')) continue
    const result = spawnSync(process.execPath, ['--check', join(workspaceRoot, directory, file)], {stdio: 'inherit'})
    if (result.status !== 0) process.exit(result.status || 1)
  }
}
console.log('Shared tooling and imported site scripts parsed successfully.')
