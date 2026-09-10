import manifest from '../site/artwork.json' with {type:'json'};
import {createHash} from 'node:crypto';

const originals=[
 ['aperture','Rounded-square aperture','A layered rounded frame surrounding a blue core.'],
 ['folio','Porcelain folio','A fan of curved porcelain leaves.'],
 ['wave','Woven waveform','A folded wave made from metal ribbons.'],
 ['lens','Optical rings','Concentric optical rings around a central sphere.'],
 ['knot','Linked knot','Two interwoven sculptural loops.'],
 ['orbit','Orbital instrument','A sculptural arrangement of orbital rings.'],
].map(([key,title,alt])=>({key,title,alt,file:key,groups:[],original:true}));
export const artworkManifest=manifest;
export const artworks=[...manifest.models.map(model=>({...model,file:'model-'+model.key})),...originals];
const byKey=new Map(artworks.map(asset=>[asset.key,asset]));
const score=(repo,key)=>createHash('sha256').update(repo+'\0'+key).digest().readUInt32BE(0);

export function assignArtwork(projects,registry={entries:[]}){
 const prior=new Map(registry.entries.map(row=>[row.repoId,row]));
 const assigned=new Map(),usage=new Map(artworks.map(a=>[a.key,0]));
 for(const project of projects){
  const key=manifest.assignments[project.repo]||prior.get(project.repoId)?.artwork;
  if(!key)continue;
  if(!byKey.has(key))throw new Error('Unknown artwork assignment: '+key);
  assigned.set(project.repo,byKey.get(key));usage.set(key,usage.get(key)+1);
 }
 for(const project of [...projects].sort((a,b)=>(a.catalogOrder??Infinity)-(b.catalogOrder??Infinity)||a.repo.localeCompare(b.repo))){
  if(assigned.has(project.repo))continue;
  const least=Math.min(...usage.values());
  const available=artworks.filter(asset=>usage.get(asset.key)===least);
  const matching=available.filter(asset=>asset.groups.includes(project.group));
  const pool=matching.length?matching:available;
  const asset=pool.toSorted((a,b)=>score(project.repo,b.key)-score(project.repo,a.key)||a.key.localeCompare(b.key))[0];
  assigned.set(project.repo,asset);usage.set(asset.key,usage.get(asset.key)+1);
 }
 return assigned;
}
