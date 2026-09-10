// Optional artwork authoring. Production builds never download or load 3D models.
import {readFile,writeFile,mkdir,rename} from 'node:fs/promises';
import {resolve,dirname,basename,sep} from 'node:path';
import {createHash} from 'node:crypto';
import {fileURLToPath} from 'node:url';

const root=resolve(dirname(fileURLToPath(import.meta.url)),'..');
const manifest=JSON.parse(await readFile(resolve(root,'site/artwork.json'),'utf8'));
if(!process.argv[2])throw new Error('Pass an artwork cache directory outside the public repository.');
const cache=resolve(process.argv[2]);
if(cache===root||cache.startsWith(root+sep))throw new Error('Keep source models outside the public website repository.');
const selection=process.argv[3]?.split(',');
const locks=JSON.parse(await readFile(resolve(root,'site/artwork-sources.json'),'utf8').catch(()=>'{"models":{}}')).models;
const digest=(bytes,algorithm)=>createHash(algorithm).update(bytes).digest('hex');
async function fetchBytes(url){
 const parsed=new URL(url);
 if(parsed.protocol!=='https:'||!['api.polyhaven.com','dl.polyhaven.org'].includes(parsed.hostname))throw new Error('Unexpected asset host');
 const response=await fetch(url,{headers:{'User-Agent':'AppAutomatonArtwork/1.0'},signal:AbortSignal.timeout(45000)});
 if(!response.ok)throw new Error(`Asset request failed: ${response.status} ${url}`);
 return Buffer.from(await response.arrayBuffer());
}
async function model(asset){
 if(!/^[A-Za-z0-9_-]+$/.test(asset.sourceId))throw new Error('Invalid source model identifier');
 const dir=resolve(cache,asset.sourceId);await mkdir(dir,{recursive:true});
 const locked=locks[asset.sourceId];
 let modelFile,entries;
 if(locked){modelFile=locked.modelFile;entries=locked.files.map(file=>[file.file,{...file,size:file.bytes}])}
 else{
  const files=JSON.parse(await fetchBytes(`https://api.polyhaven.com/files/${encodeURIComponent(asset.sourceId)}`));
  const packageInfo=files.gltf?.['1k']?.gltf;
  if(!packageInfo)throw new Error(`Missing 1K glTF package: ${asset.sourceId}`);
  modelFile=basename(new URL(packageInfo.url).pathname);
  entries=[[modelFile,packageInfo],...Object.entries(packageInfo.include||{})];
 }
 const provenance=[];
 for(const [name,info] of entries){
  const path=resolve(dir,name);
  if(!path.startsWith(dir+sep))throw new Error('Asset path escaped its directory');
  const algorithm=info.sha256?'sha256':'md5',expected=info.sha256||info.md5;
  let bytes=await readFile(path).catch(()=>null);
  if(!bytes||digest(bytes,algorithm)!==expected){
   bytes=await fetchBytes(info.url);
   if(bytes.length!==info.size||digest(bytes,algorithm)!==expected)throw new Error(`Asset checksum mismatch: ${asset.sourceId}/${name}`);
   await mkdir(dirname(path),{recursive:true});await writeFile(path+'.partial',bytes);await rename(path+'.partial',path);
  }
  provenance.push({file:name,url:info.url,bytes:bytes.length,sha256:digest(bytes,'sha256')});
 }
 await writeFile(resolve(dir,'provenance.json'),JSON.stringify({source:asset.url,license:asset.license,modelFile,files:provenance},null,2)+'\n');
 const gltf=JSON.parse(await readFile(resolve(dir,modelFile),'utf8'));
 const listed=new Set(entries.map(([name])=>name));
 for(const resource of [...(gltf.buffers||[]),...(gltf.images||[])]){
  if(!resource.uri||resource.uri.startsWith('data:'))continue;
  const name=decodeURIComponent(resource.uri);
  if(!listed.has(name)||!resolve(dir,name).startsWith(dir+sep))throw new Error('Unlisted glTF resource');
 }
 console.log(JSON.stringify({key:asset.key,files:entries.length,bytes:provenance.reduce((n,f)=>n+f.bytes,0),meshes:gltf.nodes?.filter(n=>n.mesh!==undefined).map(n=>n.name).slice(0,24)}));
}
const pending=manifest.models.filter(a=>!selection||selection.includes(a.key));
let index=0;
await Promise.all(Array.from({length:3},async()=>{while(index<pending.length)await model(pending[index++])}));
