import { useId } from 'react'

/** The mark in the theater's own colors: ink plate by day, limelight plate
    by night, patina core breathing like a held note. Same geometry as the
    org avatar — only the palette adapts. */
export function AdaptiveMark({ size = 20 }: { size?: number }) {
  return (
    <svg
      viewBox="0 0 32 32"
      width={size}
      height={size}
      aria-hidden="true"
      style={{ display: 'block', flexShrink: 0 }}
    >
      <rect width="32" height="32" rx="7" fill="var(--color-text-primary)" />
      <rect
        x="8"
        y="8"
        width="16"
        height="16"
        rx="2.5"
        fill="none"
        stroke="var(--color-background-body)"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
      <circle className="aa-mark-core" cx="16" cy="16" r="3.6" fill="var(--aa-patina)" />
    </svg>
  )
}

/** The App Automaton mark exactly as it appears on the org avatar and
    favicon: dark plate, off-white frame, gradient core. Its own colors are
    the identity, so this version never gets re-themed. */
export function BrandMark({ size = 20 }: { size?: number }) {
  const gradId = useId()
  return (
    <svg
      viewBox="0 0 32 32"
      width={size}
      height={size}
      aria-hidden="true"
      style={{ display: 'block', flexShrink: 0 }}
    >
      <defs>
        <linearGradient id={gradId} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#6ba6ff" />
          <stop offset="1" stopColor="#9d7cff" />
        </linearGradient>
      </defs>
      <rect width="32" height="32" rx="7" fill="#0a0b0f" />
      <rect
        x="8"
        y="8"
        width="16"
        height="16"
        rx="2.5"
        fill="none"
        stroke="#e8ebf4"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
      <circle cx="16" cy="16" r="3.6" fill={`url(#${gradId})`} />
    </svg>
  )
}

/** The mark as its own engineering drawing, five times full size: dashed
    centerlines first, then the plate and frame outlines draw themselves,
    the core is set in brass, and the dimensions are inked last. All
    hairline construction, so it reads as a drafting sheet, not an app
    icon. Colors ride the design tokens. */
export function MarkSchematic() {
  return (
    <svg
      viewBox="0 0 260 240"
      width="100%"
      aria-hidden="true"
      style={{ display: 'block', maxWidth: 300 }}
    >
      {/* construction centerlines */}
      <line className="aa-schem-center" x1="14" y1="110" x2="246" y2="110" />
      <line className="aa-schem-center" x1="130" y1="8" x2="130" y2="212" />

      {/* the plate: the favicon's outer square, 32 grid units at 5:1 */}
      <rect
        className="aa-schem-plate"
        x="50"
        y="30"
        width="160"
        height="160"
        rx="35"
        pathLength={1}
      />

      {/* the frame */}
      <rect
        className="aa-schem-frame"
        x="90"
        y="70"
        width="80"
        height="80"
        rx="12.5"
        pathLength={1}
      />

      {/* the core, set in brass */}
      <circle className="aa-schem-core" cx="130" cy="110" r="18" />

      {/* dimensions and callouts */}
      <g className="aa-schem-dim">
        <line x1="50" y1="205" x2="210" y2="205" />
        <line x1="50" y1="200" x2="50" y2="210" />
        <line x1="210" y1="200" x2="210" y2="210" />
        <text x="130" y="221" textAnchor="middle">
          32
        </text>
        <line x1="143" y1="97" x2="174" y2="66" />
        <text x="178" y="62">R 3.6</text>
        <text x="50" y="22">PLATE · R 7</text>
        <text x="210" y="180" textAnchor="end" />
      </g>
    </svg>
  )
}
