import {createServer} from 'node:http'
import {createReadStream} from 'node:fs'
import {readFile, realpath, stat} from 'node:fs/promises'
import {resolve, extname, join, sep} from 'node:path'
import {pathToFileURL} from 'node:url'
import {workspaceRoot} from './build.mjs'
import {readJSON, ownerFor, routeFile} from './sites.mjs'

const types = {'.html': 'text/html; charset=utf-8', '.css': 'text/css; charset=utf-8', '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8', '.xml': 'application/xml; charset=utf-8', '.txt': 'text/plain; charset=utf-8',
  '.md': 'text/plain; charset=utf-8', '.svg': 'image/svg+xml', '.woff2': 'font/woff2', '.png': 'image/png',
  '.webp': 'image/webp', '.jpg': 'image/jpeg', '.ico': 'image/x-icon', '.mp3': 'audio/mpeg', '.wav': 'audio/wav'}

export function localNavigation(html, registry) {
  return html.replace(/<a\b[^>]*>/gi, tag => tag.replace(/\bhref\s*=\s*(["'])([^"']*)\1/i, (attribute, quote, address) => {
    if (!address.startsWith(registry.origin + '/')) return attribute
    const url = new URL(address.replaceAll('&amp;', '&'))
    if (url.origin !== registry.origin || !ownerFor(registry, url.pathname)?.sourceDir) return attribute
    return `href=${quote}${(url.pathname + url.search + url.hash).replaceAll('&', '&amp;')}${quote}`
  }))
}

export function byteRange(value, size) {
  if (!value) return null
  const match = /^bytes=(\d*)-(\d*)$/.exec(value)
  if (!match || (!match[1] && !match[2]) || !size) return false
  const start = match[1] ? Number(match[1]) : Math.max(0, size - Number(match[2]))
  const end = match[1] && match[2] ? Math.min(Number(match[2]), size - 1) : size - 1
  if (!Number.isSafeInteger(start) || !Number.isSafeInteger(end) || start < 0 || start >= size || end < start) return false
  return {start, end}
}

export function createPreviewServer(root, registry, {noScripts = false} = {}) {
  return createServer(async (request, response) => {
    const headers = {'Cache-Control': 'no-store', 'X-Robots-Tag': 'noindex, nofollow',
      'X-Content-Type-Options': 'nosniff', ...(noScripts ? {'Content-Security-Policy': "script-src 'none'"} : {})}
    try {
      if (!['GET', 'HEAD'].includes(request.method)) {
        response.writeHead(405, {...headers, Allow: 'GET, HEAD'}).end()
        return
      }
      const url = new URL(request.url, 'http://127.0.0.1')
      const pathname = decodeURIComponent(url.pathname)
      if (pathname.includes('\0') || pathname.includes('\\')) {
        response.writeHead(400, headers).end('Invalid path')
        return
      }
      const mount = registry.sites.find(site => site.publicPath !== '/' && site.publicPath.slice(0, -1) === pathname)
      if (mount) {
        response.writeHead(308, {...headers, Location: mount.publicPath + url.search}).end()
        return
      }
      const owner = ownerFor(registry, pathname)
      if (owner && !owner.sourceDir) {
        response.writeHead(302, {...headers, Location: registry.origin + url.pathname + url.search}).end()
        return
      }
      const file = resolve(root, '.' + routeFile(pathname))
      if (!file.startsWith(resolve(root) + sep)) {
        response.writeHead(403, headers).end('Outside preview')
        return
      }
      const actual = await realpath(file)
      const actualRoot = await realpath(root)
      if (!actual.startsWith(actualRoot + sep)) {
        response.writeHead(403, headers).end('Outside preview')
        return
      }
      const info = await stat(file)
      if (!info.isFile()) throw Object.assign(new Error('Not found'), {code: 'ENOENT'})
      const type = types[extname(file)] || 'application/octet-stream'
      if (file.endsWith('.html')) {
        const content = Buffer.from(localNavigation(await readFile(file, 'utf8'), registry))
        response.writeHead(200, {...headers, 'Content-Type': type, 'Content-Length': content.length})
        response.end(request.method === 'HEAD' ? undefined : content)
        return
      }
      const range = byteRange(request.headers.range, info.size)
      if (range === false) {
        response.writeHead(416, {...headers, 'Content-Range': `bytes */${info.size}`}).end()
        return
      }
      response.writeHead(range ? 206 : 200, {...headers, 'Content-Type': type, 'Accept-Ranges': 'bytes',
        'Content-Length': range ? range.end - range.start + 1 : info.size,
        ...(range ? {'Content-Range': `bytes ${range.start}-${range.end}/${info.size}`} : {})})
      if (request.method === 'HEAD') response.end()
      else createReadStream(file, range || {}).on('error', () => response.destroy()).pipe(response)
    } catch (error) {
      if (error instanceof URIError) response.writeHead(400, headers).end('Invalid path')
      else if (error.code === 'ENOENT' || error.code === 'ENOTDIR') {
        const page = await readFile(join(root, '404.html')).catch(() => Buffer.from('Not found'))
        response.writeHead(404, {...headers, 'Content-Type': 'text/html; charset=utf-8'}).end(request.method === 'HEAD' ? undefined : page)
      } else {
        console.error(error)
        response.writeHead(500, headers).end('Preview error')
      }
    }
  })
}

if (process.argv[1] && pathToFileURL(resolve(process.argv[1])).href === import.meta.url) {
  const registry = await readJSON(join(workspaceRoot, 'registry/sites.json'))
  const port = Number(process.env.PORT || 8748)
  if (!Number.isInteger(port) || port < 1 || port > 65535) throw new Error('Invalid preview port')
  createPreviewServer(join(workspaceRoot, 'dist'), registry, {noScripts: process.argv.includes('--no-js')})
    .listen(port, '127.0.0.1', () => console.log(`Preview: http://127.0.0.1:${port}/ (three local sites; other projects remain live)`))
}
