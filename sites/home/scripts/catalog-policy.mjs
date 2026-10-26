// GitHub owns project facts. Editorial placement can override this conservative
// fallback without requiring a source edit for every newly published website.
export const projectAddress=(origin,name)=>`${origin}/${encodeURIComponent(name)}/`

// A project lives wherever its About URL says. The catalog refuses only an
// address it cannot safely link to.
export function homepageProblem(repo){
 if(!repo.homepage)return null
 let url
 try{url=new URL(repo.homepage)}catch{return `${repo.name} About URL ${JSON.stringify(repo.homepage)} is not a URL`}
 return url.protocol==='https:'?null:`${repo.name} About URL ${JSON.stringify(repo.homepage)} is not an https address`
}

// The central sitemap and robots.txt may list only addresses on their own host.
export const servedFrom=(origin,url)=>typeof url==='string'&&url.startsWith(`${origin}/`)

export function automaticGroup(repo){
 const name=repo.name.toLowerCase()
 const topics=repo.topics.join(' ').toLowerCase()
 if(/^mlx-|^ltx-|\b(mlx|machine-learning|local-inference|apple-silicon)\b/.test(name+' '+topics))return 'mlx'
 if(/\b(agent-skills?|claude-skills?|codex-skills?)\b/.test(topics)||/skills?$/.test(name))return 'skills'
 if(/\b(music-production|creative-tools|audio-workstation|generative-art)\b/.test(topics))return 'creative'
 return 'harnesses'
}

export function selectExhibits(repos,shelves,notShown){
 const placed=new Set(shelves.flatMap(s=>s.items.map(p=>p.repo)))
 const missing=[...placed].filter(name=>!repos.some(r=>r.name===name))
 if(missing.length)throw new Error(`Editorial placements reference unavailable repositories: ${missing.join(', ')}`)
 return repos.filter(r=>!Object.hasOwn(notShown,r.name)&&(placed.has(r.name)||(r.hasSite&&r.homepage))).map(r=>({
  ...r,...(!placed.has(r.name)?{automaticGroup:automaticGroup(r)}:{}),
 }))
}

export function resolveShelves(shelves,repos){
 const placed=new Set(shelves.flatMap(s=>s.items.map(p=>p.repo)))
 return shelves.map(s=>({...s,items:[...s.items,...repos.filter(r=>!placed.has(r.name)&&r.automaticGroup===s.key).sort((a,b)=>(a.catalogOrder??Infinity)-(b.catalogOrder??Infinity)||a.name.localeCompare(b.name)).map(r=>({repo:r.name,span:4}))]}))
}
