/* Text discovery files share the catalog used by the rendered page. */
export function renderLlms(catalog, origin) {
  return [
    '# App Automaton',
    '',
    '> The open-source workshop of AppCubic. Tools for coding agents and MLX work for Apple silicon.',
    '',
    'This index describes the same projects as the website. Each entry links to its project page when one is available, and to its source repository. See each project for installation instructions, source licenses, and model terms.',
    '',
    ...catalog.flatMap((shelf) => [
      `## ${shelf.label}`,
      '',
      shelf.blurb,
      '',
      ...shelf.items.map((project) =>
        `- [${project.repo}](${project.site ?? project.source}): ${project.description}` +
        (project.site ? ` [Source](${project.source}).` : ''),
      ),
      '',
    ]),
    '## Links',
    '',
    `- [Project catalog](${origin}/)`,
    '- [GitHub organization](https://github.com/appautomaton)',
    '- [Hugging Face](https://huggingface.co/appautomaton)',
    '- [AppCubic](https://www.appcubic.com/appautomaton/): the studio behind the workshop.',
    '- [RenoCrypt](https://www.renocrypt.com/): technical writing on machine learning, systems, and security.',
    `- [Sitemap](${origin}/sitemap.xml)`,
    '',
  ].join('\n')
}
