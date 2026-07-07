export type Project = {
  repo: string
  description: string
  href: string
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

type RawProject = Omit<Project, 'tag' | 'span'>

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
      ...p,
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
        href: 'https://appautomaton.github.io/agent-designer/',
        chips: ['MCP', 'multi-agent'],
      },
      {
        repo: 'document-SKILLs',
        description:
          'docx, xlsx, pptx, and pdf. Extraction, forms, formulas, and tracked changes. Runs on uv with PEP 723, no virtualenv.',
        href: 'https://github.com/appautomaton/document-SKILLs',
        chips: ['uv', 'PEP 723'],
      },
      {
        repo: 'presentation',
        description:
          'Consulting-quality decks, from strategy storyboarding to pixel-perfect PDF or editable PPTX.',
        href: 'https://github.com/appautomaton/presentation',
        chips: ['PDF', 'PPTX'],
      },
      {
        repo: 'webmaton',
        description:
          'Grounded web research. Citations, deterministic HTML-to-Markdown, and persistent sessions over Playwright, nodriver, and Chrome DevTools.',
        href: 'https://github.com/appautomaton/webmaton',
        chips: ['Playwright', 'CDP'],
      },
      {
        repo: 'playwright-skill',
        description:
          'Browser automation that also runs on Android via a Termux launcher patch and headless Chromium.',
        href: 'https://github.com/appautomaton/playwright-skill',
        chips: ['Android', 'Termux'],
      },
      {
        repo: 'latex-arxiv-SKILL',
        description:
          'Turns a topic into an arXiv-ready ML review paper. Gated literature discovery, every citation verified, compiled to a two-column IEEEtran PDF.',
        href: 'https://appautomaton.github.io/latex-arxiv-SKILL/',
        chips: ['arXiv', 'IEEEtran'],
      },
    ],
  ),
  shelf(
    'harnesses',
    'B',
    'Harnesses & runtimes',
    'Stage gates, orchestration, and plumbing. The tooling that keeps an agent honest from plan to verify.',
    [5, 7, 4, 4, 4],
    [
      {
        repo: 'automaton',
        description:
          'A stage-gated harness. Frame, plan, review, execute, verify, resume. Installs as plain markdown.',
        href: 'https://github.com/appautomaton/automaton',
        chips: ['stage gates', 'markdown'],
      },
      {
        repo: 'automux',
        description:
          'Multi-agent orchestration in tmux or kitty, coordinating through files across parallel git worktrees.',
        href: 'https://github.com/appautomaton/automux',
        chips: ['tmux', 'worktrees'],
      },
      {
        repo: 'openclaw-monorepo',
        description:
          'A repo-local OpenClaw workspace with JSON5 config, plugins, and Docker sandboxes.',
        href: 'https://github.com/appautomaton/openclaw-monorepo',
        chips: ['JSON5', 'Docker'],
      },
      {
        repo: 'markmaton',
        description:
          'HTML to Markdown for agent pipelines. A Go engine wrapped in a Python CLI and API, on PyPI.',
        href: 'https://github.com/appautomaton/markmaton',
        chips: ['Go', 'PyPI'],
      },
      {
        repo: 'docker-for-apple-container',
        description:
          'A stateless docker shim over Apple’s native container CLI on macOS, with no Docker Desktop.',
        href: 'https://appautomaton.github.io/docker-for-apple-container/',
        chips: ['macOS', 'container CLI'],
      },
    ],
  ),
  shelf(
    'mlx',
    'C',
    'On-device MLX',
    'Pure MLX on the Apple GPU. Speech, vision, video, and 3D that never leave the machine.',
    [8, 4, 4, 4, 4],
    [
      {
        repo: 'mlx-speech',
        description:
          'Speech synthesis, voice cloning, dialogue, sound effects, and recognition, MLX-native on the Apple GPU.',
        href: 'https://github.com/appautomaton/mlx-speech',
        chips: ['TTS', 'ASR'],
      },
      {
        repo: 'tnt-asr',
        description:
          'A terminal voice-to-text TUI. Qwen3-ASR transcribes in about a second, fully local.',
        href: 'https://github.com/appautomaton/tnt-asr',
        chips: ['Qwen3-ASR', 'TUI'],
      },
      {
        repo: 'ltx-video-mlx',
        description:
          'Text- and image-to-video with synchronized audio on LTX-2.3 22B. On-device LoRA fine-tuning.',
        href: 'https://github.com/appautomaton/ltx-video-mlx',
        chips: ['LTX-2.3 22B', 'LoRA'],
      },
      {
        repo: 'mlx-cv',
        description:
          'MLX-native computer vision. Detection, segmentation, and open-vocabulary grounding with SAM 3 and LocateAnything.',
        href: 'https://github.com/appautomaton/mlx-cv',
        chips: ['SAM 3', 'grounding'],
      },
      {
        repo: 'mlx-spatial',
        description:
          '3D and spatial inference on device with SAM 3D Objects, TRELLIS.2, WorldMirror, and MapAnything.',
        href: 'https://github.com/appautomaton/mlx-spatial',
        chips: ['TRELLIS.2', '3D'],
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
        href: 'https://github.com/appautomaton/setloom',
        chips: ['club music', 'stems'],
      },
    ],
  ),
]

export const unitCount = catalog.reduce((n, s) => n + s.items.length, 0)
export const shelfCount = catalog.length
