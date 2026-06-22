import { useEffect, useMemo, useState } from 'react'
import { supabase } from '../../lib/supabase'

const FILTERS = [
  { key: 'new', label: 'Ikke håndtert' },
  { key: 'waitlist', label: 'Venteliste' },
  { key: 'approved', label: 'Godkjent' },
  { key: 'all', label: 'Alle' },
]

// Kategori for filter/visning:
//  - approved: godkjent
//  - waitlist: ikke håndtert, men ønsket dato er allerede opptatt
//  - new: ikke håndtert, dato ledig eller ikke satt
function categoryOf(r, bookedSet) {
  if ((r.status || 'new') === 'approved') return 'approved'
  if (r.event_date && bookedSet.has(r.event_date)) return 'waitlist'
  return 'new'
}

// Forhåndsutfylt svarmelding til kunden. Telefonnummeret må fylles inn manuelt.
function defaultMessage(r) {
  const fornavn = String(r.name || '').split(/[ /]/)[0]
  const type = r.event_type ? String(r.event_type).toLowerCase() : 'arrangementet'
  const dato = r.event_date ? ` ${r.event_date}` : ''
  return `Hei ${fornavn}! Takk for forespørselen til Vardehuset angående ${type}${dato}. Datoen er ledig og vi ønsker dere velkommen. Ta kontakt på tlf XXXXXXXX for videre avtale. Mvh Vardehuset`
}

// Antall SMS-segmenter: æ/ø/å gjør meldingen til unicode (70 tegn, ellers 160).
// Ved oppdeling går 7 tegn bort per del til sammenkoblingen → 153 / 63 per del.
function smsInfo(text) {
  const len = text.length
  const unicode = [...text].some((c) => c.charCodeAt(0) > 127)
  const single = unicode ? 70 : 160
  let segments
  if (len === 0) segments = 0
  else if (len <= single) segments = 1
  else segments = Math.ceil(len / (unicode ? 63 : 153))
  return { len, unicode, segments }
}

const CATEGORY_BADGE = {
  approved: { label: 'Godkjent', cls: 'bg-emerald-50 text-emerald-700' },
  waitlist: { label: 'Venteliste – dato opptatt', cls: 'bg-red-50 text-red-600' },
  new: { label: 'Ikke håndtert', cls: 'bg-amber-50 text-amber-700' },
}

