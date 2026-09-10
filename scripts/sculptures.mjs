// Original objects for the workshop. Geometry, lighting, and SVG are computed at
// build time. The browser receives a finished image, never a 3D rendering engine.
const TAU = Math.PI * 2
const dot = (a,b) => a.reduce((n,v,i)=>n+v*b[i],0)
const subtract = (a,b) => a.map((v,i)=>v-b[i])
const cross = (a,b) => [a[1]*b[2]-a[2]*b[1],a[2]*b[0]-a[0]*b[2],a[0]*b[1]-a[1]*b[0]]
const unit = a => { const length=Math.hypot(...a)||1; return a.map(v=>v/length) }
const light = unit([-1,2,1.5])
const viewer = unit([1,1.2,1])
const halfway = unit(light.map((v,i)=>v+viewer[i]))
const round = n => Math.round(n*100)/100
const tint = (hex, normal) => {
  const diffuse=.48+.5*Math.max(0,dot(normal,light))
  const shine=Math.pow(Math.max(0,dot(normal,halfway)),20)*.17
  return '#'+[1,3,5].map(i=>Math.min(255,Math.round(parseInt(hex.slice(i,i+2),16)*diffuse+255*shine)).toString(16).padStart(2,'0')).join('')
}
export function seedFor(value) {
  let seed=2166136261
  for (const c of value) seed=Math.imul(seed^c.codePointAt(0),16777619)>>>0
  return seed
}
export function objectKind(project, group='') {
  const words=[project.repo,project.description,...(project.chips||[])].join(' ').toLowerCase()
  if (/atom|molecular|dft/.test(words)) return 'molecule'
  if (/forecast|time.series/.test(words)) return 'field'
  if (/vision|detection|segmentation/.test(words)) return 'lens'
  if (/spatial|3d|geometry/.test(words)) return 'knot'
  if (/speech|sound|audio|music|asr|stems|video/.test(words)) return 'wave'
  if (group==='harnesses') return 'portal'
  if (group==='creative') return 'wave'
  return 'stack'
}

