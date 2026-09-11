# App Automaton websites

Independent websites, maintained in one frontend repository. Each site owns its
appearance and behavior; shared tools build, validate, preview, and publish the
files. Application and library code stays in its original project repository.

## Current pilot

| Module | Public path | Presentation |
| --- | --- | --- |
| [Home](sites/home/README.md) | `/` | Material gallery and project catalog |
| [MLX Speech](sites/mlx-speech/README.md) | `/mlx-speech/` | Animated audio studio |
| [Pi Arcweld](sites/pi-arcweld/README.md) | `/pi-arcweld/` | Typographic welding field guide |

The other 14 project websites retain their existing publishers. All 17 public
mounts and sitemap sources are listed in [the site registry](registry/sites.json).
No application runtime or model weights are included here.

## Develop and review

Use Node 24 or newer. No package installation is required.

```sh
npm run dev
# http://127.0.0.1:8748/
# http://127.0.0.1:8748/mlx-speech/
# http://127.0.0.1:8748/pi-arcweld/
```

The normal build uses checked-in catalog and sitemap inputs without network
access. After an edit, run `npm run build` and reload. The local server changes
only navigation anchors to the three imported sites; canonical and social
metadata retain their production URLs. Other project links still lead to their
live sites. Directory routes, byte ranges, and real missing-page responses work.
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
sites/home/                 Homepage source and existing Node build
sites/mlx-speech/public/    Independent static HTML, styles, scripts, and assets
sites/pi-arcweld/public/    Independent static HTML, styles, scripts, and assets
registry/sites.json        Mounts, build adapters, sitemap leaves, publishers
registry/baselines.json    Import revisions and deployed artifact hashes
tooling/                   Assembly, validation, refresh, and preview
dist/                      Complete three-site preview, generated
dist-production/           Homepage and central discovery only, generated
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

After this change is published, `https://appautomaton.com/sitemap-index.xml` can
be used as the common sitemap submission in the domain's Search Console property.
The local preview is not a production submission, and an index does not establish
that every listed page has been crawled or indexed. See [Google's sitemap-index
documentation](https://developers.google.com/search/docs/crawling-indexing/sitemaps/large-sitemaps).

`npm run sync` explicitly refreshes the GitHub catalog, checks sitemap sources,
flattens indexes, and updates the registry. New eligible websites enter as
external publishers; they do not silently acquire a local module. Failed refresh
or build validation prevents publication and leaves the previous complete
artifact available. Existing site removals or mount changes require review.

## Publication boundary

Pull requests build the aggregate preview and attach it as `website-preview`.
Main, scheduled, and manual runs refresh inputs, then upload `dist-production/`
to Pages. During this pilot that artifact contains the homepage and central
discovery files, with no project subdirectories. Existing project workflows
remain authoritative for their current routes.

Do not switch the Pages upload to `dist/` until the route handoff has been tested.
[Routing and rollback](docs/routing.md) records what is verified and the remaining
production test. Builds validate a complete candidate before replacing either
output directory. A failed project build cannot publish a partial site.

The root [MIT license](LICENSE) covers shared tooling. Imported site licenses and
asset provenance are retained in their modules.
