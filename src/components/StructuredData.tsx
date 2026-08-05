import { catalog } from '../data/catalog'

/** JSON-LD built from the same catalog the page renders, so structured data
    can never drift from the visible content. The prerender step bakes this
    into the static HTML for crawlers that skip JavaScript. */
const graph = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'WebSite',
      '@id': 'https://appautomaton.renocrypt.com/#website',
      url: 'https://appautomaton.renocrypt.com/',
      name: 'App Automaton',
      description:
        'An open-source workshop for engineering with coding agents. Portable SKILLs, stage-gated harnesses, and pure-MLX work for Apple silicon.',
      publisher: { '@id': 'https://appautomaton.renocrypt.com/#org' },
    },
    {
      '@type': 'Organization',
      '@id': 'https://appautomaton.renocrypt.com/#org',
      name: 'App Automaton',
      url: 'https://appautomaton.renocrypt.com/',
      logo: 'https://appautomaton.renocrypt.com/apple-touch-icon.png',
      parentOrganization: { '@type': 'Organization', name: 'AppCubic', url: 'https://appcubic.com' },
      sameAs: ['https://github.com/appautomaton'],
    },
    {
      '@type': 'ItemList',
      '@id': 'https://appautomaton.renocrypt.com/#catalog',
      name: 'The App Automaton catalog',
      numberOfItems: catalog.reduce((n, s) => n + s.items.length, 0),
      itemListElement: catalog.flatMap((s) =>
        s.items.map((p) => ({
          '@type': 'SoftwareSourceCode',
          name: p.repo,
          description: p.description,
          url: p.href,
          codeRepository: p.href.startsWith('https://github.com/')
            ? p.href
            : `https://github.com/appautomaton/${p.repo}`,
        })),
      ),
    },
  ],
}

export function StructuredData() {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(graph) }}
    />
  )
}