export function sculpture(kind, seed=0) {
  const yaw=((seed%11)-5)*.065
  const rotate=([x,y,z])=>[x*Math.cos(yaw)+z*Math.sin(yaw),y,-x*Math.sin(yaw)+z*Math.cos(yaw)]
  const project=([x,y,z])=>[320+(x-z)*1.55,328+(x+z)*.69-y*1.65]
  const depth=point=>dot(point,viewer)
  const shapes=[]
  const colors={stack:'#d7b48b',portal:'#aebba5',wave:'#8aafbb',lens:'#d2cbb9',knot:'#d58e68',field:'#a4b3a5',molecule:'#c6ca8b'}
  const color=colors[kind]||colors.stack
  function face(points, material=color) {
    const vertices=points.map(rotate)
    const normal=unit(cross(subtract(vertices[1],vertices[0]),subtract(vertices[2],vertices[0])))
    if (dot(normal,viewer)<-.015) return
    const center=vertices[0].map((_,i)=>vertices.reduce((sum,p)=>sum+p[i],0)/vertices.length)
    const fill=tint(material,normal)
    const d=vertices.map((p,i)=>`${i?'L':'M'}${project(p).map(round).join(' ')}`).join('')+'Z'
    shapes.push({depth:depth(center),markup:`<path d="${d}" fill="${fill}" stroke="${fill}" stroke-width=".65" stroke-linejoin="round"/>`})
  }
  function box(x,y,z,w,h,d,material=color,angle=0) {
    const vertices=[[-1,-1,-1],[1,-1,-1],[1,1,-1],[-1,1,-1],[-1,-1,1],[1,-1,1],[1,1,1],[-1,1,1]].map(([a,b,c])=>{
      const px=a*w/2,pz=c*d/2
      return [x+px*Math.cos(angle)+pz*Math.sin(angle),y+b*h/2,z-px*Math.sin(angle)+pz*Math.cos(angle)]
    })
    for (const indices of [[4,5,6,7],[1,2,6,5],[3,7,6,2],[0,3,2,1],[0,4,7,3],[0,1,5,4]]) face(indices.map(i=>vertices[i]),material)
  }
  function surface(n,m,at,material=color,reverse=false) {
    for(let i=0;i<n;i++) for(let j=0;j<m;j++) {
      const pts=[at(i/n,j/m),at((i+1)/n,j/m),at((i+1)/n,(j+1)/m),at(i/n,(j+1)/m)]
      face(reverse?pts.reverse():pts,material)
    }
  }
  function torus(radius,tube,tilt=0,offset=[0,0,0],material=color) {
    surface(56,14,(u,v)=>{
      const a=u*TAU,b=v*TAU
      const x=(radius+tube*Math.cos(b))*Math.cos(a),y=tube*Math.sin(b),z=(radius+tube*Math.cos(b))*Math.sin(a)
      return [x+offset[0],y*Math.cos(tilt)-z*Math.sin(tilt)+offset[1],y*Math.sin(tilt)+z*Math.cos(tilt)+offset[2]]
    },material,true)
  }
  function sphere(point,radius,material=color) {
    const p=rotate(point),[x,y]=project(p)
    shapes.push({depth:depth(p)+radius*.5,markup:`<circle cx="${round(x)}" cy="${round(y)}" r="${round(radius*1.55)}" fill="url(#ball)" stroke="${material}" stroke-width=".5"/>`})
  }
  function link(a,b) {
    const p=rotate(a),q=rotate(b),[x,y]=project(p),[u,v]=project(q)
    shapes.push({depth:(depth(p)+depth(q))/2,markup:`<path d="M${round(x)} ${round(y)}L${round(u)} ${round(v)}" stroke="#59695c" stroke-width="9" stroke-linecap="round"/><path d="M${round(x-1.2)} ${round(y-1.2)}L${round(u-1.2)} ${round(v-1.2)}" stroke="#bbc6ad" stroke-width="3" stroke-linecap="round"/>`})
  }

  if(kind==='stack') {
    for(let i=0;i<8;i++) box(Math.sin(i*.65)*12,i*21-74,0,155,12,112,i%3===1?'#d78d68':color,(i-3)*.055)
    box(0,91,0,152,3,110,'#ebe2c9',.23)
  } else if(kind==='portal') {
    for(let i=0;i<3;i++) {
      const z=(i-1)*57,c=i===1?'#d2cbb7':color
      box(-78,-3,z,24,176,18,c)
      box(78,-3,z,24,176,18,c)
      box(0,85,z,180,24,18,c)
      box(0,-87,z,180,14,18,c)
    }
    box(0,-99,0,196,10,150,'#d8d3c4')
  } else if(kind==='wave') {
    const phase=(seed%7)*.17
    for(let k=0;k<9;k++) {
      const z=(k-4)*19
      surface(36,1,(u,v)=>{
        const x=(u-.5)*232,y=Math.sin(u*Math.PI*2+phase)*42+Math.sin(k*.7)*12
        return [x,y+(v-.5)*9,z]
      },k%3===0?'#becbca':color)
      surface(36,1,(u,v)=>{
        const x=(u-.5)*232,y=Math.sin(u*Math.PI*2+phase)*42+Math.sin(k*.7)*12
        return [x,y+4.5,z+(v-.5)*11]
      },color,true)
    }
  } else if(kind==='lens') {
    box(0,-105,0,132,15,100,'#c8c6b8')
    torus(78,27,1.25,[0,0,0],color)
    torus(79,5,1.25,[0,-10,0],'#81978c')
  } else if(kind==='knot') {
    surface(110,10,(u,v)=>{
      const a=u*TAU*2,b=v*TAU
      const r=70+17*Math.cos(a*1.5)
      const center=[r*Math.cos(a),47*Math.sin(a*1.5),r*Math.sin(a)]
      const radial=unit([Math.cos(a),.45*Math.cos(a*1.5),Math.sin(a)])
      const vertical=unit(cross(radial,[-Math.sin(a),.4*Math.cos(a*1.5),Math.cos(a)]))
      return center.map((c,i)=>c+18*(radial[i]*Math.cos(b)+vertical[i]*Math.sin(b)))
    },color,true)
  } else if(kind==='field') {
    for(let x=0;x<7;x++) for(let z=0;z<7;z++) {
      const h=28+86*(.5+.5*Math.sin(x*.7+z*.48+(seed%5)*.2))
      box((x-3)*27,h/2-65,(z-3)*27,17,h,17,x%3===1?'#c9c6a0':color)
    }
    box(0,-71,0,198,8,198,'#c5c9b7')
  } else if(kind==='molecule') {
    const points=[[0,0,0],[-80,35,0],[75,50,0],[0,-40,75],[0,-50,-75],[-62,-45,-53],[55,-45,54],[0,97,0]]
    for(let i=1;i<points.length;i++) link(points[0],points[i])
    for(const [a,b] of [[1,5],[2,6],[3,6],[4,5],[1,7],[2,7]]) link(points[a],points[b])
    points.forEach((p,i)=>sphere(p,i?18:29))
  } else {
    torus(80,28,1.1)
  }
  shapes.sort((a,b)=>a.depth-b.depth)
  return `<svg xmlns="http://www.w3.org/2000/svg" width="640" height="640" viewBox="0 0 640 640" fill="none"><defs><radialGradient id="ball" cx="32%" cy="25%" r="74%"><stop stop-color="#eef0d4"/><stop offset=".4" stop-color="${color}"/><stop offset="1" stop-color="#59694e"/></radialGradient><radialGradient id="shadow"><stop stop-color="#152321" stop-opacity=".17"/><stop offset="1" stop-color="#152321" stop-opacity="0"/></radialGradient></defs><ellipse cx="326" cy="563" rx="190" ry="32" fill="url(#shadow)"/>${shapes.map(s=>s.markup).join('')}</svg>`
}
