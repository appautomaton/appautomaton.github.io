import { useEffect, useRef, useState } from 'react'
import { HStack, TextInput, EmptyState, Button, Text, Kbd } from '@astryxdesign/core'
import { catalog, unitCount } from '../data/catalog'
import { Shelf } from './Shelf'

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
    items: q
      ? shelf.items.filter((p) =>
          `${p.repo} ${p.description} ${p.chips.join(' ')}`.toLowerCase().includes(q),
        )
      : shelf.items,
  }))
  const shown = shelves.reduce((n, s) => n + s.items.length, 0)

  return (
    <main
      id="catalog"
      style={{ maxWidth: 1040, margin: '0 auto', padding: '0 1.5rem 3rem' }}
    >
      <HStack
        align="center"
        justify="between"
        gap={4}
        wrap="wrap"
        style={{ margin: '0 0 2.2rem' }}
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
                fontSize: '0.7rem',
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
            fontSize: '0.72rem',
            letterSpacing: '0.12em',
            textTransform: 'uppercase',
            color: 'var(--color-text-secondary)',
            fontVariantNumeric: 'tabular-nums',
          }}
        >
          {shown} / {unitCount} units
        </Text>
      </HStack>

      {shown === 0 ? (
        <EmptyState
          title="No units match"
          description="Nothing on any shelf matches that query."
          actions={
            <Button
              label="Clear filter"
              size="sm"
              onClick={() => setQuery('')}
              style={{ borderRadius: 0 }}
            />
          }
        />
      ) : (
        shelves
          .filter((s) => s.items.length > 0)
          .map((s) => <Shelf key={s.key} shelf={s} />)
      )}
    </main>
  )
}
