import { useEffect, useMemo, useState } from 'react'
import { supabase } from '../../lib/supabase'
import MonthYearSelect from '../../components/MonthYearSelect'

const WEEKDAYS = ['Man', 'Tir', 'Ons', 'Tor', 'Fre', 'Lør', 'Søn']

function iso(year, month, day) {
  return `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
}

export default function CalendarAdmin() {
  const today = new Date()
  const [view, setView] = useState({ year: today.getFullYear(), month: today.getMonth() })
  const [booked, setBooked] = useState(new Map()) // date -> row id
  const [busy, setBusy] = useState(false)
  const [version, setVersion] = useState(0)

  useEffect(() => {
    let active = true
    ;(async () => {
      const { data } = await supabase.from('booked_dates').select('id, date')
      if (!active) return
      setBooked(new Map((data || []).map((r) => [r.date, r.id])))
    })()
    return () => {
      active = false
    }
  }, [version])

  const cells = useMemo(() => {
    const { year, month } = view
    const firstWeekday = (new Date(year, month, 1).getDay() + 6) % 7
    const days = new Date(year, month + 1, 0).getDate()
    const list = []
    for (let i = 0; i < firstWeekday; i++) list.push(null)
    for (let d = 1; d <= days; d++) list.push(d)
    return list
  }, [view])

  function changeMonth(delta) {
    setView((v) => {
      const m = v.month + delta
      return { year: v.year + Math.floor(m / 12), month: ((m % 12) + 12) % 12 }
    })
  }

  async function toggle(day) {
    const dateStr = iso(view.year, view.month, day)
    setBusy(true)
    if (booked.has(dateStr)) {
      await supabase.from('booked_dates').delete().eq('id', booked.get(dateStr))
    } else {
      await supabase.from('booked_dates').insert({ date: dateStr, status: 'opptatt' })
    }
    setVersion((v) => v + 1)
    setBusy(false)
  }

  return (
    <div>
      <div className="mb-2 flex items-center justify-between">
        <MonthYearSelect view={view} onChange={setView} />
        <div className="flex gap-2">
          <button
            onClick={() => changeMonth(-1)}
            className="grid h-10 w-10 place-items-center rounded-full border border-primary/15 hover:bg-warm"
          >
            ‹
          </button>
          <button
            onClick={() => changeMonth(1)}
            className="grid h-10 w-10 place-items-center rounded-full border border-primary/15 hover:bg-warm"
          >
            ›
          </button>
        </div>
      </div>
      <p className="mb-6 text-sm text-ink-light">
        Klikk på en dato for å veksle mellom ledig og opptatt.
      </p>

      <div className="grid grid-cols-7 gap-1.5 text-center text-xs font-semibold uppercase tracking-wider text-ink-light">
        {WEEKDAYS.map((w) => (
          <div key={w} className="py-2">
            {w}
          </div>
        ))}
      </div>
      <div className="mt-1.5 grid grid-cols-7 gap-1.5">
        {cells.map((day, i) => {
          if (day === null) return <div key={`e${i}`} />
          const dateStr = iso(view.year, view.month, day)
          const isBooked = booked.has(dateStr)
          return (
            <button
              key={dateStr}
              disabled={busy}
              onClick={() => toggle(day)}
              className={`flex aspect-square flex-col items-center justify-center rounded-lg text-sm transition disabled:opacity-50 ${
                isBooked
                  ? 'bg-red-50 text-red-600 hover:bg-red-100'
                  : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
              }`}
            >
              <span className="font-medium">{day}</span>
              <span className="text-[10px]">{isBooked ? 'Opptatt' : 'Ledig'}</span>
            </button>
          )
        })}
      </div>
    </div>
  )
}
