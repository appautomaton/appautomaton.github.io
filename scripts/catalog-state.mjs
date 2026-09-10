import {automaticGroup} from './catalog-policy.mjs';
import {assignArtwork} from './artwork.mjs';

const organization='appautomaton';
const groupKeys=new Set(['skills','harnesses','mlx','creative']);
export const emptyState=()=>({version:1,organization,entries:[]});
export function validateState(state){
 if(state?.version!==1||state.organization!==organization||!Array.isArray(state.entries))throw new Error('Invalid catalog state envelope');
 const ids=new Set(),orders=new Set();
 for(const row of state.entries){
  if(!Number.isSafeInteger(row.repoId)||row.repoId<=0||ids.has(row.repoId))throw new Error('Invalid or duplicate repository ID in catalog state');
  if(!Number.isSafeInteger(row.order)||row.order<0||orders.has(row.order))throw new Error('Invalid or duplicate catalog order');
  if(!/^[A-Za-z0-9_.-]+$/.test(row.repo)||!groupKeys.has(row.group)||!/^[a-z0-9-]+$/.test(row.artwork))throw new Error('Invalid catalog state entry');
  ids.add(row.repoId);orders.add(row.order);
 }
 return state;
}

// Published state is authoritative for automatic assignments. The checked-in
// checkpoint supports offline work and the first rollout, not silent resets.
export async function loadPublishedState(origin,checkpoint,request=fetch){
 validateState(checkpoint);
 const options={headers:{accept:'application/json','cache-control':'no-cache','user-agent':'appautomaton-catalog-state'},redirect:'error',signal:AbortSignal.timeout(20000)};
 const stamp=Date.now();
 const response=await request(`${origin}/catalog-state.json?build=${stamp}`,options);
 if(response.ok)return {state:validateState(await response.json()),legacyOrder:[]};
 if(response.status!==404)throw new Error(`Published catalog state returned ${response.status}; refusing to reset assignments`);
 const legacy=await request(`${origin}/catalog.json?build=${stamp}`,{...options,signal:AbortSignal.timeout(20000)});
 if(!legacy.ok)throw new Error('Cannot establish the previous publication state');
 const catalog=await legacy.json();
 if(catalog.organization!==organization||!Array.isArray(catalog.projects))throw new Error('Invalid previous catalog');
 if(catalog.catalogStateVersion)throw new Error('Published registry is missing from a state-aware deployment');
 return {state:checkpoint,legacyOrder:catalog.projects.map(p=>p.repo)};
}

export function reconcileState(repos,selected,shelves,notShown,previous,legacyOrder=[]){
 validateState(previous);
 const byId=new Map(repos.map(r=>[r.repoId,r]));
 if(byId.size!==repos.length||repos.some(r=>!Number.isSafeInteger(r.repoId)||r.repoId<=0))throw new Error('GitHub repository IDs must be complete and unique');
 const currentIds=new Set(selected.map(r=>r.repoId));
 for(const row of previous.entries){
  if(Object.hasOwn(notShown,row.repo))continue;
  const current=byId.get(row.repoId);
  if(!current)throw new Error(`Previously published repository ${row.repo} (${row.repoId}) is missing; review an explicit exclusion instead of silently removing it`);
  if(!currentIds.has(row.repoId))throw new Error(`Previously published repository ${row.repo} is no longer eligible; keeping the previous deployment`);
 }
 const placements=new Map(shelves.flatMap(s=>s.items.map(p=>[p.repo,s.key])));
 const entries=new Map(previous.entries.map(row=>[row.repoId,{...row}]));
 let nextOrder=Math.max(-1,...previous.entries.map(row=>row.order))+1;
 const legacyRank=new Map(legacyOrder.map((name,i)=>[name,i]));
 const ordered=[...selected].sort((a,b)=>
  (legacyRank.get(a.name)??Infinity)-(legacyRank.get(b.name)??Infinity)||
  (a.createdAt||'').localeCompare(b.createdAt||'')||a.repoId-b.repoId);
 for(const repo of ordered){
  const prior=entries.get(repo.repoId);
  const group=placements.get(repo.name)||prior?.group||repo.automaticGroup||automaticGroup(repo);
  entries.set(repo.repoId,{...prior,repoId:repo.repoId,repo:repo.name,group,order:prior?.order??nextOrder++,lastKnown:{homepage:repo.homepage,hasSite:repo.hasSite,lastmod:repo.lastmod??null,sitemap:repo.sitemap??null}});
 }
 const projects=selected.map(repo=>({repo:repo.name,repoId:repo.repoId,group:entries.get(repo.repoId).group,catalogOrder:entries.get(repo.repoId).order}));
 const assignments=assignArtwork(projects,previous);
 for(const project of projects)entries.get(project.repoId).artwork=assignments.get(project.repo).key;
 const state=validateState({version:1,organization,entries:[...entries.values()].sort((a,b)=>a.order-b.order)});
 const facts=selected.map(repo=>{
  const row=entries.get(repo.repoId);
  return {...repo,catalogOrder:row.order,...(!placements.has(repo.name)?{automaticGroup:row.group}:{})};
 });
 return {state,repos:facts};
}
