import { Text, Stack, Link } from '@astryxdesign/core'
import { unitCount, shelfCount } from '../data/catalog'

const WORDMARK = ['App', 'Automaton']

/** Each letter is stamped in on its own beat. Index runs across both words
    so the stagger reads as one continuous machine pass. */
function StampedWordmark() {
  let i = 0
  return (
    <>
      {WORDMARK.map((word, w) => (
        <span key={word}>
          {w > 0 && ' '}
          <span className="aa-hero-word">
            {word.split('').map((ch, j) => (
              <span
                key={j}
                className="aa-hero-letter"
                style={{ ['--aa-i' as string]: i++ }}
              >
                {ch}
              </span>
            ))}
          </span>
        </span>
      ))}
    </>
  )
}

export function Hero() {
  return (
    <header
      style={{
        position: 'relative',
        maxWidth: 1040,
        margin: '0 auto',
        padding: '5.5rem 1.5rem 4rem',
      }}
    >
      <span className="aa-reg aa-reg-tl" aria-hidden="true" />
      <span className="aa-reg aa-reg-tr" aria-hidden="true" />
      <span className="aa-reg aa-reg-bl" aria-hidden="true" />
      <span className="aa-reg aa-reg-br" aria-hidden="true" />

      <Stack gap={4}>
        <Text
          as="div"
          type="label"
          className="aa-hero-after"
          style={{
            fontFamily: 'var(--aa-font-mono)',
            textTransform: 'uppercase',
            letterSpacing: '0.14em',
            fontSize: '0.72rem',
            color: 'var(--color-text-secondary)',
          }}
        >
          An AppCubic workshop · {unitCount} units · {shelfCount} shelves
        </Text>

        <Text
          as="h1"
          type="display-1"
          style={{
            fontFamily: "'Sirin Stencil', sans-serif",
            fontSize: 'clamp(2.9rem, 7.5vw, 5.25rem)',
            color: 'var(--color-accent)',
            letterSpacing: '0.01em',
            lineHeight: 1.04,
          }}
        >
          <StampedWordmark />
        </Text>

        <div className="aa-hero-rule" aria-hidden="true" />

        <Text as="p" type="large" className="aa-hero-after">
          An open-source workshop for engineering with coding agents.
        </Text>

        <Text
          as="p"
          type="supporting"
          className="aa-hero-after-2"
          style={{ maxWidth: '54ch', fontSize: '0.98rem', lineHeight: 1.55 }}
        >
          Portable SKILLs, stage-gated harnesses, and pure-MLX work that runs
          on the laptop's own silicon. Built for Claude Code, Codex, Gemini,
          and OpenCode.
        </Text>

        <Link
          href="#catalog"
          className="aa-hero-after-2"
          style={{
            marginTop: '0.5rem',
            alignSelf: 'flex-start',
            fontFamily: 'var(--aa-font-mono)',
            fontSize: '0.85rem',
            textTransform: 'uppercase',
            letterSpacing: '0.08em',
            color: 'var(--aa-brass)',
          }}
        >
          ↓ Browse the shelves
        </Link>
      </Stack>
    </header>
  )
}
