(() => {
 const root=document.documentElement
 const reduced=matchMedia('(prefers-reduced-motion: reduce)')
 const systemTheme=matchMedia('(prefers-color-scheme: dark)')
 const fine=matchMedia('(hover: hover) and (pointer: fine)')
 const theme=document.querySelector('.theme-toggle')
 const motion=document.querySelector('.motion-toggle')
 const read=key=>{try{return localStorage.getItem(key)}catch{return null}}
 const save=(key,value)=>{try{localStorage.setItem(key,value)}catch{}}
 let paused=read('aa-motion')==='off'
 let requestedTheme=root.dataset.theme
 let transition
 const moving=new Set()
 const canMove=()=>!paused&&!reduced.matches&&!document.hidden
 function reflectTheme(){
  const night=root.dataset.theme==='night'
  theme.setAttribute('aria-label',`Switch to ${night?'day':'night'} palette`)
  theme.querySelector('.theme-label').textContent=night?'Day':'Night'
  document.querySelector('meta[name=theme-color]').content=night?'#17201d':'#f1efe9'
 }
 theme.hidden=false
 reflectTheme()
 theme.addEventListener('click',()=>{
  requestedTheme=requestedTheme==='night'?'day':'night'
  const next=requestedTheme
  const apply=()=>{root.dataset.theme=next;save('aa-mode',next==='night'?'dark':'light');reflectTheme()}
  transition?.skipTransition()
  if(!canMove()||!document.startViewTransition){apply();return}
  const current=document.startViewTransition(apply)
  transition=current
  current.ready.catch(()=>{})
  current.finished.catch(()=>{}).finally(()=>{if(transition===current)transition=undefined})
 })
 systemTheme.addEventListener('change',event=>{
  if(!['light','dark'].includes(read('aa-mode'))){requestedTheme=root.dataset.theme=event.matches?'night':'day';reflectTheme()}
 })
 const tools=document.querySelector('.catalog-tools')
 const input=tools.querySelector('input')
 const cards=[...document.querySelectorAll('.project')]
 const filters=[...document.querySelectorAll('.filter')]
 const status=document.querySelector('.filter-status')
 const empty=document.querySelector('.empty')
 let selected='all'
 tools.hidden=false
 tools.addEventListener('submit',event=>event.preventDefault())
 function settle(){moving.forEach(a=>a.cancel());moving.clear()}
 function filter(){
  const animate=canMove()&&typeof Element.prototype.animate==='function'
  const old=new Map()
  if(animate)cards.filter(c=>!c.hidden).forEach(c=>old.set(c,c.getBoundingClientRect()))
  settle()
  const query=input.value.trim().toLowerCase()
  let count=0
  cards.forEach(card=>{
   const shown=(selected==='all'||card.dataset.group===selected)&&card.dataset.search.includes(query)
   card.hidden=!shown
   if(shown)count++
  })
  filters.forEach(button=>{const active=button.dataset.filter===selected;button.classList.toggle('active',active);button.setAttribute('aria-pressed',String(active))})
  empty.hidden=count>0
  status.textContent=`${count} ${count===1?'project':'projects'} shown`
  if(!animate)return
  // Read all final positions before starting a transform. No animation delays a link.
  const positions=cards.filter(c=>!c.hidden).map(c=>[c,c.getBoundingClientRect()])
  positions.forEach(([card,rect])=>{
   if(rect.top>=innerHeight||rect.bottom<=0)return
   const previous=old.get(card)
   const nearby=previous&&previous.bottom>0&&previous.top<innerHeight
   const dx=nearby?previous.left-rect.left:0,dy=nearby?previous.top-rect.top:15
   if(!dx&&!dy)return
   const animation=card.animate([{transform:`translate(${dx}px,${dy}px)`,opacity:nearby?1:.8},{transform:'translate(0,0)',opacity:1}],{duration:500,easing:'cubic-bezier(.2,.8,.2,1)'})
   moving.add(animation)
   animation.finished.catch(()=>{}).finally(()=>moving.delete(animation))
  })
 }
 filters.forEach(button=>button.addEventListener('click',()=>{selected=button.dataset.filter;filter()}))
 input.addEventListener('input',filter)
 document.querySelector('.reset-search').addEventListener('click',()=>{selected='all';input.value='';filter();input.focus()})
 document.querySelectorAll('[data-select]').forEach(link=>link.addEventListener('click',()=>{selected=link.dataset.select;input.value='';filter()}))
 document.addEventListener('keydown',event=>{
  const editing=/INPUT|TEXTAREA|SELECT/.test(document.activeElement.tagName)||document.activeElement.isContentEditable
  if(event.key==='/'&&!event.metaKey&&!event.ctrlKey&&!event.altKey&&!editing){event.preventDefault();input.focus({preventScroll:true});input.scrollIntoView({block:'center',behavior:canMove()?'smooth':'instant'})}
  if(event.key==='Escape'&&document.activeElement===input){input.value='';filter()}
 })

 // Scroll remains native. A single scheduled frame updates only visible layers.
 const hero=document.querySelector('.hero')
 const world=document.querySelector('.hero-world')
 const sequence=document.querySelector('.stories')
 const chapters=[...document.querySelectorAll('[data-chapter]')].map(section=>({
  section,background:section.querySelector('.story-backdrop'),image:section.querySelector('.story-backdrop>img'),
  foreground:section.querySelector('.story-foreground'),lines:[...section.querySelectorAll('.type-line>span')],
  paragraph:section.querySelector('.story-copy>p'),button:section.querySelector('.story-link'),
 }))
 const chapterLinks=[...document.querySelectorAll('[data-chapter-link]')]
 const header=document.querySelector('.site-header')
 const approach=document.querySelector('.approach')
 const progress=document.querySelector('.scene-progress')
 const pinMedia=matchMedia('(min-width: 760px) and (min-height: 640px)')
 const clamp=(value,min=0,max=1)=>Math.max(min,Math.min(max,value))
 const ease=value=>{const t=clamp(value);return t*t*(3-2*t)}
 let frameId=0,aimX=0,aimY=0,x=0,y=0
 let metrics={},active=0,pinned=false
 chapters.forEach(({section},i)=>section.style.setProperty('--chapter',i))
 function measure(){
  metrics={height:innerHeight,hero:hero.offsetHeight,top:sequence.getBoundingClientRect().top+scrollY,
   end:sequence.getBoundingClientRect().bottom+scrollY,
   approachTop:approach.getBoundingClientRect().top+scrollY,
   approachEnd:approach.getBoundingClientRect().bottom+scrollY}
  schedule()
 }
 function stop(){cancelAnimationFrame(frameId);frameId=0;aimX=aimY=x=y=0;world.style.removeProperty('transform')}
 function schedule(){if(!frameId&&!document.hidden)frameId=requestAnimationFrame(frame)}
 function frame(){
  frameId=0
  if(document.hidden)return
  const offset=scrollY,h=metrics.height
  const inHero=offset<metrics.top+h
  hero.dataset.visible=String(inHero)
  header.dataset.tone=(offset+65>=metrics.top&&offset+65<metrics.end)||(offset+65>=metrics.approachTop&&offset+65<metrics.approachEnd)?'light':'normal'
  if(canMove()&&inHero){
   x+=(aimX-x)*.12;y+=(aimY-y)*.12
   const travel=clamp(offset/metrics.hero)
   world.style.transform=`perspective(1400px) translate3d(${(x*15).toFixed(2)}px,${(y*9-travel*35).toFixed(2)}px,0) rotateX(${(-y*2).toFixed(2)}deg) rotateY(${(x*3).toFixed(2)}deg) scale(${(1+travel*.28).toFixed(4)})`
   if(Math.abs(aimX-x)+Math.abs(aimY-y)>.002)schedule()
  }
  if(!pinned)return
  const p=clamp((offset-metrics.top)/(h*1.45),0,chapters.length-.65)
  // Incoming imagery starts before the outgoing copy leaves. The incoming
  // heading follows the wipe, with its lines and supporting copy staggered.
  let nextActive=0
  chapters.forEach(({section,background,image,foreground,lines,paragraph,button},i)=>{
   const local=p-i
   const arrival=i===0?1:ease((local+.27)/.61)
   const enter=i===0?1:ease((local-.025)/.25)
   const leave=i===chapters.length-1?0:ease((local-.81)/.25)
   const opacity=enter*(1-leave)
   background.style.transform=`translate3d(0,${((1-arrival)*100).toFixed(3)}%,0)`
   background.style.visibility=arrival>0?'visible':'hidden'
   image.style.transform=`translate3d(0,${(-clamp(local,-1,1)*32).toFixed(2)}px,0) scale(1.09)`
   foreground.style.opacity=opacity.toFixed(4)
   lines.forEach((line,j)=>{
    const reveal=i===0?1:ease((local-.025-j*.045)/.25)
    line.style.transform=`translate3d(0,${((1-reveal)*110-leave*28).toFixed(2)}%,0)`
   })
   const detail=i===0?1:ease((local-.12)/.3)
   paragraph.style.transform=`translate3d(0,${((1-detail)*22-leave*14).toFixed(2)}px,0)`
   paragraph.style.opacity=detail.toFixed(4)
   button.style.transform=`translate3d(0,${((1-detail)*35-leave*10).toFixed(2)}px,0)`
   button.style.opacity=detail.toFixed(4)
   if(opacity>.35)nextActive=i
   section.inert=opacity<.35
  })
  active=nextActive
  chapterLinks.forEach((link,i)=>link.setAttribute('aria-current',String(i===active)))
  progress.style.setProperty('--progress',clamp((p+.65)/chapters.length).toFixed(4))
 }
 function configurePin(preserve=false){
  const enabled=!paused&&!reduced.matches&&pinMedia.matches
  if(enabled===pinned){measure();return}
  const wasPinned=pinned
  const within=scrollY>=metrics.top&&scrollY<metrics.end
  const previous=wasPinned?active:Math.max(0,chapters.findIndex(({section})=>section.getBoundingClientRect().bottom>innerHeight*.5))
  pinned=enabled
  root.dataset.pin=String(enabled)
  if(!enabled){
   chapters.forEach(({section,background,image,foreground,lines,paragraph,button})=>{
    section.inert=false
    for(const element of [background,image,foreground,...lines,paragraph,button])element.removeAttribute('style')
   })
  }
  measure()
  if(preserve&&within){
   scrollTo({top:enabled?metrics.top+(previous+.35)*innerHeight*1.45:chapters[previous].section.getBoundingClientRect().top+scrollY,behavior:'instant'})
  }
  schedule()
 }
 chapterLinks.forEach(link=>link.addEventListener('click',event=>{
  if(!pinned)return
  event.preventDefault()
  const i=Number(link.dataset.chapterLink)
  scrollTo({top:metrics.top+(i+.35)*innerHeight*1.45,behavior:canMove()?'smooth':'instant'})
 }))
 hero.addEventListener('pointermove',event=>{
  if(!fine.matches||!canMove())return
  aimX=clamp(event.clientX/innerWidth*2-1,-1,1)
  aimY=clamp(event.clientY/innerHeight*2-1,-1,1)
  schedule()
 },{passive:true})
 hero.addEventListener('pointerleave',()=>{aimX=aimY=0;schedule()})
 hero.addEventListener('focusin',()=>{if(pinned&&scrollY>innerHeight*.15)scrollTo({top:0,behavior:'instant'})})
 addEventListener('scroll',schedule,{passive:true})
 addEventListener('resize',()=>configurePin(),{passive:true})
 if('ResizeObserver'in window)new ResizeObserver(measure).observe(document.querySelector('main'))
 if('IntersectionObserver'in window){
  const observer=new IntersectionObserver(entries=>entries.forEach(({target,isIntersecting})=>{
   if(isIntersecting){target.dataset.reveal='ready';observer.unobserve(target)}
  }),{threshold:.12})
  document.querySelectorAll('[data-reveal]').forEach(element=>{
   if(element.getBoundingClientRect().top>innerHeight){element.dataset.reveal='pending';observer.observe(element)}
   else element.dataset.reveal='ready'
  })
 }
 function reflectMotion(){
  const enabled=!paused&&!reduced.matches
  root.dataset.motion=enabled?'on':'off'
  root.dataset.awake=String(!document.hidden)
  motion.setAttribute('aria-pressed',String(enabled))
  motion.setAttribute('aria-label',reduced.matches?'Motion off, following your device preference':'Motion')
  motion.title=reduced.matches?'Motion follows your device preference':enabled?'Pause motion':'Resume motion'
  motion.disabled=reduced.matches
  if(!canMove()){stop();settle();transition?.skipTransition()}
  configurePin(true)
 }
 motion.hidden=false
 root.dataset.enhanced='true'
 measure()
 reflectMotion()
 motion.addEventListener('click',()=>{paused=!paused;save('aa-motion',paused?'off':'on');reflectMotion()})
 reduced.addEventListener('change',reflectMotion)
 document.addEventListener('visibilitychange',reflectMotion)
 addEventListener('pagehide',()=>{stop();settle()})
 addEventListener('pageshow',reflectMotion)
})()
