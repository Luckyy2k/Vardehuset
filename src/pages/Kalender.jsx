import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import PageHero from '../components/PageHero'
import { useCollection } from '../lib/useCollection'
import { site } from '../data/site'

const MONTHS = [
  'januar', 'februar', 'mars', 'april', 'mai', 'juni',
  'juli', 'august', 'september', 'oktober', 'november', 'desember',
]
const WEEKDAYS = ['Man', 'Tir', 'Ons', 'Tor', 'Fre', 'Lør', 'Søn']

function iso(year, month, day) {
  const m = String(month + 1).padStart(2, '0')
  const d = String(day).padStart(2, '0')
  return `${year}-${m}-${d}`
}

export default function Kalender() {
  const navigate = useNavigate()
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const [view, setView] = useState({ year: today.getFullYear(), month: today.getMonth() })

  const { data: booked } = useCollection('booked_dates', [])
  const bookedSet = useMemo(
    () => new Set(booked.map((b) => b.date)),
    [booked],
  )

  const cells = useMemo(() => {
    const { year, month } = view
    const firstWeekday = (new Date(year, month, 1).getDay() + 6) % 7
    const daysInMonth = new Date(year, month + 1, 0).getDate()
    const list = []
    for (let i = 0; i < firstWeekday; i++) list.push(null)
    for (let d = 1; d <= daysInMonth; d++) list.push(d)
    return list
  }, [view])

  function changeMonth(delta) {
    setView((v) => {
      const m = v.month + delta
      return { year: v.year + Math.floor(m / 12), month: ((m % 12) + 12) % 12 }
    })
  }

  function onDayClick(day) {
    const dateStr = iso(view.year, view.month, day)
    const date = new Date(view.year, view.month, day)
    if (date < today) return
    navigate(`/foresporsel?dato=${dateStr}`)
  }

  return (
    <>
      <PageHero
        eyebrow="Tilgjengelighet"
        title="Kalender"
        intro="Klikk på en dato for å sende forespørsel. Grønne datoer er ledige – opptatte datoer kan du sette deg på venteliste for dersom noen avbestiller."
      />

      <section className="bg-white">
        <div className="container-page grid gap-12 py-20 lg:grid-cols-[1.6fr_1fr]">
          {/* Kalender */}
          <div>
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-2xl capitalize">
                {MONTHS[view.month]} {view.year}
              </h2>
              <div className="flex gap-2">
                <button
                  onClick={() => changeMonth(-1)}
                  className="grid h-10 w-10 place-items-center rounded-full border border-primary/15 text-primary transition hover:bg-warm"
                  aria-label="Forrige måned"
                >
                  ‹
                </button>
                <button
                  onClick={() => changeMonth(1)}
                  className="grid h-10 w-10 place-items-center rounded-full border border-primary/15 text-primary transition hover:bg-warm"
                  aria-label="Neste måned"
                >
                  ›
                </button>
              </div>
            </div>

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
                const date = new Date(view.year, view.month, day)
                const isPast = date < today
                const isBooked = bookedSet.has(dateStr)
                const isToday = date.getTime() === today.getTime()

                let cls = 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100 cursor-pointer'
                if (isPast) cls = 'bg-warm text-ink-light/40 cursor-default'
                else if (isBooked)
                  cls = 'bg-red-50 text-red-600 hover:bg-red-100 cursor-pointer'

                return (
                  <button
                    key={dateStr}
                    onClick={() => onDayClick(day)}
                    disabled={isPast}
                    className={`flex aspect-square flex-col items-center justify-center rounded-lg text-sm transition ${cls} ${
                      isToday ? 'ring-2 ring-accent' : ''
                    }`}
                  >
                    <span className="font-medium">{day}</span>
                    {!isPast && (
                      <span className="text-[10px]">
                        {isBooked ? 'Opptatt' : 'Ledig'}
                      </span>
                    )}
                  </button>
                )
              })}
            </div>

            <div className="mt-6 flex flex-wrap gap-5 text-sm text-ink-light">
              <span className="flex items-center gap-2">
                <span className="h-3 w-3 rounded bg-emerald-200" /> Ledig – klikk for å booke
              </span>
              <span className="flex items-center gap-2">
                <span className="h-3 w-3 rounded bg-red-200" /> Opptatt – klikk for venteliste
              </span>
            </div>
          </div>

          {/* Kontaktinfo */}
          <div className="rounded-2xl border border-primary/10 bg-warm p-7">
            <p className="eyebrow">Kontaktinformasjon</p>
            <h3 className="mt-3 text-xl">Ta kontakt for mer informasjon</h3>
            <dl className="mt-6 space-y-5 text-sm">
              <div>
                <dt className="font-medium text-primary">
                  {site.contacts[0].name}
                </dt>
                <dd>
                  <a
                    href={`tel:${site.contacts[0].phone.replace(/\s/g, '')}`}
                    className="text-ink-light hover:text-accent"
                  >
                    {site.contacts[0].phone}
                  </a>
                </dd>
              </div>
              <div>
                <dt className="font-medium text-primary">E-post</dt>
                <dd>
                  <a
                    href={`mailto:${site.calendarEmail}`}
                    className="text-ink-light hover:text-accent"
                  >
                    {site.calendarEmail}
                  </a>
                </dd>
              </div>
            </dl>
          </div>
        </div>
      </section>
    </>
  )
}