function StatusBadge({ category }) {
  const b = CATEGORY_BADGE[category] ?? CATEGORY_BADGE.new
  return (
    <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${b.cls}`}>
      {b.label}
    </span>
  )
}

export default function InquiriesAdmin() {
  const [rows, setRows] = useState([])
  const [bookedSet, setBookedSet] = useState(new Set())
  const [loading, setLoading] = useState(true)
  const [version, setVersion] = useState(0)
  const [filter, setFilter] = useState('new')
  const [query, setQuery] = useState('')

  // Godkjenning / melding
  const [approving, setApproving] = useState(null) // forespørsel-rad eller null
  const [message, setMessage] = useState('')
  const [sending, setSending] = useState(false)
  const [error, setError] = useState('')

  const reload = () => setVersion((v) => v + 1)

  useEffect(() => {
    let active = true
    ;(async () => {
      const [inq, bd] = await Promise.all([
        supabase.from('inquiries').select('*').order('created_at', { ascending: false }),
        supabase.from('booked_dates').select('date'),
      ])
      if (!active) return
      setRows(inq.data || [])
      setBookedSet(new Set((bd.data || []).map((b) => b.date)))
      setLoading(false)
    })()
    return () => {
      active = false
    }
  }, [version])

  const counts = useMemo(() => {
    const c = { new: 0, waitlist: 0, approved: 0, all: rows.length }
    for (const r of rows) c[categoryOf(r, bookedSet)]++
    return c
  }, [rows, bookedSet])

  const q = query.trim().toLowerCase()
  const visible = rows.filter((r) => {
    if (filter !== 'all' && categoryOf(r, bookedSet) !== filter) return false
    if (!q) return true
    const haystack = [r.name, r.email, r.phone, r.event_type, r.event_date, r.message]
      .filter(Boolean)
      .join(' ')
      .toLowerCase()
    return haystack.includes(q)
  })

  async function remove(id) {
    if (!window.confirm('Slette denne forespørselen?')) return
    await supabase.from('inquiries').delete().eq('id', id)
    reload()
  }

  // Marker en dato som opptatt, lenket til henvendelsen. Rører ikke en dato
  // som allerede er booket (manuelt eller av en annen henvendelse).
  async function bookDate(date, inquiryId) {
    if (!date) return
    await supabase.from('booked_dates').upsert(
      { date, status: 'opptatt', inquiry_id: inquiryId },
      { onConflict: 'date', ignoreDuplicates: true },
    )
  }

  // Frigjør en dato kun hvis den ble booket av nettopp denne henvendelsen.
  async function freeDateIfOwned(date, inquiryId) {
    if (!date) return
    await supabase
      .from('booked_dates')
      .delete()
      .eq('date', date)
      .eq('inquiry_id', inquiryId)
  }

  // Godkjenn: sett status og marker datoen som opptatt med en gang.
  async function approveInquiry(row) {
    await supabase.from('inquiries').update({ status: 'approved' }).eq('id', row.id)
    await bookDate(row.event_date, row.id)
    reload()
  }

  // Angre godkjenning: sett tilbake til ikke håndtert og frigjør datoen.
  async function revertApproval(row) {
    await supabase.from('inquiries').update({ status: 'new' }).eq('id', row.id)
    await freeDateIfOwned(row.event_date, row.id)
    reload()
  }

  // Endre ønsket dato (tom = ukjent/ikke satt). For godkjente flyttes bookingen.
  async function updateDate(id, value) {
    const row = rows.find((r) => r.id === id)
    const event_date = value || null
    setRows((rs) => rs.map((r) => (r.id === id ? { ...r, event_date } : r)))
    await supabase.from('inquiries').update({ event_date }).eq('id', id)
    if (row && (row.status || 'new') === 'approved') {
      await freeDateIfOwned(row.event_date, id) // gammel dato
      await bookDate(event_date, id) // ny dato
      reload()
    }
  }

  function openApprove(r) {
    setApproving(r)
    setMessage(defaultMessage(r))
    setError('')
  }

  async function sendApproval() {
    if (!approving) return
    setError('')
    setSending(true)

    const { data, error: fnError } = await supabase.functions.invoke('send-sms', {
      body: { phone: approving.phone, text: message },
    })

    if (fnError || data?.error) {
      // Funksjonen returnerer en tydelig feilmelding (inkl. Front errorcode).
      setError(data?.error || fnError?.message || 'Kunne ikke sende SMS.')
      setSending(false)
      return
    }

    // Bruk nyeste rad (datoen kan ha blitt endret i kortet).
    const row = rows.find((r) => r.id === approving.id) || approving
    await approveInquiry(row)
    setSending(false)
    setApproving(null)
  }

  const info = smsInfo(message)

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <h2 className="text-2xl">Forespørsler</h2>
        <div className="flex gap-2">
          {FILTERS.map((f) => (
            <button
              key={f.key}
              onClick={() => setFilter(f.key)}
              className={`rounded-full px-4 py-1.5 text-sm transition ${
                filter === f.key
                  ? 'bg-accent text-white'
                  : 'border border-primary/15 text-ink-light hover:bg-warm'
              }`}
            >
              {f.label} ({counts[f.key]})
            </button>
          ))}
        </div>
      </div>

      <div className="mb-6">
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Søk i navn, e-post, telefon, melding…"
          className="w-full rounded-lg border border-primary/15 px-4 py-2.5 text-sm outline-none focus:border-accent focus:ring-2 focus:ring-accent/20"
        />
      </div>

      {loading ? (
        <p className="text-ink-light">Laster…</p>
      ) : visible.length === 0 ? (
        <p className="text-ink-light">
          {q ? 'Ingen forespørsler matcher søket.' : 'Ingen forespørsler her.'}
        </p>
      ) : (
        <div className="space-y-4">
          {visible.map((r) => {
            const category = categoryOf(r, bookedSet)
            return (
            <div key={r.id} className="rounded-2xl border border-primary/10 bg-white p-6">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <div className="flex flex-wrap items-center gap-3">
                    <p className="text-lg font-medium text-primary">{r.name}</p>
                    <StatusBadge category={category} />
                  </div>
                  <p className="mt-1 text-sm text-accent">
                    {r.event_type}
                    {r.event_date ? ` · ${r.event_date}` : ''}
                    {r.guests ? ` · ${r.guests} gjester` : ''}
                  </p>
                </div>
                <div className="flex shrink-0 gap-2">
                  {r.status === 'approved' ? (
                    <button
                      onClick={() => revertApproval(r)}
                      className="rounded-full border border-primary/20 px-4 py-1.5 text-sm text-primary hover:bg-warm"
                    >
                      Angre godkjenning
                    </button>
                  ) : (
                    <button
                      onClick={() => openApprove(r)}
                      className="rounded-full bg-accent px-4 py-1.5 text-sm font-medium text-white hover:bg-accent-light"
                    >
                      Godkjenn
                    </button>
                  )}
                  <button
                    onClick={() => remove(r.id)}
                    className="rounded-full px-4 py-1.5 text-sm text-red-600 hover:bg-red-50"
                  >
                    Slett
                  </button>
                </div>
              </div>

              <div className="mt-3 flex flex-wrap gap-x-6 gap-y-1 text-sm text-ink-light">
                {r.email && (
                  <a href={`mailto:${r.email}`} className="hover:text-accent">
                    {r.email}
                  </a>
                )}
                {r.phone && (
                  <a href={`tel:${r.phone}`} className="hover:text-accent">
                    {r.phone}
                  </a>
                )}
              </div>
              {r.message && (
                <p className="mt-3 whitespace-pre-line text-sm text-ink">{r.message}</p>
              )}

              <label className="mt-3 flex flex-wrap items-center gap-2 text-sm">
                <span className="font-medium text-primary">Ønsket dato</span>
                <input
                  type="date"
                  value={r.event_date || ''}
                  onChange={(e) => updateDate(r.id, e.target.value)}
                  className="rounded-lg border border-primary/15 px-3 py-1.5 text-sm outline-none focus:border-accent focus:ring-2 focus:ring-accent/20"
                />
                {!r.event_date && <span className="text-ink-light">(ikke satt ennå)</span>}
              </label>

              {category === 'waitlist' && (
                <p className="mt-2 text-xs text-red-600">
                  Denne datoen er allerede opptatt. Forespørselen står på venteliste –
                  kontakt kunden hvis datoen blir ledig, eller avtal en annen dato.
                </p>
              )}

              {r.created_at && (
                <p className="mt-3 text-xs text-ink-light">
                  Mottatt {new Date(r.created_at).toLocaleString('no-NO')}
                </p>
              )}
            </div>
            )
          })}
        </div>
      )}

      {/* Godkjenn-popup med redigerbar melding */}
      {approving && (
        <div
          className="fixed inset-0 z-50 grid place-items-center bg-primary/40 p-4"
          onClick={() => !sending && setApproving(null)}
        >
          <div
            className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-xl text-primary">Godkjenn og send SMS</h3>
            <p className="mt-1 text-sm text-ink-light">
              Til {approving.name}
              {approving.phone ? ` · ${approving.phone}` : ''}
            </p>

            {approving.phone ? (
              <>
                <div className="mt-4 rounded-xl bg-amber-50 p-4 text-sm text-amber-800">
                  Meldingen sendes fra avsendernavnet <b>Vardehuset</b>. Kunden{' '}
                  <b>kan ikke svare</b> på denne SMS-en, og du kan ikke motta svar her.
                  Skriv derfor inn et <b>telefonnummer</b> i meldingen som kunden kan
                  kontakte dere på (erstatt «XXXXXXXX»).
                </div>

                <label className="mt-4 block text-sm">
                  <span className="font-medium text-primary">Melding</span>
                  <textarea
                    rows="6"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="mt-1 w-full rounded-lg border border-primary/15 px-3 py-2 text-sm outline-none focus:border-accent focus:ring-2 focus:ring-accent/20"
                  />
                </label>
                <p className="mt-1 text-xs text-ink-light">
                  {info.len} tegn · {info.segments} SMS
                  {info.unicode ? ' · inneholder spesialtegn (æ/ø/å)' : ''}
                </p>
                {info.segments > 1 && (
                  <p className="mt-0.5 text-xs text-ink-light">
                    Selv om meldingen er {info.segments} SMS, slås de sammen til én
                    melding hos mottakeren. Du faktureres for {info.segments} SMS.
                  </p>
                )}

                {error && <p className="mt-3 text-sm text-red-600">{error}</p>}

                <div className="mt-5 flex justify-end gap-3">
                  <button
                    onClick={() => setApproving(null)}
                    disabled={sending}
                    className="rounded-full border border-primary/20 px-5 py-2 text-sm text-primary hover:bg-warm disabled:opacity-50"
                  >
                    Avbryt
                  </button>
                  <button
                    onClick={sendApproval}
                    disabled={sending || info.len === 0}
                    className="rounded-full bg-accent px-5 py-2 text-sm font-medium text-white hover:bg-accent-light disabled:opacity-50"
                  >
                    {sending ? 'Sender…' : 'Send SMS og godkjenn'}
                  </button>
                </div>
              </>
            ) : (
              <>
                <div className="mt-4 rounded-xl bg-amber-50 p-4 text-sm text-amber-800">
                  Denne forespørselen har ikke telefonnummer, så det kan ikke sendes SMS.
                  Du kan likevel markere den som godkjent.
                </div>
                <div className="mt-5 flex justify-end gap-3">
                  <button
                    onClick={() => setApproving(null)}
                    className="rounded-full border border-primary/20 px-5 py-2 text-sm text-primary hover:bg-warm"
                  >
                    Avbryt
                  </button>
                  <button
                    onClick={async () => {
                      await approveInquiry(approving)
                      setApproving(null)
                    }}
                    className="rounded-full bg-accent px-5 py-2 text-sm font-medium text-white hover:bg-accent-light"
                  >
                    Marker som godkjent
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
