import { catalog } from '../data/catalog'

/** JSON-LD built from the same catalog the page renders, so structured data
    can never drift from the visible content. The prerender step bakes this
    into the static HTML for crawlers that skip JavaScript. */
const graph = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'WebSite',
      '@id': 'https://appautomaton.github.io/#website',
      url: 'https://appautomaton.github.io/',
      name: 'App Automaton',
      description:
        'An open-source workshop for engineering with coding agents. Portable SKILLs, stage-gated harnesses, and pure-MLX work for Apple silicon.',
      publisher: { '@id': 'https://appautomaton.github.io/#org' },
    },
    {
      '@type': 'Organization',
      '@id': 'https://appautomaton.github.io/#org',
      name: 'App Automaton',
      url: 'https://appautomaton.github.io/',
      logo: 'https://appautomaton.github.io/apple-touch-icon.png',
      parentOrganization: { '@type': 'Organization', name: 'AppCubic', url: 'https://appcubic.com' },
      sameAs: ['https://github.com/appautomaton'],
    },
    {
      '@type': 'ItemList',
      '@id': 'https://appautomaton.github.io/#catalog',
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
