import assert from 'node:assert/strict'
import {readFile,access} from 'node:fs/promises'
import {gzipSync} from 'node:zlib'
import {catalog,ORIGIN,unitCount} from '../src/data/catalog.ts'
import {escapeHTML as e} from './interface.mjs'
const html=await readFile('dist/index.html','utf8')
const projects=catalog.flatMap(g=>g.items)
assert.equal(ORIGIN,'https://appautomaton.com','Unexpected publication origin')
assert.equal((html.match(/<article class="project"/g)||[]).length,unitCount,'The page omitted a catalog project')
assert.equal((html.match(/<h1\b/g)||[]).length,1,'Expected one main heading')
assert(html.includes('<meta name="robots" content="index, follow, max-image-preview:large">'),'Production must permit indexing and following')
assert(html.includes('<link rel="canonical" href="https://appautomaton.com/">'),'Wrong homepage canonical')
assert(!/fonts\.googleapis|fonts\.gstatic/.test(html),'Google Fonts are not allowed')
for(const p of projects){
 assert(html.includes(`href="${e(p.source)}"`),`Missing source link: ${p.repo}`)
 if(p.site)assert(html.includes(`href="${e(p.site)}"`),`Missing project website: ${p.repo}`)
}
const articles=[...html.matchAll(/<article\b[\s\S]*?<\/article>/g)].map(m=>m[0])
for(const article of articles){
 assert(!/^<article[^>]*\bhidden(?:\s|=|>)/.test(article),'Project content must be visible before JavaScript')
 const destinations=[...article.matchAll(/<a\b[^>]*href="([^"]+)"/g)].map(m=>m[1])
 assert.equal(destinations.length,new Set(destinations).size,'A project repeats links to the same destination')
 for(const anchor of article.matchAll(/<a\b([^>]*)>/gi)){
  const rel=anchor[1].match(/\brel\s*=\s*(["'])(.*?)\1/i)?.[2]||''
  assert(!/\b(nofollow|ugc|sponsored)\b/i.test(rel),'Project backlinks must follow normally')
 }
}
const graph=JSON.parse(html.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/)[1])
const list=graph['@graph'].find(n=>n['@type']==='ItemList')
assert.equal(list.numberOfItems,unitCount)
assert.equal(list.itemListElement.length,unitCount)
const ids=[...html.matchAll(/\bid="([^"]+)"/g)].map(m=>m[1])
assert.equal(ids.length,new Set(ids).size,'Duplicate HTML or SVG IDs')
for(const match of html.matchAll(/(?:href|src)="(assets\/[^"#?]+)"/g))await access('dist/'+match[1])
for(const match of html.matchAll(/srcset="([^"]+)"/g))for(const candidate of match[1].split(','))await access('dist/'+candidate.trim().split(/\s+/)[0])
for(const name of ['UncutSans-Regular.woff2','UncutSans-Medium.woff2','UncutSans-LICENSE.txt'])await access('dist/assets/fonts/'+name)
const sitemap=await readFile('dist/sitemap.xml','utf8')
const robots=await readFile('dist/robots.txt','utf8')
for(const url of [ORIGIN+'/',...projects.map(p=>p.site).filter(Boolean),ORIGIN+'/colophon.html'])assert(sitemap.includes(`<loc>${e(url)}</loc>`),`Sitemap omitted ${url}`)
for(const url of [ORIGIN+'/sitemap.xml',...projects.map(p=>p.sitemap).filter(Boolean)])assert(robots.includes(`Sitemap: ${url}`),`robots.txt omitted ${url}`)
assert(!/^Disallow:\s*\/$/m.test(robots),'Production blocks crawling')
assert(html.includes('href="https://appautomaton.renocrypt.com/"'),'Missing the related field guide')
for(const [file,budget] of [['app.js',8*1024],['style.css',10*1024]]){
 const size=gzipSync(await readFile('site/assets/'+file)).length
 assert(size<=budget,`${file} exceeds its compressed delivery budget: ${size}/${budget}`)
 console.log(`${file}: ${size} bytes gzip, budget ${budget}`)
}
console.log(`verified ${unitCount} complete, followable project entries and production discovery files`)

for(const path of ['dist/social-preview.html','dist/icon-preview.html']) {
 const present=await access(path).then(()=>true,()=>false)
 assert(!present,'Local export canvas must not be published: '+path)
}
for(const [path,width,height] of [['dist/og.png',1200,630],['dist/apple-touch-icon.png',180,180]]) {
 const png=await readFile(path)
 assert.equal(png.readUInt32BE(16),width)
 assert.equal(png.readUInt32BE(20),height)
}

for(const anchor of html.matchAll(/<a\b[^>]*>([\s\S]*?)<\/a>/gi)) {
 const text=anchor[1].replace(/<svg\b[\s\S]*?<\/svg>/gi,'').replace(/<[^>]*>/g,'').trim()
 assert(text,'Every link needs descriptive HTML text, including image links')
}
for(const img of html.matchAll(/<img\b[^>]*>/gi))assert(/\balt="[^"]*"/.test(img[0]),'An image is missing its text alternative attribute')
for(const name of ['twitter:title','twitter:description','twitter:image','twitter:image:alt'])assert(html.includes(`name="${name}"`),'Missing social card field: '+name)
