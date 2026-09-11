/* Only definitive absence may remove a known page from the catalog. */
export async function serves(url, method = 'HEAD', request = fetch) {
  const response = await request(url, {
    method,
    redirect: 'manual',
    signal: AbortSignal.timeout(15000),
  })
  if (response.status === 200) return response
  if (response.status === 404 || response.status === 410) return null
  const location = response.headers.get('location')
  throw new Error(`${url} returned HTTP ${response.status}${location ? ` to ${location}` : ''}`)
}
