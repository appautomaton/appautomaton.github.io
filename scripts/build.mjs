import {createHash} from 'node:crypto'
import {mkdir,writeFile,readFile,cp,rm} from 'node:fs/promises'
import {dirname,join} from 'node:path'
import {fileURLToPath} from 'node:url'
import {catalog,ORIGIN,unitCount} from '../src/data/catalog.ts'
import {renderLlms} from './discovery-files.mjs'
import {objectKind} from './sculptures.mjs'
import {escapeHTML as e,editorial,icon,logo} from './interface.mjs'

const ROOT=join(dirname(fileURLToPath(import.meta.url)),'..')
const OUT=join(ROOT,'dist')
// dist is generated output only. It never contains repository-owned project sites.
await rm(OUT,{recursive:true,force:true})
await mkdir(join(OUT,'assets/objects'),{recursive:true})
await cp(join(ROOT,'site/assets'),join(OUT,'assets'),{recursive:true})
const fingerprint=bytes=>createHash('sha256').update(bytes).digest('hex').slice(0,12)
const css=await readFile(join(ROOT,'site/assets/style.css'))
const js=await readFile(join(ROOT,'site/assets/app.js'))
const style=`style.${fingerprint(css)}.css`,script=`app.${fingerprint(js)}.js`
await writeFile(join(OUT,'assets',style),css)
await writeFile(join(OUT,'assets',script),js)
const social=await readFile(join(ROOT,'site/assets/social.png'))
const touch=await readFile(join(ROOT,'site/assets/touch-icon.png'))
const socialName=`social.${fingerprint(social)}.png`,touchName=`touch-icon.${fingerprint(touch)}.png`
await writeFile(join(OUT,'assets',socialName),social)
await writeFile(join(OUT,'assets',touchName),touch)
await writeFile(join(OUT,'og.png'),social)
await writeFile(join(OUT,'apple-touch-icon.png'),touch)
await cp(join(ROOT,'site/assets/mark.svg'),join(OUT,'favicon.svg'))

