import test from 'node:test';
import assert from 'node:assert/strict';
import {emptyState,reconcileState,loadPublishedState,validateState} from './catalog-state.mjs';
import {resolveShelves} from './catalog-policy.mjs';
const shelves=['skills','harnesses','mlx','creative'].map(key=>({key,items:[]}));
const repo=(repoId,name,extra={})=>({repoId,name,createdAt:'2026-09-10T00:00:00Z',topics:[],homepage:`https://appautomaton.com/${name}/`,hasSite:true,automaticGroup:'harnesses',...extra});
const reconcile=(repos,state=emptyState(),placements=shelves)=>reconcileState(repos,repos,placements,{},state);

test('API reordering and newly added names cannot move or repaint an automatic project',()=>{
 const original=[repo(101,'zeta'),repo(102,'middle')];
 const first=reconcile(original);
 const next=reconcile([repo(103,'aaa'),...original].reverse(),first.state);
 for(const before of first.state.entries){const after=next.state.entries.find(e=>e.repoId===before.repoId);assert.equal(after.order,before.order);assert.equal(after.artwork,before.artwork)}
 assert.deepEqual(resolveShelves(shelves,next.repos).find(s=>s.key==='harnesses').items.map(p=>p.repo),['zeta','middle','aaa']);
 assert.deepEqual(reconcile([...original].reverse()).state,first.state);
});
test('identity survives an automatic rename and topic change, while editorial order stays explicit',()=>{
 const first=reconcile([repo(101,'before')]);
 const renamed=repo(101,'after',{automaticGroup:'mlx',topics:['mlx']});
 const next=reconcile([renamed],first.state);
 assert.equal(next.state.entries[0].repo,'after');assert.equal(next.state.entries[0].artwork,first.state.entries[0].artwork);assert.equal(next.state.entries[0].group,'harnesses');
 const editorial=shelves.map(s=>({...s,items:s.key==='skills'?[{repo:'after',span:4}]:[]}));
 assert.equal(reconcile([renamed],next.state,editorial).state.entries[0].group,'skills');
});
test('a missing or replaced repository stops publication rather than erasing known entries',()=>{
 const first=reconcile([repo(101,'existing')]);
 assert.throws(()=>reconcile([],first.state),/missing/);
 assert.throws(()=>reconcile([repo(202,'existing')],first.state),/missing/);
 assert.throws(()=>validateState({...first.state,entries:[...first.state.entries,...first.state.entries]}),/duplicate/);
});
test('first rollout can read the legacy order, but a lost published registry cannot reset state',async()=>{
 const responses=[new Response('',{status:404}),Response.json({organization:'appautomaton',projects:[{repo:'older'}]})];
 const initial=await loadPublishedState('https://appautomaton.com',emptyState(),async()=>responses.shift());assert.deepEqual(initial.legacyOrder,['older']);
 const lost=[new Response('',{status:404}),Response.json({organization:'appautomaton',catalogStateVersion:1,projects:[]})];
 await assert.rejects(loadPublishedState('https://appautomaton.com',emptyState(),async()=>lost.shift()),/registry is missing/);
 await assert.rejects(loadPublishedState('https://appautomaton.com',emptyState(),async()=>new Response('',{status:503})),/refusing to reset/);
});
