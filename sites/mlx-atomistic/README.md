# MLX Atomistic website

The module publishes `public/` at `https://appautomaton.com/mlx-atomistic/`.
The initial import preserves all 263 files from the successful project
deployment at source revision `933f00fdda9139bd545f56fe032789c801854e46`.
Historical file hashes are recorded in `registry/baselines.json`.

Canonical technical documentation, package docstrings, generator scripts, and
Astro inputs remain in `appautomaton/mlx-atomistic`. Follow that repository's
[`site/README.md`](https://github.com/appautomaton/mlx-atomistic/blob/main/site/README.md)
to generate and validate updated output. Replace this module's complete `public/`
tree with the validated `site/dist/` output in a central PR. Always transfer the
Pagefind entry, metadata, index, and fragment files from the same build.

Run the central build and publication checks and document intentional differences
from the historical baseline. Keep the existing public mount, route set, and
sitemap contract unless the change explicitly updates them. Runtime commits do
not automatically refresh the published snapshot. This central repository is
the sole public publisher; do not re-enable project Pages.
