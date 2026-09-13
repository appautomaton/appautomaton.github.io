# Project publication ownership and handoff

The homepage and all sixteen project websites are centrally published by
`appautomaton/appautomaton.github.io`. Their existing public URLs are unchanged.
No registered project website retains an external publisher.

## Publication states

- `external`: preview module only; the project repository owns delivery.
- `staged`: the central production artifact contains the module while the
  original publisher remains active. Valid only during `publisher-handoff`.
- `central`: this repository publishes the module. Its old publisher has been
  retired and the public route verified.

The build validates every included module and records its files in
`release-manifest.json`. Included project modules also receive
`.well-known/publisher.json` with their source repository and revision. A failed
candidate preserves the previous complete outputs.

## Verified hosting behavior

An isolated noindex test on September 11, 2026 confirmed that an active project
publisher takes precedence over the same directory in the organization artifact,
including nested paths. Missing project files return 404 rather than falling
back to the organization directory. Removing the project Pages configuration
allows the organization directory to serve the original path. Recreating the
workflow configuration and republishing restored the project markers.
Slashless paths redirected to the slash form throughout.

Cached responses, including pre-transfer 404s, can persist briefly. Confirm the
ordinary URL after propagation; a query string alone did not reliably bypass
negative caching. Retain the old publisher's source until delivery is verified.

The same sequence transferred Pi Arcweld, MLX Speech, Setloom, agent-designer,
Automaton, Document Skills, Presentation, Markmaton, Docker for Apple Container,
MLX Spatial, MLX H3, MLX CV, MiniMax Music 3, TNT ASR, LaTeX arXiv Skill, and
MLX Atomistic. Their ordinary source markers identify this repository, and their
website files matched the central artifact. Setloom's nine files also matched
over the ordinary route after cutover. Its former Pages configuration, website
workflow, and website-only source were retired after verification. The temporary
routing fixture and its workflow input were removed afterward. The other transfers
preserved technical documentation and runtime code in their owning repositories.

Docker for Apple Container's deployed version stamp is maintained in this
repository at `sites/docker-for-apple-container/public/`. After a validated
runtime release, update its JSON-LD version, footer date, and sitemap `lastmod`
together. The Docker site test checks that those fields stay in sync.

MLX Atomistic's 263-file initial snapshot includes its generated technical
documentation and Pagefind search assets. Its project repository retains the
canonical documentation, docstrings, generator scripts, and Astro inputs;
only its project Pages workflow is retired. A new validated build is submitted
as a complete snapshot to the central module. See
[the refresh guide](../sites/mlx-atomistic/README.md).

## Transfer another project

1. Preserve its Pages settings, publishing workflow, source revision, and last
   successful artifact. Import the deployed website without changing its design.
2. Set the registry phase to `publisher-handoff`, mark the module `staged`, and
   deploy the complete validated artifact. Keep the old publisher active.
3. Inspect the actual Pages artifact for every project file and its source marker.
4. Disable the old website workflow and remove only that project's Pages
   configuration. Verify its original page, assets, canonical, sitemap, slash
   redirect, missing-page behavior, and ordinary publisher marker.
5. If verification fails, recreate the saved Pages configuration, enable the
   original workflow, and republish its retained source. Do not transfer another
   project until the first is resolved.
6. After verification succeeds, mark the module `central`, set its publisher to
   this repository, and retire the old website-only source and workflow. Retain
   technical documentation and runtime code in their owning project repository.
7. Return to `modular-production` and update the ownership documentation.

Before cleanup, the original website remains on its published project branch.
After cleanup, first restore the website files and workflow, if one exists, from
the saved pre-cleanup revision while leaving Pages disabled. Then return the
central registry entry to `external` with the project repository as
`currentPublisher`, and publish the central artifact without that module. Restore
the exact saved Pages settings, including branch and path, and enable the
original workflow if present. Verify the project publisher on the ordinary route
before considering rollback complete. Never activate an empty publisher.
Ordinary central releases retain the last successful Pages artifact and source
revision for restoration.

GitHub documents inherited project domains in its [custom-domain guidance](https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site/about-custom-domains-and-github-pages).
