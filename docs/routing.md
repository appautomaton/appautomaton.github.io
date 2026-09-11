# Project publication ownership and handoff

The homepage, Pi Arcweld, and MLX Speech are centrally published by
`appautomaton/appautomaton.github.io`. Their existing public URLs are unchanged.
Fourteen project websites retain external publishers.

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

The same sequence transferred Pi Arcweld and MLX Speech. Their ordinary source
markers identified this repository, and their original website files matched
the staged artifact. Media was compared in the artifact without playback.
The temporary routing fixture and its workflow input were removed afterward.

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

Before the cleanup merge, rollback uses the original source still on project
main. After cleanup, restore the saved website and workflow from Git history
before enabling that project publisher. Do not enable an empty publisher.
Ordinary central releases retain the last successful Pages artifact and source
revision for restoration.

GitHub documents inherited project domains in its [custom-domain guidance](https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site/about-custom-domains-and-github-pages).