const rootUrl=ORIGIN+'/'
const fieldGuide='https://appautomaton.renocrypt.com/'
const groupCopy={
 skills:{name:'Agent skills',short:'Skills',title:'A little expertise.\nA lot more possibility.',text:'Reusable workflows for research, documents, presentations, and technical writing. Give your coding agents a useful place to begin.',icon:'layers',object:'stack',note:'Knowledge, ready to work.'},
 harnesses:{name:'Working systems',short:'Systems',title:'Good work needs\na sound structure.',text:'Harnesses, interfaces, and practical tools that carry work from the first plan to the final check.',icon:'frame',object:'portal',note:'A place for the process.'},
 mlx:{name:'Local intelligence',short:'Intelligence',title:'Machine intelligence.\nCloser to home.',text:'Speech, vision, video, 3D, forecasting, and scientific computing on Apple silicon. Explore the models and the work behind them.',icon:'circle',object:'molecule',note:'Possibility, on your machine.'},
 creative:{name:'Creative practice',short:'Creative',title:'Keep the human\nin the composition.',text:'A working environment for music, with editable outputs and room for judgment. The tools carry the process. You bring the taste.',icon:'wave',object:'wave',note:'A little room for instinct.'},
}
const groups=catalog.map(group=>({...group,design:groupCopy[group.key]}))
const artNames={stack:'folio',portal:'aperture',wave:'wave',lens:'lens',knot:'knot',field:'aperture',molecule:'orbit'}
const artAssets={},artSources={}
for(const name of Object.values(artNames)) {
 if(artAssets[name])continue
 const bytes=await readFile(join(ROOT,'site/assets/art',name+'.webp'))
 const file=`${name}.${fingerprint(bytes)}.webp`
 await writeFile(join(OUT,'assets/objects',file),bytes)
 artAssets[name]='assets/objects/'+file
 const variants=[]
 for(const width of [320,480]) {
  const small=await readFile(join(ROOT,'site/assets/art',`${name}-${width}.webp`))
  const path=`assets/objects/${name}-${width}.${fingerprint(small)}.webp`
  await writeFile(join(OUT,path),small)
  variants.push(`${path} ${width}w`)
 }
 artSources[name]=[...variants,`${artAssets[name]} 720w`].join(', ')
}
const projects=[]
for(const group of groups) for(const p of group.items) {
 const project={...p,description:editorial(p.description),group:group.key,groupName:group.design.name}
 const family=artNames[objectKind(project,group.key)]||'orbit'
 project.art=artAssets[family]
 project.artSrcset=artSources[family]
 projects.push(project)
}
for(const group of groups) {
 group.items=projects.filter(p=>p.group===group.key)
 group.art=artAssets[artNames[group.design.object]]
 group.artSrcset=artSources[artNames[group.design.object]]
 const bytes=await readFile(join(ROOT,'site/assets/art',`scene-${group.key}.webp`))
 group.scene=`assets/objects/scene-${group.key}.${fingerprint(bytes)}.webp`
 await writeFile(join(OUT,group.scene),bytes)
}
const hasSite=projects.filter(p=>p.site)
const description=`Explore ${unitCount} public App Automaton projects for coding agents, local AI, and creative work. Find project websites, source code, and practical ways to begin.`
const graph={'@context':'https://schema.org','@graph':[
 {'@type':'WebSite','@id':rootUrl+'#website',url:rootUrl,name:'App Automaton',description,publisher:{'@id':rootUrl+'#org'}},
 {'@type':'Organization','@id':rootUrl+'#org',name:'App Automaton',url:rootUrl,logo:rootUrl+'assets/mark.svg',parentOrganization:{'@type':'Organization',name:'AppCubic',url:'https://www.appcubic.com/'},sameAs:['https://github.com/appautomaton','https://huggingface.co/appautomaton']},
 {'@type':'CollectionPage','@id':rootUrl+'#page',url:rootUrl,name:'App Automaton · Tools for thought. Built for real work.',description,isPartOf:{'@id':rootUrl+'#website'},mainEntity:{'@id':rootUrl+'#catalog'},relatedLink:fieldGuide},
 {'@type':'ItemList','@id':rootUrl+'#catalog',name:'The App Automaton project catalog',numberOfItems:projects.length,itemListElement:projects.map((p,i)=>({'@type':'ListItem',position:i+1,item:{'@type':'SoftwareSourceCode','@id':(p.site??p.source)+'#project',name:p.repo,...(p.alsoKnownAs.length?{alternateName:p.alsoKnownAs}:{}),description:p.description,url:p.site??p.source,codeRepository:p.source,isPartOf:{'@id':rootUrl+'#website'}}}))},
]}
const head=(title,desc,canonical=rootUrl)=>`<meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${e(title)}</title><meta name="description" content="${e(desc)}"><meta name="robots" content="index, follow, max-image-preview:large"><link rel="canonical" href="${e(canonical)}"><meta name="theme-color" content="#f1efe9"><meta property="og:type" content="website"><meta property="og:site_name" content="App Automaton"><meta property="og:title" content="${e(title)}"><meta property="og:description" content="${e(desc)}"><meta property="og:url" content="${e(canonical)}"><meta property="og:image" content="${rootUrl}assets/${socialName}"><meta property="og:image:width" content="1200"><meta property="og:image:height" content="630"><meta property="og:image:alt" content="App Automaton. Tools for thought, built for real work."><meta name="twitter:card" content="summary_large_image"><link rel="icon" href="assets/mark.svg" type="image/svg+xml"><link rel="apple-touch-icon" href="assets/${touchName}" sizes="180x180"><link rel="preload" href="assets/fonts/UncutSans-Regular.woff2" as="font" type="font/woff2" crossorigin><link rel="preload" href="assets/fonts/UncutSans-Medium.woff2" as="font" type="font/woff2" crossorigin><script>(()=>{const r=document.documentElement;let t,m;try{t=localStorage.getItem('aa-mode');m=localStorage.getItem('aa-motion')}catch{}r.dataset.theme=t==='light'?'day':t==='dark'?'night':matchMedia('(prefers-color-scheme: dark)').matches?'night':'day';r.dataset.motion=m==='off'||matchMedia('(prefers-reduced-motion: reduce)').matches?'off':'on'})()</script><link rel="stylesheet" href="assets/${style}">`
const card=p=>`<article class="project" id="project-${e(p.repo)}" data-group="${p.group}" data-search="${e([p.repo,p.description,p.groupName,...p.chips,...p.alsoKnownAs].join(' ').toLowerCase())}"><div class="project-visual"><span class="project-number" aria-hidden="true">${p.tag}</span><a class="project-image" href="${e(p.site??p.source)}" aria-label="Explore ${e(p.repo)}${p.site?'':' on GitHub'}"><img src="${p.art}" srcset="${p.artSrcset}" sizes="(max-width:759px) 30vw, 18vw" alt="" width="720" height="720" loading="lazy" decoding="async"><span class="image-arrow" aria-hidden="true">${icon('arrow')}</span></a></div><div class="project-info"><div class="project-category"><span>${e(p.groupName)}</span><span>${p.site?'Project website':'Source available'}</span></div><h3><a href="${e(p.site??p.source)}">${e(p.repo).replaceAll('-','-<wbr>')}</a></h3><p>${e(p.description)}</p><div class="project-links">${p.site?`<a href="${e(p.site)}">View project <span class="sr-only">${e(p.repo)}</span>${icon('arrow')}</a>`:`<a href="${e(p.source)}">Explore the source <span class="sr-only">of ${e(p.repo)}</span>${icon('arrow')}</a>`}${p.site?`<a class="source" href="${e(p.source)}" aria-label="${e(p.repo)} source on GitHub">GitHub ${icon('arrow')}</a>`:''}</div></div></article>`
const featured=[]
const featuredKinds=new Set()
for(const project of projects){const kind=objectKind(project,project.group);if(!featuredKinds.has(kind)&&featured.length<6){featuredKinds.add(kind);featured.push(project)}}
for(const project of projects)if(featured.length<6&&!featured.includes(project))featured.push(project)
const figures=featured.map((p,i)=>`<a class="floating-object object-${i+1}" href="${e(p.site??p.source)}" aria-label="Explore ${e(p.repo)}" style="--float-delay:-${i*2.3}s;--float-duration:${12+i*1.7}s"><div class="object-drift"><img src="${p.art}" srcset="${p.artSrcset}" sizes="(max-width:759px) 38vw, 23vw" alt="" width="720" height="720" decoding="async"><span class="object-label">${e(p.repo)} ${icon('arrow')}</span></div></a>`).join('')
const lines=text=>text.split('\n').map((line,i)=>`<span class="type-line"><span style="--line:${i}">${e(line)}</span></span>`).join('')
const stories=groups.map((g,i)=>`<section class="story story-${g.key}" id="shelf-${g.key}" aria-labelledby="story-title-${g.key}" data-scene data-chapter="${i}"><div class="story-backdrop" aria-hidden="true"><img src="${g.scene}" alt="" width="1600" height="1000" loading="lazy" decoding="async"><div class="story-shade"></div></div><div class="story-foreground"><div class="story-top"><span>0${i+1}</span><span class="category-pill">${icon(g.design.icon)}${g.design.name}</span><span class="story-count">${g.items.length} ${g.items.length===1?'project':'projects'}</span></div><div class="story-layout"><span class="story-aside">Made to be useful</span><div class="story-copy"><span class="eyebrow">${g.design.note}</span><h2 id="story-title-${g.key}">${lines(g.design.title)}</h2><p>${g.design.text}</p><a class="button story-link" href="#projects" data-select="${g.key}"><span>Explore ${g.design.short.toLowerCase()}</span><span class="button-symbol">${icon('arrow')}</span></a></div></div><div class="story-bottom"><span>Built in public. Ready to explore.</span><a href="${e(g.items[0].site??g.items[0].source)}">Begin with ${e(g.items[0].repo)} ${icon('arrow')}</a></div></div></section>`).join('')
const indexNames={skills:'Agent skills',harnesses:'Systems',mlx:'Local AI',creative:'Creative'}
const indexRows=groups.map((g,i)=>{
 const artwork=`<span class="index-art index-art-${g.key}"><img src="${g.art}" srcset="${g.artSrcset}" sizes="(max-width:759px) 32vw, 23vw" alt="" width="720" height="720" loading="lazy" decoding="async"></span>`
 return `<a class="index-row index-row-${i+1}" href="#projects" data-select="${g.key}" data-reveal>${i%2?artwork:''}${icon(g.design.icon,'index-icon')}<span class="index-name">${indexNames[g.key]}</span>${i===0?artwork:''}<span class="index-count">(${String(g.items.length).padStart(2,'0')})</span>${i===2?artwork:''}<span class="index-arrow" aria-hidden="true">${icon('arrow')}</span></a>`
}).join('')

