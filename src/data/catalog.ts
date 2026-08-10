/** The domain this site is served from. Project repos in the same org
    publish their GitHub Pages under it, one directory per repo, so a
    project's page address is derived rather than written by hand. */
export const ORIGIN = 'https://appautomaton.renocrypt.com'
const GITHUB_ORG = 'https://github.com/appautomaton'

export type Project = {
  repo: string
  description: string
  /** The project's own page on this domain. Absent when the repo has no site. */
  site?: string
  /** The GitHub repository. Every project has one. */
  source: string
  /** Two short, factual chips lifted from the description. */
  chips: string[]
  /** Stable catalog plate, stamped from shelf letter + position: "A-01". */
  tag: string
  /** Bento width on the 12-column desktop grid. */
  span: number
}

export type ShelfData = {
  key: string
  letter: string
  label: string
  blurb: string
  items: Project[]
}

type RawProject = {
  repo: string
  description: string
  chips: string[]
  /** Set when the repo publishes a GitHub Pages site under this domain.
      Leaving it off means the card links to the repository only. */
  site?: true
}

function shelf(
  key: string,
  letter: string,
  label: string,
  blurb: string,
  spans: number[],
  items: RawProject[],
): ShelfData {
  return {
    key,
    letter,
    label,
    blurb,
    items: items.map((p, i) => ({
      repo: p.repo,
      description: p.description,
      chips: p.chips,
      site: p.site ? `${ORIGIN}/${p.repo}/` : undefined,
      source: `${GITHUB_ORG}/${p.repo}`,
      tag: `${letter}-${String(i + 1).padStart(2, '0')}`,
      span: spans[i] ?? 4,
    })),
  }
}

