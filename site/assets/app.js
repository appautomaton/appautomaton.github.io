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

 // One settling frame chain moves the gallery as a whole. Each object's slow
 // floating movement belongs to a separate CSS layer and stops offscreen.
 const hero=document.querySelector('.hero')
 const world=document.querySelector('.hero-world')
 let heroVisible=false,frameId=0,height=hero.offsetHeight
 let aimX=0,aimY=0,x=0,y=0,travel=0
 function stop(){cancelAnimationFrame(frameId);frameId=0;aimX=aimY=x=y=travel=0;world.style.removeProperty('transform')}
 function schedule(){if(!frameId&&heroVisible&&canMove())frameId=requestAnimationFrame(frame)}
 function frame(){
  frameId=0
  if(!heroVisible||!canMove())return
  const target=Math.max(0,Math.min(1,scrollY/height))
  x+=(aimX-x)*.1;y+=(aimY-y)*.1;travel+=(target-travel)*.13
  world.style.transform=`perspective(1200px) translate3d(${(x*16).toFixed(2)}px,${(y*10-travel*55).toFixed(2)}px,0) rotateX(${(-y*3).toFixed(2)}deg) rotateY(${(x*4).toFixed(2)}deg) scale(${(1+travel*.07).toFixed(4)})`
  if(Math.abs(aimX-x)+Math.abs(aimY-y)+Math.abs(target-travel)>.002)schedule()
 }
 hero.addEventListener('pointermove',event=>{
  if(!fine.matches||!canMove())return
  aimX=Math.max(-1,Math.min(1,event.clientX/innerWidth*2-1))
  aimY=Math.max(-1,Math.min(1,(event.clientY+scrollY)/height*2-1))
  schedule()
 },{passive:true})
 hero.addEventListener('pointerleave',()=>{aimX=aimY=0;schedule()})
 addEventListener('scroll',schedule,{passive:true})
 addEventListener('resize',()=>{height=hero.offsetHeight;schedule()},{passive:true})
 if('ResizeObserver'in window)new ResizeObserver(()=>{height=hero.offsetHeight;schedule()}).observe(hero)
 if('IntersectionObserver'in window){
  const observer=new IntersectionObserver(entries=>entries.forEach(({target,isIntersecting})=>{
   target.dataset.visible=String(isIntersecting)
   if(target===hero){heroVisible=isIntersecting;if(isIntersecting)schedule();else stop()}
  }),{threshold:0})
  document.querySelectorAll('[data-scene]').forEach(scene=>observer.observe(scene))
 }
 function reflectMotion(){
  const enabled=!paused&&!reduced.matches
  root.dataset.motion=enabled?'on':'off'
  root.dataset.awake=String(!document.hidden)
  motion.setAttribute('aria-pressed',String(enabled))
  motion.setAttribute('aria-label',reduced.matches?'Motion off, following your device preference':'Motion')
  motion.title=reduced.matches?'Motion follows your device preference':enabled?'Pause motion':'Resume motion'
  motion.disabled=reduced.matches
  if(!canMove()){stop();settle();transition?.skipTransition()}else schedule()
 }
 motion.hidden=false
 reflectMotion()
 motion.addEventListener('click',()=>{paused=!paused;save('aa-motion',paused?'off':'on');reflectMotion()})
 reduced.addEventListener('change',reflectMotion)
 document.addEventListener('visibilitychange',reflectMotion)
 addEventListener('pagehide',()=>{stop();settle()})
 addEventListener('pageshow',reflectMotion)
 root.dataset.enhanced='true'
})()
