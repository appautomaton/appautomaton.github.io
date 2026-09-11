import test from 'node:test';
import assert from 'node:assert/strict';
import {catalog} from '../src/data/catalog.ts';
import {assignArtwork,artworks,artworkManifest} from './artwork.mjs';
const projects=catalog.flatMap(group=>group.items.map(p=>({...p,group:group.key})));

test('every current project receives a distinct, documented visual',()=>{
 const assigned=assignArtwork(projects);
 assert.equal(assigned.size,projects.length);
 assert.equal(new Set([...assigned.values()].map(a=>a.key)).size,Math.min(projects.length,artworks.length));
 for(const model of artworkManifest.models){
  assert.equal(model.license,'CC0-1.0');
  assert(model.url.startsWith('https://polyhaven.com/a/'));
  assert(model.authors.length&&model.alt.length>8);
 }
});
test('new projects use spare artwork without changing curated assignments',()=>{
 const before=assignArtwork(projects);
 const expanded=[...projects,{repo:'new-agent-project',group:'skills'},{repo:'new-local-model',group:'mlx'}];
 const after=assignArtwork(expanded);
 for(const p of projects)assert.equal(after.get(p.repo).key,before.get(p.repo).key);
 assert.equal(new Set([...after.values()].map(a=>a.key)).size,expanded.length);
 assert.deepEqual([...assignArtwork([...expanded].reverse())].sort(),[...after].sort());
});
test('a larger catalog can exhaust the art pool without blocking publication',()=>{
 const expanded=Array.from({length:artworks.length+5},(_,i)=>({repo:'future-project-'+i,group:'mlx'}));
 const result=assignArtwork(expanded);
 assert.equal(result.size,expanded.length);
 assert.equal(new Set([...result.values()].map(a=>a.key)).size,artworks.length);
});
