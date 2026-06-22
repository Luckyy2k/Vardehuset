const MONTHS = [
  'Januar', 'Februar', 'Mars', 'April', 'Mai', 'Juni',
  'Juli', 'August', 'September', 'Oktober', 'November', 'Desember',
]

// Nedtrekksmenyer for å velge måned og årstall i kalenderen.
// `view` = { year, month }, `onChange` får et nytt view-objekt.
export default function MonthYearSelect({ view, onChange, yearsBack = 1, yearsForward = 3 }) {
  const current = new Date().getFullYear()
  const lo = Math.min(current - yearsBack, view.year)
  const hi = Math.max(current + yearsForward, view.year)
  const years = []
  for (let y = lo; y <= hi; y++) years.push(y)

  const selectClass =
    'rounded-lg border border-primary/15 bg-white px-3 py-2 text-lg font-medium text-primary outline-none focus:border-accent focus:ring-2 focus:ring-accent/20'

  return (
    <div className="flex items-center gap-2">
      <select
        aria-label="Måned"
        value={view.month}
        onChange={(e) => onChange({ ...view, month: Number(e.target.value) })}
        className={selectClass}
      >
        {MONTHS.map((m, i) => (
          <option key={m} value={i}>
            {m}
          </option>
        ))}
      </select>
      <select
        aria-label="År"
        value={view.year}
        onChange={(e) => onChange({ ...view, year: Number(e.target.value) })}
        className={selectClass}
      >
        {years.map((y) => (
          <option key={y} value={y}>
            {y}
          </option>
        ))}
      </select>
    </div>
  )
}
