import { useEffect, useRef, useState } from 'react'
import { HStack, TextInput, Button, Text, Kbd, Stack } from '@astryxdesign/core'
import { catalog, unitCount } from '../data/catalog'
import { Shelf } from './Shelf'
import { IntermissionPlate } from './Plates'
import duck from '../plates/duck.webp'

export function Workbench() {
  const [query, setQuery] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)
  const q = query.trim().toLowerCase()

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== '/' || e.metaKey || e.ctrlKey || e.altKey) return
      const t = e.target as HTMLElement
      if (t.tagName === 'INPUT' || t.tagName === 'TEXTAREA' || t.isContentEditable) return
      e.preventDefault()
      inputRef.current?.focus()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  const shelves = catalog.map((shelf) => ({
    ...shelf,
    index: catalog.indexOf(shelf),
    items: q
      ? shelf.items.filter((p) =>
          `${p.repo} ${p.description} ${p.chips.join(' ')}`.toLowerCase().includes(q),
        )
      : shelf.items,
  }))
  const shown = shelves.reduce((n, s) => n + s.items.length, 0)
  const visible = shelves.filter((s) => s.items.length > 0)

  return (
    <main
      id="catalog"
      style={{ maxWidth: 1120, margin: '0 auto', padding: '3rem 1.5rem 3rem' }}
    >
      <HStack
        align="center"
        justify="between"
        gap={4}
        wrap="wrap"
        style={{ margin: '0 0 2.4rem' }}
      >
        <HStack align="center" gap={3}>
          <TextInput
            ref={inputRef}
            label="Filter the catalog"
            isLabelHidden
            placeholder="Filter by name or capability"
            value={query}
            onChange={(value) => setQuery(value)}
            startIcon="search"
            hasClear
            size="sm"
            width={300}
          />
          <div className="aa-kbd-hint">
            <Kbd keys="/" />
            <Text
              as="span"
              type="label"
              style={{
                fontFamily: 'var(--aa-font-mono)',
                fontSize: '0.66rem',
                letterSpacing: '0.08em',
                color: 'var(--color-text-secondary)',
              }}
            >
              to filter
            </Text>
          </div>
        </HStack>
        <Text
          as="div"
          type="label"
          style={{
            fontFamily: 'var(--aa-font-mono)',
            fontSize: '0.66rem',
            letterSpacing: '0.12em',
            textTransform: 'uppercase',
            color: 'var(--aa-patina)',
            fontVariantNumeric: 'tabular-nums',
          }}
        >
          {shown} / {unitCount} units
        </Text>
      </HStack>

      {shown === 0 ? (
        /* The duck waits alone on its pedestal. */
        <Stack align="center" gap={4} style={{ padding: '2.5rem 0 3.5rem', textAlign: 'center' }}>
          <img
            className="aa-empty-duck aa-plate-img"
            src={duck}
            alt=""
            width={800}
            height={1062}
            style={{ height: 'auto' }}
          />
          <Text
            as="p"
            type="body"
            style={{
              fontFamily: "'League Gothic', 'Arial Narrow', sans-serif",
              fontSize: '1.7rem',
              textTransform: 'uppercase',
              letterSpacing: '0.02em',
            }}
          >
            No units match
          </Text>
          <Text as="p" type="supporting" style={{ fontStyle: 'italic' }}>
            Nothing on any shelf matches that query.
          </Text>
          <Button
            label="Clear filter"
            size="sm"
            onClick={() => setQuery('')}
            style={{ borderRadius: 0 }}
          />
        </Stack>
      ) : (
        visible.map((s, i) => (
          <div key={s.key}>
            <Shelf shelf={s} index={s.index} />
            {/* The interlude plate plays once, after the first act. */}
            {q === '' && i === 0 && <IntermissionPlate />}
          </div>
        ))
      )}
    </main>
  )
}
