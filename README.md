# App Automaton websites

Independent websites, maintained in one frontend repository. Each site owns its
appearance and behavior; shared tools build, validate, preview, and publish the
files. Application and library code stays in its original project repository.

## Published modules

| Module | Public path | Presentation |
| --- | --- | --- |
| [Home](sites/home/README.md) | `/` | Material gallery and project catalog |
| Agent Designer | `/agent-designer/` | Agent design guide |
| Automaton | `/automaton/` | Portable stage-gated agent harness |
| Document Skills | `/document-SKILLs/` | DOCX, PDF, PPTX, and XLSX skills |
| [MLX Speech](sites/mlx-speech/README.md) | `/mlx-speech/` | Animated audio studio |
| [Pi Arcweld](sites/pi-arcweld/README.md) | `/pi-arcweld/` | Typographic welding field guide |
| [Setloom](sites/setloom/README.md) | `/setloom/` | Woven-thread music production site |

These seven modules are published by this repository. The other ten project
websites retain external publishers. All 17 public mounts and sitemap sources
are listed in [the site registry](registry/sites.json).
No application runtime or model weights are included here.

## Develop and review

Use Node 24 or newer. No package installation is required.

```sh
npm run dev
# http://127.0.0.1:8748/
# http://127.0.0.1:8748/agent-designer/
# http://127.0.0.1:8748/automaton/
# http://127.0.0.1:8748/document-SKILLs/
# http://127.0.0.1:8748/docker-for-apple-container/
# http://127.0.0.1:8748/markmaton/
# http://127.0.0.1:8748/presentation/
# http://127.0.0.1:8748/mlx-speech/
# http://127.0.0.1:8748/pi-arcweld/
# http://127.0.0.1:8748/setloom/
```

The normal build uses checked-in catalog and sitemap inputs without network
access. After an edit, run `npm run build` and reload. The local server routes
imported project links into the preview while canonical and social metadata
retain their production URLs. Other project links still lead to their live
sites. Directory routes, byte ranges, and real missing-page responses work.
Local responses carry an indexing prohibition. `node tooling/serve.mjs --no-js`
also disables scripts through a response policy.

```sh
npm test
npm run lint
npm run build
npm run check
npm run check:baseline
```

The baseline check compares module output against file hashes from successful
deployment artifacts. It verifies an equivalent import; later intentional
design work can legitimately differ from that historical reference. It does
not play media or run inference. The homepage checkpoint includes the catalog
and presentation registry actually used by the selected deployment.

## Structure and ownership

```text
sites/home/                  Homepage source and existing Node build
sites/agent-designer/public/  Independent static HTML, styles, scripts, and assets
sites/automaton/public/       Independent static HTML, styles, and assets
sites/document-SKILLs/public/ Independent static HTML and sitemap
sites/docker-for-apple-container/public/ Static HTML, styles, scripts, and assets
sites/markmaton/public/       Independent static HTML, styles, scripts, and assets
sites/mlx-speech/public/      Independent static HTML, styles, scripts, and assets
sites/pi-arcweld/public/     Independent static HTML, styles, scripts, and assets
sites/presentation/public/   Static presentation-skills landing page
sites/setloom/public/        Woven-thread music production site
registry/sites.json        Mounts, build adapters, sitemap leaves, publishers
registry/baselines.json    Import revisions and deployed artifact hashes
tooling/                   Assembly, validation, refresh, and preview
dist/                       Preview of registered site modules, generated
dist-production/           Registered production modules and discovery, generated
```

There is no shared browser application or global project stylesheet. Follow
each site's design document before changing its presentation. Static modules
do not need a framework or a package manifest. The homepage retains its own
build and discovery regression checks.

## One sitemap entry point

The build generates `/sitemap-index.xml` from the registry, with 17 leaf sitemap
URLs. The root `/robots.txt` points to that index. Existing sitemap addresses,
canonical URLs, and project routes remain valid. The MLX Atomistic sitemap
index is expanded to its leaf sitemap so the root index does not nest indexes.

The published `https://appautomaton.com/sitemap-index.xml` can
be used as the common sitemap submission in the domain's Search Console property.
The local preview is not a production submission, and an index does not establish
that every listed page has been crawled or indexed. See [Google's sitemap-index
documentation](https://developers.google.com/search/docs/crawling-indexing/sitemaps/large-sitemaps).

`npm run sync` explicitly refreshes the GitHub catalog, checks sitemap sources,
flattens indexes, and updates the registry. New eligible websites enter as
external publishers; they do not silently acquire a local module. Failed refresh
or build validation prevents publication and leaves the previous complete
artifact available. Existing site removals or mount changes require review.

## Publication ownership

Pull requests build the aggregate preview and attach it as `website-preview`.
Main, scheduled, and manual runs refresh inputs, then upload the complete
validated `dist-production/` artifact to Pages. The homepage, Agent Designer,
Automaton, Document Skills, MLX Speech, Pi Arcweld, and Setloom are centrally
published. Their original public paths remain unchanged. The latest three
transfers passed artifact and route checks before their former Pages settings
were removed. Cleanup PRs remove only website-specific source; setup, runtime,
and technical documentation remain in the owning repositories. Setloom's
former Pages configuration, website workflow, and website-only source have
already been retired. Edit centrally published site modules here; keep
application and library code in their project repositories.

The site registry distinguishes `external`, `staged`, and `central` modules.
External modules enter preview only. During an explicit handoff, staging puts a
complete module in the central artifact before its old publisher is retired.
[Routing and rollback](docs/routing.md) records the verified transfer sequence.
A failed build preserves the previous complete output and cannot publish a
partial site.

`release-manifest.json` records the source revision, actual published modules,
and file hashes. Each centrally included project also exposes
`/<project>/.well-known/publisher.json`, identifying its frontend source.

The root [MIT license](LICENSE) covers shared tooling. Imported site licenses and
asset provenance are retained in their modules.
