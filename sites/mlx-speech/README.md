# MLX Speech website module

Public mount: `/mlx-speech/`. Static source: `public/`.

Imported from [appautomaton/mlx-speech at 85c7995d](https://github.com/appautomaton/mlx-speech/tree/85c7995daf026e9640e1f57f91bc8a404890e7db/site),
matching [the successful publication](https://github.com/appautomaton/mlx-speech/actions/runs/34557415473).
The initial 19 published files are byte-identical to that artifact. The source
`.nojekyll` remains here but is excluded by the adapter, matching the old uploader.

Use the root build and preview commands. Edit `public/index.html` and
`public/assets/` for website changes. The original notes in `public/README.md`
are part of the baseline; their project-relative commands refer to the original
library repository. Runtime code, examples, and model weights remain there.
The media source documentation is [available in the library repository](https://github.com/appautomaton/mlx-speech/blob/85c7995daf026e9640e1f57f91bc8a404890e7db/examples/audio/README.md).

See [the design boundary](DESIGN.md), imported [license](LICENSE), and font
licenses in `public/assets/fonts/`. The production route is now published by the frontend repository. Website
catalog assertions live in `tooling/model-catalog.test.mjs`; README and model-guide
checks stay with the library. Its old website copy and Pages workflow have been
retired.