const html=`<!doctype html><html lang="en" data-theme="day"><head>${head('App Automaton · Open tools for AI, agents and local intelligence',description)}<script type="application/ld+json">${JSON.stringify(graph).replaceAll('<','\\u003c')}</script><script src="assets/${script}" defer></script></head><body><a class="skip" href="#projects">Skip to the projects</a>
<header class="site-header" id="top"><a class="brand" href="#top" aria-label="App Automaton home">${logo()}<span>App<br>Automaton</span></a><nav aria-label="Main navigation"><a href="#collections">The work</a><a href="#approach">Our approach</a><a href="https://github.com/appautomaton">GitHub ${icon('arrow')}</a></nav><div class="view-controls"><button class="theme-toggle control" type="button" hidden aria-label="Switch to night palette">${icon('sun','sun')}${icon('moon','moon')}<span class="theme-label">Night</span></button><button class="motion-toggle control" type="button" hidden aria-label="Motion" aria-pressed="true">${icon('pause','pause')}${icon('play','play')}<span class="sr-only">Motion</span></button></div></header>
<main><section class="hero" aria-labelledby="hero-title" data-scene><div class="hero-world" aria-label="Selected projects">${figures}</div><div class="hero-message"><p class="eyebrow">An open workshop for AI</p><h1 id="hero-title">Tools for thought.<br>Built for real work.</h1><p class="hero-description">Coding agents, local intelligence, and creative tools.<br>Made in public. Yours to explore.</p><a class="hero-link" href="#projects">Find your next tool ${icon('arrow')}</a></div><div class="hero-foot"><span>${unitCount} public projects<span class="small-dot"></span>One open workshop</span><a href="#directions">Scroll to explore ${icon('down')}</a></div></section>
<div class="stories" id="directions" style="--scene-count:${groups.length}"><div class="story-stage">${stories}<div class="scene-progress" aria-hidden="true"><span></span></div><nav class="scene-nav" aria-label="Fields of work">${groups.map((g,i)=>`<a href="#shelf-${g.key}" data-chapter-link="${i}" aria-label="0${i+1} ${g.design.name}"><span>0${i+1}</span></a>`).join('')}</nav></div></div>
<section class="collection-index" id="collections" aria-labelledby="index-title"><h2 id="index-title" class="eyebrow">Four fields. An open horizon.</h2><div class="index-rows">${indexRows}</div><p class="index-caption">A collection of useful possibilities.<br>Choose a field. Find a place to begin.</p></section>
<section class="approach" id="approach" aria-labelledby="approach-title"><div class="approach-top"><span class="eyebrow">The way we work</span><span>App Automaton / An AppCubic workshop</span></div><h2 id="approach-title" data-reveal>Useful is a<br>beautiful thing.</h2><div class="approach-body"><p class="approach-lead">We work where curiosity meets implementation. Clear interfaces, inspectable code, and practical ways to carry an idea further.</p><div><p>The workshop brings together reusable skills, agent harnesses, machine-learning runtimes, and creative systems. Each project has its own source, documentation, and terms.</p><p>Explore what is here. Read how it works. Make something of your own.</p><a class="text-link" href="https://www.appcubic.com/appautomaton/">Meet the studio behind the workshop ${icon('arrow')}</a></div></div><div class="principles"><div data-reveal><span>01</span><h3>Open to inspection.</h3><p>Public source, explicit interfaces, and documentation beside the work.</p></div><div data-reveal><span>02</span><h3>Made to be useful.</h3><p>Tools that connect model capability to tasks, workflows, and real hardware.</p></div><div data-reveal><span>03</span><h3>Room for judgment.</h3><p>Verifiable outputs and enough control to keep the human in the process.</p></div></div></section>
<section class="collection" id="projects" aria-labelledby="collection-title"><span id="catalog" class="anchor-alias"></span><div class="collection-title" data-reveal><div><span class="eyebrow">The complete collection</span><h2 id="collection-title">Find your<br>starting point.</h2></div><div class="collection-note"><span class="collection-total">${unitCount}</span><p>Public projects.<br>Plenty of possibilities.</p></div></div><form class="catalog-tools" role="search" hidden><div class="filters" aria-label="Filter projects by field"><button type="button" class="filter active" data-filter="all" aria-pressed="true">Everything <span>${unitCount}</span></button>${groups.map(g=>`<button type="button" class="filter" data-filter="${g.key}" aria-pressed="false">${g.design.name}</button>`).join('')}</div><label class="search">${icon('search')}<input type="search" placeholder="Something in mind?" aria-label="Search projects" autocomplete="off" spellcheck="false"><kbd>/</kbd></label></form><p class="filter-status sr-only" aria-live="polite"></p><div class="projects">${projects.map(card).join('')}</div><div class="empty" hidden><h3>No match. More possibilities.</h3><p>Try another word or return to the full collection.</p><button class="reset-search button" type="button">Show everything ${icon('arrow')}</button></div><div class="collection-foot"><p>${hasSite.length} project websites. Source available for every entry.</p><a href="catalog.json">Machine-readable catalog ${icon('arrow')}</a></div></section>
<section class="elsewhere" aria-labelledby="elsewhere-title"><div><span class="eyebrow">A change of scenery</span><h2 id="elsewhere-title">Same workshop.<br>A different perspective.</h2><p>RenoCrypt’s App Automaton field guide offers another way into the projects, with a character all its own.</p><a class="button" href="${fieldGuide}"><span>Visit the field guide</span><span class="button-symbol">${icon('arrow')}</span></a></div><div class="elsewhere-drawing" aria-hidden="true"><svg viewBox="0 0 320 320" fill="none" stroke="currentColor"><circle cx="160" cy="160" r="138" stroke-dasharray="1 9"/>${Array.from({length:8},(_,i)=>`<ellipse cx="160" cy="111" rx="32" ry="71" transform="rotate(${i*45} 160 160)"/>`).join('')}<circle cx="160" cy="160" r="24"/></svg></div></section></main>
<footer data-reveal><div class="footer-top"><a class="brand" href="#top">${logo()}<span>App<br>Automaton</span></a><p>Independent thinking.<br>Shared possibilities.</p><div><a href="https://github.com/appautomaton">GitHub ${icon('arrow')}</a><a href="https://huggingface.co/appautomaton">Hugging Face ${icon('arrow')}</a><a href="llms.txt">Text edition ${icon('arrow')}</a><a href="colophon.html">Colophon ${icon('arrow')}</a></div></div><div class="footer-word" aria-hidden="true"><span>Keep making.</span></div><div class="footer-bottom"><span>An <a href="https://www.appcubic.com/">AppCubic</a> workshop.</span><a href="https://www.renocrypt.com/">Research & writing at RenoCrypt ${icon('arrow')}</a><a href="#top">Back to the top ${icon('arrow')}</a></div></footer></body></html>`
await writeFile(join(OUT,'index.html'),html)
const sitemapUrls=[rootUrl,...hasSite.map(p=>p.site),rootUrl+'colophon.html']
await writeFile(join(OUT,'sitemap.xml'),`<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${sitemapUrls.map(url=>{const p=projects.find(p=>p.site===url);return `<url><loc>${e(url)}</loc>${p?.lastmod?`<lastmod>${p.lastmod}</lastmod>`:''}</url>`}).join('')}</urlset>\n`)
const sitemaps=[...new Set([rootUrl+'sitemap.xml',...projects.map(p=>p.sitemap).filter(Boolean)])].sort()
await writeFile(join(OUT,'robots.txt'),`User-agent: *\nAllow: /\n\n${sitemaps.map(url=>'Sitemap: '+url).join('\n')}\n`)
await writeFile(join(OUT,'llms.txt'),renderLlms(catalog,ORIGIN).replace('- [RenoCrypt]',`- [RenoCrypt field guide](${fieldGuide}): another way to explore the project websites.\n- [RenoCrypt]`))
await writeFile(join(OUT,'catalog.json'),JSON.stringify({organization:'appautomaton',url:rootUrl,projects:projects.map(({art,artSrcset,...p})=>p)},null,2)+'\n')
await writeFile(join(OUT,'colophon.html'),`<!doctype html><html lang="en"><head>${head('Colophon · App Automaton','The type, illustrations, and working principles behind the App Automaton website.',rootUrl+'colophon.html')}</head><body><main class="colophon-page"><a class="text-link" href="./">Back to App Automaton ${icon('arrow')}</a><h1>Made with<br>intention.</h1><h2>Type with a clear voice.</h2><p>Uncut Sans by Kasper Nordkvist is self-hosted under the SIL Open Font License. <a href="assets/fonts/UncutSans-LICENSE.txt">Read the license</a> or <a href="https://github.com/kaspernordkvist/uncut_sans">visit the original source</a>.</p><h2>Objects, drawn for the workshop.</h2><p>The sculptures are original material studies, modeled and rendered in Blender. Ceramic leaves, anodized frames, woven metal, and orbital instruments give each field its own form. The brand and interface marks are original SVGs. The browser receives compressed images and readable HTML.</p><h2>A point of reference.</h2><p><a href="https://floema.com/en">Floema</a> inspired the spatial composition, generous type, and editorial rhythm. Its photographs, product images, fonts, and illustrations are not used here.</p><h2>Collected at the source.</h2><p>Project facts come from the public App Automaton GitHub organization, with editorial placement and copy maintained in this repository. The site refreshes daily and on demand. Project websites, source repositories, structured data, and discovery files come from the same catalog.</p><h2>Room for every reader.</h2><p>The complete catalog works without JavaScript. Motion is optional and follows device preferences. Every project link is a normal, followable HTML link.</p><a class="text-link" href="https://github.com/appautomaton/appautomaton.github.io">Read the website source ${icon('arrow')}</a></main></body></html>`)
await writeFile(join(OUT,'404.html'),`<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex"><title>A different path · App Automaton</title><link rel="stylesheet" href="/assets/${style}"></head><body><main class="colophon-page"><h1>A different path.</h1><p>This page is not here. The workshop is a good place to start again.</p><a class="text-link" href="${rootUrl}">Explore the projects ${icon('arrow')}</a></main></body></html>`)
await writeFile(join(OUT,'.nojekyll'),'')
console.log(`rendered dist/index.html with ${projects.length} catalog cards`)
console.log(`wrote dist/llms.txt with ${projects.length} projects`)
console.log(`wrote dist/sitemap.xml with ${sitemapUrls.length} URLs`)
console.log(`wrote dist/robots.txt declaring ${sitemaps.length} sitemaps`)
