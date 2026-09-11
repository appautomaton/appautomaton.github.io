import {join} from 'node:path'
import {workspaceRoot} from './build.mjs'
import {readJSON, validateRegistry, validatePublication} from './sites.mjs'
const registry = validateRegistry(await readJSON(join(workspaceRoot, 'registry/sites.json')))
console.log('Aggregate preview:', await validatePublication(join(workspaceRoot, 'dist'), registry))
console.log('Production boundary:', await validatePublication(join(workspaceRoot, 'dist-production'), registry, {production: true}))
