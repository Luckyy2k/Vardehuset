import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabase'
import { voiceGroups } from '../../data/members'
import ImageField from './ImageField'

const order = ['Dirigent', '1T', '2T', '1B', '2B']
const inputClass =
  'mt-1 w-full rounded-lg border border-primary/15 px-3 py-2 text-sm outline-none focus:border-accent focus:ring-2 focus:ring-accent/20'

const blank = { name: '', voice: '1T', img: '', role: '' }

export default function MembersAdmin() {
  const [rows, setRows] = useState([])
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState(null) // id, 'new', or null
  const [form, setForm] = useState(blank)
  const [error, setError] = useState('')
  const [version, setVersion] = useState(0)

  const reload = () => setVersion((v) => v + 1)

  useEffect(() => {
    let active = true
    ;(async () => {
      const { data } = await supabase.from('members').select('*').order('id')
      if (!active) return
      setRows(data || [])
      setLoading(false)
    })()
    return () => {
      active = false
    }
  }, [version])

  function startNew() {
    setForm(blank)
    setEditing('new')
    setError('')
  }

  function startEdit(row) {
    setForm({
      name: row.name ?? '',
      voice: row.voice ?? '1T',
      img: row.img ?? '',
      role: row.role ?? '',
    })
    setEditing(row.id)
    setError('')
  }

  async function save(e) {
    e.preventDefault()
    setError('')
    const payload = { name: form.name, voice: form.voice, img: form.img, role: form.role || null }
    const res =
      editing === 'new'
        ? await supabase.from('members').insert(payload)
        : await supabase.from('members').update(payload).eq('id', editing)
    if (res.error) {
      setError(res.error.message)
      return
    }
    setEditing(null)
    reload()
  }

  async function remove(id) {
    if (!window.confirm('Slette dette medlemmet?')) return
    await supabase.from('members').delete().eq('id', id)
    reload()
  }

  const groups = order
    .map((voice) => ({
      voice,
      label: voiceGroups[voice] ?? voice,
      list: rows.filter((m) => m.voice === voice),
    }))
    .filter((g) => g.list.length > 0)

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-2xl">Medlemmer</h2>
        <button
          onClick={startNew}
          className="rounded-full bg-accent px-5 py-2 text-sm font-medium text-white hover:bg-accent-light"
        >
          + Legg til medlem
        </button>
      </div>

      {editing !== null && (
        <form
          onSubmit={save}
          className="mb-8 grid gap-4 rounded-2xl border border-accent/30 bg-white p-6 sm:grid-cols-2"
        >
          <label className="block text-sm sm:col-span-2">
            <span className="font-medium text-primary">Bilde</span>
            <ImageField
              value={form.img}
              onChange={(url) => setForm((s) => ({ ...s, img: url }))}
              folder="medlemmer"
              shape="round"
            />
          </label>
          <label className="block text-sm">
            <span className="font-medium text-primary">Navn</span>
            <input
              value={form.name}
              onChange={(e) => setForm((s) => ({ ...s, name: e.target.value }))}
              className={inputClass}
              required
            />
          </label>
          <label className="block text-sm">
            <span className="font-medium text-primary">Stemmegruppe</span>
            <select
              value={form.voice}
              onChange={(e) => setForm((s) => ({ ...s, voice: e.target.value }))}
              className={inputClass}
            >
              {order.map((v) => (
                <option key={v} value={v}>
                  {voiceGroups[v]}
                </option>
              ))}
            </select>
          </label>
          <label className="block text-sm sm:col-span-2">
            <span className="font-medium text-primary">Rolle / tittel</span>
            <input
              value={form.role}
              onChange={(e) => setForm((s) => ({ ...s, role: e.target.value }))}
              className={inputClass}
              placeholder="F.eks. Formann, Æresmedlem (skill flere med komma)"
            />
          </label>
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
        <div className="space-y-10">
          {groups.map((group) => (
            <div key={group.voice}>
              <div className="mb-4 flex items-center gap-4">
                <h3 className="text-lg text-primary">{group.label}</h3>
                <span className="h-px flex-1 bg-primary/10" />
                <span className="text-sm text-ink-light">{group.list.length}</span>
              </div>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {group.list.map((m) => (
                  <div
                    key={m.id}
                    className="flex items-center gap-3 rounded-xl border border-primary/10 bg-white p-3"
                  >
                    <div className="h-12 w-12 shrink-0 overflow-hidden rounded-full bg-primary/5">
                      {m.img && (
                        <img src={m.img} alt={m.name} className="h-full w-full object-cover" />
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium text-primary">{m.name}</p>
                      {m.role && (
                        <p className="truncate text-xs text-accent">{m.role}</p>
                      )}
                    </div>
                    <button
                      onClick={() => startEdit(m)}
                      className="rounded-full border border-primary/20 px-3 py-1 text-xs text-primary hover:bg-warm"
                    >
                      Rediger
                    </button>
                    <button
                      onClick={() => remove(m.id)}
                      className="rounded-full px-2 py-1 text-xs text-red-600 hover:bg-red-50"
                      aria-label="Slett"
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            </div>
          ))}
          {groups.length === 0 && <p className="text-ink-light">Ingen medlemmer ennå.</p>}
        </div>
      )}
    </div>
  )
}
