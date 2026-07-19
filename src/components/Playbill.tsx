import { catalog } from '../data/catalog'

const ROMANS = ['I', 'II', 'III', 'IV', 'V', 'VI']

/** The program: every shelf as an act, in one strip under the stage. */
export function Playbill() {
  return (
    <nav className="aa-playbill" aria-label="Shelves">
      {catalog.map((shelf, i) => (
        <a key={shelf.key} href={`#shelf-${shelf.key}`}>
          <span className="aa-roman">Act {ROMANS[i]}</span>
          <span className="aa-play-nm">{shelf.label}</span>
          <span className="aa-play-ct">
            {String(shelf.items.length).padStart(2, '0')}{' '}
            {shelf.items.length === 1 ? 'unit' : 'units'}
          </span>
        </a>
      ))}
    </nav>
  )
}
