import {readdir} from 'node:fs/promises'
import {spawnSync} from 'node:child_process'
for(const file of [...(await readdir('scripts')).filter(f=>f.endsWith('.mjs')).map(f=>'scripts/'+f),'site/assets/app.js']){
 const result=spawnSync(process.execPath,['--check',file],{stdio:'inherit'})
 if(result.status!==0)process.exit(result.status||1)
}
console.log('Source syntax verified')
