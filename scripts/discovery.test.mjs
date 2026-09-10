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

import {readRepositories} from './github-repositories.mjs'
import {sculpture,seedFor} from './sculptures.mjs'
test('GitHub discovery paginates and excludes private, foreign, forked, archived, and root repositories',async()=>{
 let nextId=1
 const repo=name=>({id:nextId++,created_at:'2026-09-10T00:00:00Z',name,private:false,owner:{login:'studio'},description:'A project.',topics:[],homepage:''})
 const calls=[]
 const entries=await readRepositories('studio','test-token',async(url,options)=>{
  calls.push({url,options})
  const page=new URL(url).searchParams.get('page')
  const list=page==='1'?Array.from({length:100},(_,i)=>repo('project-'+i)):[repo('last'),{...repo('private'),private:true},{...repo('foreign'),owner:{login:'elsewhere'}},{...repo('fork'),fork:true},{...repo('archive'),archived:true},repo('studio.github.io')]
  return new Response(JSON.stringify(list))
 })
 assert.equal(calls.length,2)
 assert.equal(entries.length,101)
 assert.equal(entries.at(-1).name,'last')
 assert.equal(entries.at(-1).repoId,101)
 assert.equal(entries.at(-1).createdAt,'2026-09-10T00:00:00Z')
 assert(calls.every(c=>new URL(c.url).origin==='https://api.github.com'))
 assert(calls.every(c=>c.options.headers.authorization==='Bearer test-token'))
 await assert.rejects(readRepositories('studio',null,async()=>new Response('',{status:503})),/GitHub API returned 503/)
})

test('every sculpture produces nonempty, deterministic geometry without executing project text',()=>{
 for(const kind of ['stack','portal','wave','lens','knot','field','molecule']){
  const text=sculpture(kind,seedFor('example'))
  assert(text.length>1000,kind+' produced no useful geometry')
  assert.equal(text,sculpture(kind,seedFor('example')))
  assert(!/NaN|Infinity|<script|foreignObject|https?:/.test(text.replace('http://www.w3.org/2000/svg','')))
 }
 assert.equal(seedFor('example'),seedFor('example'))
})

import {homepageProblem,selectExhibits,resolveShelves} from './catalog-policy.mjs'
test('new public project websites enter the catalog automatically while editorial choices remain explicit',()=>{
 const shelves=[{key:'skills',items:[]},{key:'harnesses',items:[{repo:'source-only',span:4}]},{key:'mlx',items:[]},{key:'creative',items:[]}]
 const repo=(name,extra={})=>({name,topics:[],homepage:`https://appautomaton.com/${name}/`,hasSite:true,...extra})
 const entries=[repo('source-only',{homepage:'',hasSite:false}),repo('new-skill'),repo('mlx-new'),repo('studio',{topics:['music-production']}),repo('new-system'),repo('excluded'),repo('not-published',{hasSite:false}),repo('no-homepage',{homepage:''})]
 const selected=selectExhibits(entries,shelves,{excluded:'Deliberately unlisted'})
 assert.equal(selected.length,5)
 const result=resolveShelves(shelves,selected)
 assert.deepEqual(result.map(s=>s.items.map(p=>p.repo)),[['new-skill'],['source-only','new-system'],['mlx-new'],['studio']])
 assert.equal(homepageProblem(repo('mlx-new'),'https://appautomaton.com'),null)
 for(const homepage of ['https://appautomaton.renocrypt.com/mlx-new/','https://appautomaton.com/another/','http://appautomaton.com/mlx-new/','javascript:alert(1)'])assert(homepageProblem(repo('mlx-new',{homepage}),'https://appautomaton.com'))
 assert.throws(()=>selectExhibits([],shelves,{}),/unavailable repositories/)
})

import {auditProjectPage} from './page-audit.mjs'
test('project indexing guards inspect canonical metadata and both HTML and HTTP robot directives',()=>{
 const url='https://appautomaton.com/example/'
 const page=`<title>Example</title><meta name="description" content="An example."><link href="${url}" rel="canonical"><a href="https://appautomaton.com/">Workshop</a>`
 const audit=(html=page,headers=new Headers())=>auditProjectPage(url,html,headers).problems
 assert.deepEqual(audit(),[])
 assert.match(audit(page.replace(url,'https://appautomaton.renocrypt.com/example/')).join(' '),/canonical/)
 assert.match(audit('<title>Missing canonical</title>').join(' '),/missing canonical/)
 for(const meta of ['<meta name="robots" content="noindex,follow">','<meta content="NONE" name="googlebot">','<meta name="bingbot" content="noindex">'])assert.match(audit(page+meta).join(' '),/forbids indexing/)
 assert.match(audit(page,new Headers({'X-Robots-Tag':'googlebot: noindex'})).join(' '),/forbids indexing/)
 assert.deepEqual(audit(page+'<meta name="robots" content="index, follow, max-image-preview:large">'),[])
})


test('an unstable GitHub page boundary cannot duplicate an identity',async()=>{
 const item=id=>({id,created_at:'2026-09-10T00:00:00Z',name:'project-'+id,private:false,owner:{login:'studio'}});
 await assert.rejects(readRepositories('studio',null,async url=>Response.json(new URL(url).searchParams.get('page')==='1'?Array.from({length:100},(_,i)=>item(i+1)):[item(100)])),/repeated a repository ID/);
 await assert.rejects(readRepositories('studio',null,async()=>Response.json([{...item(1),id:null}])),/invalid repository identity/);
});
