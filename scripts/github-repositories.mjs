// The API is the only recipient of the GitHub credential. Page probes never
// receive it. Pagination prevents future projects disappearing after page one.
export async function readRepositories(organization,token,request=fetch){
 const repositories=[]
 for(let page=1;page<=100;page++){
  const response=await request(`https://api.github.com/orgs/${encodeURIComponent(organization)}/repos?per_page=100&type=public&sort=full_name&page=${page}`,{
   headers:{accept:'application/vnd.github+json','user-agent':`${organization}-landing-build`,...(token?{authorization:`Bearer ${token}`}:{})},
   signal:AbortSignal.timeout(20000),
  })
  if(!response.ok)throw new Error(`GitHub API returned ${response.status} ${response.statusText}`)
  const items=await response.json()
  if(!Array.isArray(items))throw new Error('GitHub did not return a repository list')
  for(const item of items){
   if(!Number.isSafeInteger(item.id)||item.id<=0||!Number.isFinite(Date.parse(item.created_at)))throw new Error('GitHub returned an invalid repository identity or creation date')
   if(repositories.some(previous=>previous.id===item.id))throw new Error('GitHub pagination repeated a repository ID; retry a complete snapshot')
   repositories.push(item)
  }
  if(items.length<100)return repositories.filter(r=>r.private===false&&r.owner?.login?.toLowerCase()===organization.toLowerCase()&&!r.archived&&!r.fork&&r.name!==`${organization}.github.io`).map(r=>({
   repoId:r.id,createdAt:r.created_at,
   name:r.name,description:(r.description??'').trim(),topics:Array.isArray(r.topics)?r.topics.filter(t=>typeof t==='string'):[],homepage:(r.homepage??'').trim(),
  }))
 }
 throw new Error('GitHub pagination exceeded the supported bound')
}
