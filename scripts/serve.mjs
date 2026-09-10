import {createServer} from 'node:http'
import {readFile} from 'node:fs/promises'
import {resolve,extname} from 'node:path'
const root=resolve('dist')
const noScripts=process.argv.includes('--no-js')
const port=noScripts?4175:4174
const types={'.html':'text/html; charset=utf-8','.css':'text/css','.js':'text/javascript','.svg':'image/svg+xml','.woff2':'font/woff2','.json':'application/json','.xml':'application/xml','.txt':'text/plain','.png':'image/png','.webp':'image/webp'}
createServer(async(req,res)=>{
 try{
  const url=new URL(req.url,'http://localhost')
  const path=resolve(root,'.'+decodeURIComponent(url.pathname==='/'?'/index.html':url.pathname))
  if(!path.startsWith(root+'/')){res.writeHead(403).end();return}
  const file=await readFile(path)
  res.writeHead(200,{'Content-Type':types[extname(path)]||'application/octet-stream','Cache-Control':'no-store',...(noScripts?{'Content-Security-Policy':"script-src 'none'"}:{})}).end(file)
 }catch{res.writeHead(404).end('Not found')}
}).listen(port,'127.0.0.1',()=>console.log(`Preview: http://127.0.0.1:${port}/${noScripts?' (JavaScript disabled)':''}`))
