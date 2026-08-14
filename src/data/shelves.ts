/* The hand-written half of the catalog.

   Facts about each project — whether it exists, what it calls itself, whether
   it publishes a page and when that page was last built — are fetched by
   scripts/sync-catalog.mjs and land in org.generated.json. This file holds
   the decisions no API can make: which shelf a project belongs on, how wide
   its case sits, and the sentence that introduces it when the repository's
   own one-liner is not the one the catalog wants to say.

   Every repository in the org must appear here, either on a shelf or in
   notShown. The sync step refuses to build otherwise, which is the only
   reliable way to keep a project from shipping unlinked and unnoticed. */

export type Placement = {
  repo: string
  /** Replaces the repository's GitHub description. Omit to use theirs. */
  description?: string
  /** Two short, factual chips. Falls back to the first two GitHub topics. */
  chips?: [string, string]
  /** Bento width on the 12-column desktop grid. */
  span: number
}

export type Shelf = {
  key: string
  letter: string
  label: string
  blurb: string
  items: Placement[]
}

export const shelves: Shelf[] = [
  {
    key: 'skills',
    letter: 'A',
    label: 'SKILLs',
    blurb:
      'Portable SKILL.md packs with three layers of disclosure. The same folder runs unchanged under Claude Code, Codex, Gemini, and OpenCode.',
    items: [
      {
        repo: 'agent-designer',
        description:
          'The skills workspace. Issue-driven workflows, an MCP tool catalog, and bridge skills for agent-to-agent delegation with session continuity.',
        chips: ['MCP', 'multi-agent'],
        span: 7,
      },
      {
        repo: 'document-SKILLs',
        description:
          'docx, xlsx, pptx, and pdf. Extraction, forms, formulas, and tracked changes. Runs on uv with PEP 723, no virtualenv.',
        chips: ['uv', 'PEP 723'],
        span: 5,
      },
      {
        repo: 'presentation',
        description:
          'Consulting-quality decks, from strategy storyboarding to pixel-perfect PDF or editable PPTX.',
        chips: ['PDF', 'PPTX'],
        span: 3,
      },
      {
        repo: 'webmaton',
        description:
          'Grounded web research. Citations, deterministic HTML-to-Markdown, and persistent sessions over Playwright, nodriver, and Chrome DevTools.',
        chips: ['Playwright', 'CDP'],
        span: 3,
      },
      {
        repo: 'playwright-skill',
        description:
          'Browser automation that also runs on Android via a Termux launcher patch and headless Chromium.',
        chips: ['Android', 'Termux'],
        span: 3,
      },
      {
        repo: 'latex-arxiv-SKILL',
        description:
          'Turns a topic into an arXiv-ready ML review paper. Gated literature discovery, every citation verified, compiled to a two-column IEEEtran PDF.',
        chips: ['arXiv', 'IEEEtran'],
        span: 3,
      },
    ],
  },
  {
    key: 'harnesses',
    letter: 'B',
    label: 'Harnesses & runtimes',
    blurb:
      'Stage gates, orchestration, and plumbing. The tooling that keeps an agent honest from plan to verify.',
    items: [
      {
        repo: 'automaton',
        description:
          'A stage-gated harness. Frame, plan, review, execute, verify, resume. Installs as plain markdown.',
        chips: ['stage gates', 'markdown'],
        span: 5,
      },
      {
        repo: 'automux',
        description:
          'Multi-agent orchestration in tmux or kitty, coordinating through files across parallel git worktrees.',
        chips: ['tmux', 'worktrees'],
        span: 7,
      },
      {
        repo: 'openclaw-monorepo',
        description:
          'A repo-local OpenClaw workspace with JSON5 config, plugins, and Docker sandboxes.',
        chips: ['JSON5', 'Docker'],
        span: 4,
      },
      {
        repo: 'markmaton',
        description:
          'HTML to Markdown for agent pipelines. A Go parser core wrapped in a Python CLI and API, on PyPI.',
        chips: ['Go', 'PyPI'],
        span: 4,
      },
      {
        repo: 'docker-for-apple-container',
        description:
          'A stateless docker shim over Apple’s native container CLI on macOS, with no Docker Desktop.',
        chips: ['macOS', 'container CLI'],
        span: 4,
      },
      {
        repo: 'pi-arcweld',
        description:
          'A curated local layer welded to pinned upstream Pi. Extensions, system guidance, and MCP tooling join along one auditable seam, over a reproducible runtime.',
        chips: ['MCP', 'pinned upstream'],
        span: 4,
      },
    ],
  },
  {
    key: 'mlx',
    letter: 'C',
    label: 'On-device MLX',
    blurb:
      'Pure MLX on the Apple GPU. Speech, vision, video, 3D, and atomistic simulation that never leave the machine.',
    items: [
      {
        repo: 'mlx-speech',
        description:
          'Speech synthesis, voice cloning, dialogue, sound effects, and recognition, MLX-native on the Apple GPU.',
        chips: ['TTS', 'ASR'],
        span: 8,
      },
      {
        repo: 'tnt-asr',
        description:
          'A terminal voice-to-text TUI. Qwen3-ASR transcribes in about a second, fully local.',
        chips: ['Qwen3-ASR', 'TUI'],
        span: 4,
      },
      {
        repo: 'ltx-video-mlx',
        description:
          'Text- and image-to-video with synchronized audio on LTX-2.3 22B. On-device LoRA fine-tuning.',
        chips: ['LTX-2.3 22B', 'LoRA'],
        span: 4,
      },
      {
        repo: 'mlx-cv',
        description:
          'Open-vocabulary grounding, detection, depth and camera geometry, segmentation, and video tracking in pure MLX. Every model is checked against its upstream reference before it ships.',
        chips: ['SAM 3', 'boxes + masks + depth'],
        span: 4,
      },
      {
        repo: 'mlx-spatial',
        description:
          '3D and spatial inference on device with SAM 3D Objects, TRELLIS.2, WorldMirror, and MapAnything.',
        chips: ['TRELLIS.2', '3D'],
        span: 4,
      },
      {
        repo: 'mlx-atomistic',
        description:
          'Atomistic simulation on Apple silicon. A DFT and molecular-dynamics runtime on MLX and Metal, running on the GPU the Mac already has.',
        chips: ['DFT + MD', 'Metal'],
        span: 4,
      },
      {
        repo: 'mlx-minimax-music3',
        description:
          'MiniMax Music 3 in pure MLX. Lyrics and a structured caption to 44.1 kHz stereo, with phase-scoped model residency and no PyTorch at runtime.',
        chips: ['flow matching', '44.1 kHz'],
        span: 8,
      },
      {
        repo: 'mlx-h3',
        description:
          'MiniMax-H3 text to video and stereo audio, denoised together in one packed sequence. Phase-scoped model residency, no PyTorch at runtime.',
        chips: ['MiniMax-H3', 'video + audio'],
        span: 12,
      },
    ],
  },
  {
    key: 'creative',
    letter: 'D',
    label: 'Creative harnesses',
    blurb: 'The same stage-gated method, pointed at club music.',
    items: [
      {
        repo: 'setloom',
        description:
          'Producer-first co-production for club music. Musical intent into editable tracks, stems, renders, and listening notes, with the human keeping the taste gate.',
        chips: ['club music', 'stems'],
        span: 12,
      },
    ],
  },
]

/* Public repositories that belong to the org but not on the shelves. The
   reason is the point: an entry here is a decision someone made, which is
   what separates it from a project that was simply forgotten. */
export const notShown: Record<string, string> = {
  '.github': 'org profile, not a project',
  'homebrew-tap': 'a distribution channel for tools listed elsewhere',
  'code-cli-tunnel': 'an internal bootstrap script, outside the four shelves',
  'comfyui-monorepo': 'a vendored third-party workspace, not our engineering',
  'digital-human': 'an exploratory workspace, not released as a tool',
  userscripts: 'browser conveniences, unrelated to the agent work',
  'v0-chat-2api': 'a local proxy for a third-party product',
}
