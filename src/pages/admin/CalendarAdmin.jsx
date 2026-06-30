import { useEffect, useMemo, useState } from 'react'
import { supabase } from '../../lib/supabase'
import MonthYearSelect from '../../components/MonthYearSelect'

const WEEKDAYS = ['Man', 'Tir', 'Ons', 'Tor', 'Fre', 'Lør', 'Søn']
const inputClass =
  'mt-1 w-full rounded-lg border border-primary/15 px-3 py-2 text-sm outline-none focus:border-accent focus:ring-2 focus:ring-accent/20'

function iso(year, month, day) {
  return `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
}

function formatDate(dateStr) {
  return new Date(dateStr).toLocaleDateString('no-NO', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}

const firstName = (name) => String(name || '').split(/[ /]/)[0]

export default function CalendarAdmin() {
  const today = new Date()
  const [view, setView] = useState({ year: today.getFullYear(), month: today.getMonth() })
  const [booked, setBooked] = useState(new Map()) // date -> { id, inquiry_id, name, ... }
  const [busy, setBusy] = useState(false)
  const [version, setVersion] = useState(0)
  const [selected, setSelected] = useState(null) // opptatt dato som vises
  const [booking, setBooking] = useState(null) // { date, name, phone } for ny manuell booking

  useEffect(() => {
    let active = true
    ;(async () => {
      const { data } = await supabase
        .from('booked_dates')
        .select('id, date, name, phone, inquiry_id, inquiries(name, phone, email, event_type, guests)')
      if (!active) return
      const map = new Map(
        (data || []).map((r) => {
          const inq = r.inquiries || {}
          return [
            r.date,
            {
              id: r.id,
              inquiry_id: r.inquiry_id,
              name: r.name ?? inq.name ?? '',
              phone: r.phone ?? inq.phone ?? '',
              email: inq.email ?? '',
              event_type: inq.event_type ?? '',
              guests: inq.guests ?? null,
            },
          ]
        }),
      )
      setBooked(map)
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

  function onDayClick(day) {
    const dateStr = iso(view.year, view.month, day)
    const info = booked.get(dateStr)
    if (info) {
      // Opptatt: vis hvem som har datoen.
      setSelected({ date: dateStr, ...info })
    } else {
      // Ledig: åpne skjema for å markere opptatt med navn/telefon (valgfritt).
      setBooking({ date: dateStr, name: '', phone: '' })
    }
  }

  async function saveBooking() {
    setBusy(true)
    await supabase.from('booked_dates').insert({
      date: booking.date,
      status: 'opptatt',
      name: booking.name.trim() || null,
      phone: booking.phone.trim() || null,
    })
    setBooking(null)
    setVersion((v) => v + 1)
    setBusy(false)
  }

  async function freeDate(id) {
    setBusy(true)
    await supabase.from('booked_dates').delete().eq('id', id)
    setSelected(null)
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
        Klikk på en ledig dato for å sette den opptatt (du kan legge til navn og
        telefon). Klikk på en opptatt dato for å se hvem som har den.
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
          const info = booked.get(dateStr)
          const isBooked = Boolean(info)
          return (
            <button
              key={dateStr}
              disabled={busy}
              onClick={() => onDayClick(day)}
              title={info?.name || ''}
              className={`flex aspect-square flex-col items-center justify-center gap-0.5 rounded-lg px-1 text-sm transition disabled:opacity-50 ${
                isBooked
                  ? 'bg-red-50 text-red-600 hover:bg-red-100'
                  : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
              }`}
            >
              <span className="font-medium leading-none">{day}</span>
              {isBooked ? (
                <span className="w-full truncate text-center text-[10px] leading-tight">
                  {info.name ? firstName(info.name) : 'Opptatt'}
                </span>
              ) : (
                <span className="text-[10px] leading-none">Ledig</span>
              )}
            </button>
          )
        })}
      </div>

      {/* Skjema: marker ledig dato som opptatt med navn/telefon */}
      {booking && (
        <div
          className="fixed inset-0 z-50 grid place-items-center bg-primary/40 p-4"
          onClick={() => !busy && setBooking(null)}
        >
          <div
            className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <p className="text-xs uppercase tracking-wider text-accent">Marker som opptatt</p>
            <h3 className="mt-1 text-xl text-primary">{formatDate(booking.date)}</h3>

            <label className="mt-5 block text-sm">
              <span className="font-medium text-primary">Navn (valgfritt)</span>
              <input
                value={booking.name}
                onChange={(e) => setBooking((b) => ({ ...b, name: e.target.value }))}
                placeholder="Hvem har datoen?"
                className={inputClass}
              />
            </label>
            <label className="mt-4 block text-sm">
              <span className="font-medium text-primary">Telefon (valgfritt)</span>
              <input
                value={booking.phone}
                onChange={(e) => setBooking((b) => ({ ...b, phone: e.target.value }))}
                placeholder="Telefonnummer"
                className={inputClass}
              />
            </label>

            <div className="mt-6 flex justify-end gap-3">
              <button
                onClick={() => setBooking(null)}
                disabled={busy}
                className="rounded-full border border-primary/20 px-5 py-2 text-sm text-primary hover:bg-warm disabled:opacity-50"
              >
                Avbryt
              </button>
              <button
                onClick={saveBooking}
                disabled={busy}
                className="rounded-full bg-accent px-5 py-2 text-sm font-medium text-white hover:bg-accent-light disabled:opacity-50"
              >
                {busy ? 'Lagrer…' : 'Marker som opptatt'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Detalj-popup for opptatt dato */}
      {selected && (
        <div
          className="fixed inset-0 z-50 grid place-items-center bg-primary/40 p-4"
          onClick={() => !busy && setSelected(null)}
        >
          <div
            className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <p className="text-xs uppercase tracking-wider text-accent">Opptatt dato</p>
            <h3 className="mt-1 text-xl text-primary">{formatDate(selected.date)}</h3>

            {selected.name || selected.phone ? (
              <dl className="mt-5 space-y-3 text-sm">
                {selected.name && (
                  <div>
                    <dt className="text-ink-light">Navn</dt>
                    <dd className="text-primary">{selected.name}</dd>
                  </div>
                )}
                {selected.event_type && (
                  <div>
                    <dt className="text-ink-light">Arrangement</dt>
                    <dd className="text-primary">
                      {selected.event_type}
                      {selected.guests ? ` · ${selected.guests} gjester` : ''}
                    </dd>
                  </div>
                )}
                {selected.phone && (
                  <div>
                    <dt className="text-ink-light">Telefon</dt>
                    <dd>
                      <a href={`tel:${selected.phone}`} className="text-primary hover:text-accent">
                        {selected.phone}
                      </a>
                    </dd>
                  </div>
                )}
                {selected.email && (
                  <div>
                    <dt className="text-ink-light">E-post</dt>
                    <dd>
                      <a
                        href={`mailto:${selected.email}`}
                        className="break-all text-primary hover:text-accent"
                      >
                        {selected.email}
                      </a>
                    </dd>
                  </div>
                )}
              </dl>
            ) : (
              <p className="mt-5 text-sm text-ink-light">
                Datoen er satt opptatt manuelt – ingen navn er lagt til.
              </p>
            )}

            <div className="mt-6 flex flex-wrap justify-end gap-3">
              <button
                onClick={() => setSelected(null)}
                disabled={busy}
                className="rounded-full border border-primary/20 px-5 py-2 text-sm text-primary hover:bg-warm disabled:opacity-50"
              >
                Lukk
              </button>
              <button
                onClick={() => freeDate(selected.id)}
                disabled={busy}
                className="rounded-full px-5 py-2 text-sm font-medium text-red-600 hover:bg-red-50 disabled:opacity-50"
              >
                Frigjør dato
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
