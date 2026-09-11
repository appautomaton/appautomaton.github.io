# Project publisher handoff

Current phase: `publisher-handoff`. The homepage is centrally published. Pi
Arcweld and MLX Speech are `staged`: their unchanged files are included in the
central artifact, while the original project publishers remain active.

## Publication states

- `external`: preview module only; the original project repository owns delivery.
- `staged`: the central production artifact contains the module, while the
  original publisher remains active. Only valid during the handoff phase.
- `central`: the module is published from this repository. The old publisher
  has been retired and the public route verified.

The production build validates every included module and records its files in
`release-manifest.json`. Included project modules also receive
`.well-known/publisher.json` with their source repository and revision. A failed
candidate preserves the previous complete outputs.

## Isolated routing test

A manual `Deploy to GitHub Pages` run can temporarily set `routing_probe=true`.
This adds unlisted, noindex markers at `/web-publisher-probe-20260911/` and a
nested path, with a distinct organization-only file. The next ordinary build
removes the test files. The temporary project repository has no About website,
so it does not enter the project catalog or sitemaps.

Verify the root markers before enabling the project publisher. Publish distinct
project markers, then record directory, nested, missing, and slashless responses.
Delete only the test project's Pages configuration and verify root delivery.
Recreate the same configuration and republish to prove rollback. Retire the
probe after the result is recorded outside the public repository.

## Observed routing behavior

The isolated test on September 11, 2026 confirmed that an active project
publisher takes precedence over the organization directory, including nested
paths. A file missing from the project returns 404 rather than falling back to
the organization directory. Removing the project Pages configuration allows the
organization directory to serve the original path; cached project responses can
persist briefly. Both ordinary and cache-busted requests then returned the root
markers. Recreating the workflow Pages configuration and republishing restored
the project markers. Slashless paths redirected to the slash form throughout.

This evidence supports staging complete project files before retiring the old
publisher. Verify both ordinary URLs and source-revision markers after each
handoff, allowing for the observed cache delay.

## Production sequence

1. Preserve project Pages configuration and successful release artifacts.
2. Prove routing and rollback through the isolated test above.
3. Mark the two imported modules `staged`, build, and deploy the complete candidate.
4. Confirm the candidate artifact contains every project file and publisher marker.
5. Disable the old publishing workflow, retire one project's Pages configuration,
   and verify its original URL, assets, canonical, sitemap, and publisher marker.
6. Repeat for the second project only after the first succeeds.
7. Mark both modules `central`, remove obsolete website publishing sources from
   their project repositories, and point contributors to the new site modules.

If delivery fails, recreate the saved Pages configuration, enable the original
workflow, and republish the retained source. Do not remove another publisher.

GitHub documents inherited project domains, but route precedence must be
measured in this hosting arrangement. [GitHub custom-domain documentation](https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site/about-custom-domains-and-github-pages).
