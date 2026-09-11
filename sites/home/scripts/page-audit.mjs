// Read static project metadata without executing page scripts.
export function auditProjectPage(url, html, headers) {
  const problems = []
  const warnings = []

  const canonical = html.match(/<link[^>]+rel=["']canonical["'][^>]*>/i)?.[0]
  const href = canonical?.match(/href=["']([^"']+)["']/i)?.[1]
  if (!href) problems.push('missing canonical')
  else if (href !== url) problems.push(`canonical points at ${href}, not ${url}`)

  const directives=[headers.get('x-robots-tag')||'']
  for(const tag of html.match(/<meta\b[^>]*>/gi)||[]) {
    const agent=tag.match(/\bname\s*=\s*["']([^"']+)["']/i)?.[1]?.toLowerCase()
    if(['robots','googlebot','bingbot'].includes(agent))directives.push(tag.match(/\bcontent\s*=\s*["']([^"']*)["']/i)?.[1]||'')
  }
  if(directives.some(value=>/\b(?:noindex|none)\b/i.test(value)))problems.push('page forbids indexing')

  if (!/<title[^>]*>\s*\S/i.test(html)) warnings.push('no title')
  if (!/<meta[^>]+name=["']description["']/i.test(html)) warnings.push('no meta description')
  if (/content=["']https:\/\/appautomaton\.github\.io/i.test(html))
    warnings.push('an og tag names the github.io address, which redirects here')

  const strays = (html.match(/href=["']https:\/\/appautomaton\.github\.io/gi) ?? []).length
  if (strays) warnings.push(`${strays} link(s) to the github.io address, which redirects here`)

  /* The trailing slash is optional because a URL with an empty path and one
     with "/" are the same address, and a page that writes it either way is
     linking here. Requiring the slash reported a page as unlinked when it was
     not, which is the expensive direction for a check like this to be wrong. */
  if (!/href=["']https:\/\/appautomaton\.com\/?["']/i.test(html))
    warnings.push('no link back to the catalog')

  return {problems,warnings}
}