export const catalog: ShelfData[] = [
  shelf(
    'skills',
    'A',
    'SKILLs',
    'Portable SKILL.md packs with three layers of disclosure. The same folder runs unchanged under Claude Code, Codex, Gemini, and OpenCode.',
    [7, 5, 3, 3, 3, 3],
    [
      {
        repo: 'agent-designer',
        description:
          'The skills workspace. Issue-driven workflows, an MCP tool catalog, and bridge skills for agent-to-agent delegation with session continuity.',
        chips: ['MCP', 'multi-agent'],
        site: true,
      },
      {
        repo: 'document-SKILLs',
        description:
          'docx, xlsx, pptx, and pdf. Extraction, forms, formulas, and tracked changes. Runs on uv with PEP 723, no virtualenv.',
        chips: ['uv', 'PEP 723'],
        site: true,
      },
      {
        repo: 'presentation',
        description:
          'Consulting-quality decks, from strategy storyboarding to pixel-perfect PDF or editable PPTX.',
        chips: ['PDF', 'PPTX'],
        site: true,
      },
      {
        repo: 'webmaton',
        description:
          'Grounded web research. Citations, deterministic HTML-to-Markdown, and persistent sessions over Playwright, nodriver, and Chrome DevTools.',
        chips: ['Playwright', 'CDP'],
      },
      {
        repo: 'playwright-skill',
        description:
          'Browser automation that also runs on Android via a Termux launcher patch and headless Chromium.',
        chips: ['Android', 'Termux'],
      },
      {
        repo: 'latex-arxiv-SKILL',
        description:
          'Turns a topic into an arXiv-ready ML review paper. Gated literature discovery, every citation verified, compiled to a two-column IEEEtran PDF.',
        chips: ['arXiv', 'IEEEtran'],
        site: true,
      },
    ],
  ),
  shelf(
    'harnesses',
    'B',
    'Harnesses & runtimes',
    'Stage gates, orchestration, and plumbing. The tooling that keeps an agent honest from plan to verify.',
    [5, 7, 4, 4, 4, 4],
    [
      {
        repo: 'automaton',
        description:
          'A stage-gated harness. Frame, plan, review, execute, verify, resume. Installs as plain markdown.',
        chips: ['stage gates', 'markdown'],
        site: true,
      },
      {
        repo: 'automux',
        description:
          'Multi-agent orchestration in tmux or kitty, coordinating through files across parallel git worktrees.',
        chips: ['tmux', 'worktrees'],
      },
      {
        repo: 'openclaw-monorepo',
        description:
          'A repo-local OpenClaw workspace with JSON5 config, plugins, and Docker sandboxes.',
        chips: ['JSON5', 'Docker'],
      },
      {
        repo: 'markmaton',
        description:
          'HTML to Markdown for agent pipelines. A Go parser core wrapped in a Python CLI and API, on PyPI.',
        chips: ['Go', 'PyPI'],
        site: true,
      },
      {
        repo: 'docker-for-apple-container',
        description:
          'A stateless docker shim over Apple’s native container CLI on macOS, with no Docker Desktop.',
        chips: ['macOS', 'container CLI'],
        site: true,
      },
      {
        repo: 'pi-arcweld',
        description:
          'A curated local layer welded to pinned upstream Pi. Extensions, system guidance, and MCP tooling join along one auditable seam, over a reproducible runtime.',
        chips: ['MCP', 'pinned upstream'],
        site: true,
      },
    ],
  ),
  shelf(
    'mlx',
    'C',
    'On-device MLX',
    'Pure MLX on the Apple GPU. Speech, vision, video, 3D, and atomistic simulation that never leave the machine.',
    [8, 4, 4, 4, 4, 4, 12],
    [
      {
        repo: 'mlx-speech',
        description:
          'Speech synthesis, voice cloning, dialogue, sound effects, and recognition, MLX-native on the Apple GPU.',
        chips: ['TTS', 'ASR'],
        site: true,
      },
      {
        repo: 'tnt-asr',
        description:
          'A terminal voice-to-text TUI. Qwen3-ASR transcribes in about a second, fully local.',
        chips: ['Qwen3-ASR', 'TUI'],
        site: true,
      },
      {
        repo: 'ltx-video-mlx',
        description:
          'Text- and image-to-video with synchronized audio on LTX-2.3 22B. On-device LoRA fine-tuning.',
        chips: ['LTX-2.3 22B', 'LoRA'],
      },
      {
        repo: 'mlx-cv',
        description:
          'Open-vocabulary grounding, detection, depth and camera geometry, segmentation, and video tracking in pure MLX. Every model is checked against its upstream reference before it ships.',
        chips: ['SAM 3', 'boxes + masks + depth'],
        site: true,
      },
      {
        repo: 'mlx-spatial',
        description:
          '3D and spatial inference on device with SAM 3D Objects, TRELLIS.2, WorldMirror, and MapAnything.',
        chips: ['TRELLIS.2', '3D'],
        site: true,
      },
      {
        repo: 'mlx-atomistic',
        description:
          'Atomistic simulation on Apple silicon. A DFT and molecular-dynamics runtime on MLX and Metal, running on the GPU the Mac already has.',
        chips: ['DFT + MD', 'Metal'],
        site: true,
      },
      {
        repo: 'mlx-h3',
        description:
          'MiniMax-H3 text to video and stereo audio, denoised together in one packed sequence. Phase-scoped model residency, no PyTorch at runtime.',
        chips: ['MiniMax-H3', 'video + audio'],
        site: true,
      },
    ],
  ),
  shelf(
    'creative',
    'D',
    'Creative harnesses',
    'The same stage-gated method, pointed at club music.',
    [12],
    [
      {
        repo: 'setloom',
        description:
          'Producer-first co-production for club music. Musical intent into editable tracks, stems, renders, and listening notes, with the human keeping the taste gate.',
        chips: ['club music', 'stems'],
        site: true,
      },
    ],
  ),
]

export const unitCount = catalog.reduce((n, s) => n + s.items.length, 0)
export const shelfCount = catalog.length
