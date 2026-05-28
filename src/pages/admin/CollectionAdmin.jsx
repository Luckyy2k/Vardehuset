import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabase'

const inputClass =
  'mt-1 w-full rounded-lg border border-primary/15 px-3 py-2 text-sm outline-none focus:border-accent focus:ring-2 focus:ring-accent/20'

function blank(fields) {
  return Object.fromEntries(fields.map((f) => [f.key, '']))
}

export default function CollectionAdmin({ table, title, fields, orderBy = 'id' }) {
  const [rows, setRows] = useState([])
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState(null) // row id, 'new', or null
  const [form, setForm] = useState(blank(fields))
  const [error, setError] = useState('')
  const [version, setVersion] = useState(0)

  const reload = () => setVersion((v) => v + 1)

  useEffect(() => {
    let active = true
    ;(async () => {
      const { data } = await supabase.from(table).select('*').order(orderBy)
      if (!active) return
      setRows(data || [])
      setLoading(false)
    })()
    return () => {
      active = false
    }
  }, [table, orderBy, version])

  function startNew() {
    setForm(blank(fields))
    setEditing('new')
    setError('')
  }

  function startEdit(row) {
    setForm({ ...blank(fields), ...row })
    setEditing(row.id)
    setError('')
  }

  async function save(e) {
    e.preventDefault()
    setError('')
    const payload = {}
    for (const f of fields) {
      let v = form[f.key]
      if (f.type === 'number') v = v === '' ? null : Number(v)
      payload[f.key] = v
    }

    let res
    if (editing === 'new') {
      res = await supabase.from(table).insert(payload)
    } else {
      res = await supabase.from(table).update(payload).eq('id', editing)
    }
    if (res.error) {
      setError(res.error.message)
      return
    }
    setEditing(null)
    reload()
  }

  async function remove(id) {
    if (!window.confirm('Slette denne raden?')) return
    await supabase.from(table).delete().eq('id', id)
    reload()
  }

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-2xl">{title}</h2>
        <button
          onClick={startNew}
          className="rounded-full bg-accent px-5 py-2 text-sm font-medium text-white hover:bg-accent-light"
        >
          + Legg til
        </button>
      </div>

      {editing !== null && (
        <form
          onSubmit={save}
          className="mb-8 grid gap-4 rounded-2xl border border-accent/30 bg-white p-6 sm:grid-cols-2"
        >
          {fields.map((f) => (
            <label
              key={f.key}
              className={`block text-sm ${f.type === 'textarea' ? 'sm:col-span-2' : ''}`}
            >
              <span className="font-medium text-primary">{f.label}</span>
              {f.type === 'textarea' ? (
                <textarea
                  rows="3"
                  value={form[f.key] ?? ''}
                  onChange={(e) => setForm((s) => ({ ...s, [f.key]: e.target.value }))}
                  className={inputClass}
                />
              ) : f.type === 'select' ? (
                <select
                  value={form[f.key] ?? ''}
                  onChange={(e) => setForm((s) => ({ ...s, [f.key]: e.target.value }))}
                  className={inputClass}
                >
                  <option value="">Velg…</option>
                  {f.options.map((o) => (
                    <option key={o} value={o}>
                      {o}
                    </option>
                  ))}
                </select>
              ) : (
                <input
                  type={f.type || 'text'}
                  value={form[f.key] ?? ''}
                  onChange={(e) => setForm((s) => ({ ...s, [f.key]: e.target.value }))}
                  className={inputClass}
                />
              )}
            </label>
          ))}
          {error && <p className="text-sm text-red-600 sm:col-span-2">{error}</p>}
          <div className="flex gap-3 sm:col-span-2">
            <button
              type="submit"
              className="rounded-full bg-accent px-5 py-2 text-sm font-medium text-white hover:bg-accent-light"
            >
              Lagre
            </button>
            <button
              type="button"
              onClick={() => setEditing(null)}
              className="rounded-full border border-primary/20 px-5 py-2 text-sm text-primary hover:bg-warm"
            >
              Avbryt
            </button>
          </div>
        </form>
      )}

      {loading ? (
        <p className="text-ink-light">Laster…</p>
      ) : (
        <div className="space-y-2">
          {rows.map((row) => (
            <div
              key={row.id}
              className="flex items-center justify-between gap-4 rounded-xl border border-primary/10 bg-white px-5 py-3"
            >
              <div className="min-w-0">
                <p className="truncate font-medium text-primary">
                  {row[fields[0].key]}
                </p>
                <p className="truncate text-sm text-ink-light">
                  {fields.slice(1, 3).map((f) => row[f.key]).filter(Boolean).join(' · ')}
                </p>
              </div>
              <div className="flex shrink-0 gap-2">
                <button
                  onClick={() => startEdit(row)}
                  className="rounded-full border border-primary/20 px-4 py-1.5 text-sm text-primary hover:bg-warm"
                >
                  Rediger
                </button>
                <button
                  onClick={() => remove(row.id)}
                  className="rounded-full px-4 py-1.5 text-sm text-red-600 hover:bg-red-50"
                >
                  Slett
                </button>
              </div>
            </div>
          ))}
          {rows.length === 0 && <p className="text-ink-light">Ingen rader ennå.</p>}
        </div>
      )}
    </div>
  )
}
