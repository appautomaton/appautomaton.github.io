import { useState } from 'react'
import { TextInput, EmptyState, Button, Text } from '@astryxdesign/core'
import { catalog, unitCount } from '../data/catalog'
import { Shelf } from './Shelf'

export function Workbench() {
  const [query, setQuery] = useState('')
  const q = query.trim().toLowerCase()

  const shelves = catalog.map((shelf) => ({
    ...shelf,
    items: q
      ? shelf.items.filter((p) =>
          `${p.repo} ${p.description}`.toLowerCase().includes(q),
        )
      : shelf.items,
  }))
  const shown = shelves.reduce((n, s) => n + s.items.length, 0)

  return (
    <main
      id="catalog"
      style={{ maxWidth: 1040, margin: '0 auto', padding: '0 1.5rem 3rem' }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '1rem',
          flexWrap: 'wrap',
          margin: '0 0 2.2rem',
        }}
      >
        <TextInput
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
      </div>

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
