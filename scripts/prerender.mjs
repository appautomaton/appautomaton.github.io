/* Post-build prerender: serve dist/, render the page in headless Chromium,
   and write the fully rendered document back to dist/index.html.

   Crawlers that skip JavaScript then see the complete catalog as real HTML.
   In browsers, React's createRoot().render() simply replaces the prerendered
   tree with the identical live one, so nothing visibly changes. */

import { createServer } from 'node:http'
import { readFileSync, writeFileSync, existsSync } from 'node:fs'
import { join, extname, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import { chromium } from 'playwright'

const DIST = join(dirname(fileURLToPath(import.meta.url)), '..', 'dist')

const MIME = {
  '.html': 'text/html',
  '.js': 'text/javascript',
  '.css': 'text/css',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.ttf': 'font/ttf',
  '.txt': 'text/plain',
  '.xml': 'application/xml',
}

const server = createServer((req, res) => {
  const path = req.url === '/' ? '/index.html' : req.url.split('?')[0]
  const file = join(DIST, path)
  if (!existsSync(file)) {
    res.writeHead(404).end()
    return
  }
  res.writeHead(200, { 'content-type': MIME[extname(file)] ?? 'application/octet-stream' })
  res.end(readFileSync(file))
})

await new Promise((resolve) => server.listen(0, '127.0.0.1', resolve))
const { port } = server.address()

const browser = await chromium.launch()
const page = await browser.newPage()
const errors = []
page.on('pageerror', (e) => errors.push(String(e)))

await page.goto(`http://127.0.0.1:${port}/`, { waitUntil: 'networkidle' })
await page.waitForSelector('.aa-card', { timeout: 15000 })

const cards = await page.locator('.aa-card').count()
if (cards < 17) throw new Error(`expected 17 prerendered cards, got ${cards}`)
if (errors.length) throw new Error(`page errors during prerender: ${errors.join(' | ')}`)

const html = await page.content()
await browser.close()
server.close()

writeFileSync(join(DIST, 'index.html'), `<!doctype html>\n${html.replace(/^<!doctype html>/i, '').trimStart()}`)
console.log(`prerendered dist/index.html with ${cards} catalog cards`)
