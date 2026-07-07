/** The App Automaton cube-face mark, the same geometry as the org avatar
    and favicon. In-page it renders through design tokens, so the frame is
    verdigris and the core is brass, and both follow day/night. The animated
    variant draws the frame, drops the core in, then lets it idle with a
    slow breath. */
export function Logo({
  size = 24,
  animated = false,
}: {
  size?: number
  animated?: boolean
}) {
  return (
    <svg
      viewBox="0 0 32 32"
      width={size}
      height={size}
      aria-hidden="true"
      className={animated ? 'aa-logo aa-logo-animated' : 'aa-logo'}
    >
      <rect
        className="aa-logo-frame"
        x="8"
        y="8"
        width="16"
        height="16"
        rx="2.5"
        fill="none"
        stroke="var(--color-accent)"
        strokeWidth="1.8"
        strokeLinejoin="round"
        pathLength={1}
      />
      <circle
        className="aa-logo-core"
        cx="16"
        cy="16"
        r="3.6"
        fill="var(--aa-brass)"
      />
    </svg>
  )
}
