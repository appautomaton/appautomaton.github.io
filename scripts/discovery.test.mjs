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
 const repo=name=>({name,private:false,owner:{login:'studio'},description:'A project.',topics:[],homepage:''})
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
