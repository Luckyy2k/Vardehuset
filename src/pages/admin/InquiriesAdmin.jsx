import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabase'

export default function InquiriesAdmin() {
  const [rows, setRows] = useState([])
  const [loading, setLoading] = useState(true)
  const [version, setVersion] = useState(0)

  useEffect(() => {
    let active = true
    ;(async () => {
      const { data } = await supabase
        .from('inquiries')
        .select('*')
        .order('created_at', { ascending: false })
      if (!active) return
      setRows(data || [])
      setLoading(false)
    })()
    return () => {
      active = false
    }
  }, [version])

  async function remove(id) {
    if (!window.confirm('Slette denne forespørselen?')) return
    await supabase.from('inquiries').delete().eq('id', id)
    setVersion((v) => v + 1)
  }

  return (
    <div>
      <h2 className="mb-6 text-2xl">Forespørsler</h2>
      {loading ? (
        <p className="text-ink-light">Laster…</p>
      ) : rows.length === 0 ? (
        <p className="text-ink-light">Ingen forespørsler ennå.</p>
      ) : (
        <div className="space-y-4">
          {rows.map((r) => (
            <div
              key={r.id}
              className="rounded-2xl border border-primary/10 bg-white p-6"
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="text-lg font-medium text-primary">{r.name}</p>
                  <p className="text-sm text-accent">
                    {r.event_type}
                    {r.event_date ? ` · ${r.event_date}` : ''}
                    {r.guests ? ` · ${r.guests} gjester` : ''}
                  </p>
                </div>
                <button
                  onClick={() => remove(r.id)}
                  className="rounded-full px-4 py-1.5 text-sm text-red-600 hover:bg-red-50"
                >
                  Slett
                </button>
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
              {r.created_at && (
                <p className="mt-3 text-xs text-ink-light">
                  Mottatt {new Date(r.created_at).toLocaleString('no-NO')}
                </p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
