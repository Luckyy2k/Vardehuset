import { useEffect, useMemo, useState } from 'react'
import { supabase } from '../../lib/supabase'
import { contentGroups, contentDefaults } from '../../data/content'

const inputClass =
  'mt-1 w-full rounded-lg border border-primary/15 px-3 py-2 text-sm outline-none focus:border-accent focus:ring-2 focus:ring-accent/20'

export default function ContentAdmin() {
  const [overrides, setOverrides] = useState({})
  const [values, setValues] = useState({})
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [savedAt, setSavedAt] = useState(false)
  const [openPage, setOpenPage] = useState(contentGroups[0]?.page ?? null)

  useEffect(() => {
    let active = true
    ;(async () => {
      const { data } = await supabase.from('site_content').select('key, value')
      if (!active) return
      const map = {}
      for (const row of data || []) map[row.key] = row.value ?? ''
      setOverrides(map)
      // Startverdier: overstyring hvis satt, ellers standardtekst.
      setValues(
        Object.fromEntries(
          Object.keys(contentDefaults).map((key) => [key, map[key] ?? contentDefaults[key]]),
        ),
      )
      setLoading(false)
    })()
    return () => {
      active = false
    }
  }, [])

  // Felt som er endret i forhold til det som er lagret (overstyring eller standard).
  const dirtyKeys = useMemo(
    () =>
      Object.keys(values).filter(
        (key) => values[key] !== (overrides[key] ?? contentDefaults[key]),
      ),
    [values, overrides],
  )

  function setField(key, val) {
    setSavedAt(false)
    setValues((s) => ({ ...s, [key]: val }))
  }

  function resetField(key) {
    setField(key, contentDefaults[key])
  }

  async function saveAll() {
    setError('')
    setSaving(true)

    // Felt lik standardteksten lagres ikke (slettes), slik at de følger
    // standarden videre. Resten lagres som overstyringer.
    const toUpsert = []
    const toDelete = []
    for (const key of dirtyKeys) {
      const val = values[key]
      if (val === contentDefaults[key]) {
        if (overrides[key] != null) toDelete.push(key)
      } else {
        toUpsert.push({ key, value: val })
      }
    }

    if (toUpsert.length) {
      const res = await supabase.from('site_content').upsert(toUpsert, { onConflict: 'key' })
      if (res.error) {
        setError(res.error.message)
        setSaving(false)
        return
      }
    }
    if (toDelete.length) {
      const res = await supabase.from('site_content').delete().in('key', toDelete)
      if (res.error) {
        setError(res.error.message)
        setSaving(false)
        return
      }
    }

    // Oppdater lokal "lagret"-tilstand.
    setOverrides((prev) => {
      const next = { ...prev }
      for (const { key, value } of toUpsert) next[key] = value
      for (const key of toDelete) delete next[key]
      return next
    })
    setSaving(false)
    setSavedAt(true)
  }

  if (loading) return <p className="text-ink-light">Laster…</p>

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl">Tekster</h2>
          <p className="mt-1 text-sm text-ink-light">
            Rediger tekstene som vises på nettsiden. Tomt felt bruker standardteksten.
          </p>
        </div>
        <div className="flex items-center gap-3">
          {savedAt && <span className="text-sm text-green-700">Lagret ✓</span>}
          {dirtyKeys.length > 0 && (
            <span className="text-sm text-ink-light">{dirtyKeys.length} endring(er)</span>
          )}
          <button
            onClick={saveAll}
            disabled={saving || dirtyKeys.length === 0}
            className="rounded-full bg-accent px-5 py-2 text-sm font-medium text-white hover:bg-accent-light disabled:opacity-40"
          >
            {saving ? 'Lagrer…' : 'Lagre endringer'}
          </button>
        </div>
      </div>

      {error && <p className="mb-4 text-sm text-red-600">{error}</p>}

      <div className="space-y-3">
        {contentGroups.map((group) => {
          const open = openPage === group.page
          const pageDirty = group.fields.filter((f) => dirtyKeys.includes(f.key)).length
          return (
            <div key={group.page} className="overflow-hidden rounded-2xl border border-primary/10 bg-white">
              <button
                onClick={() => setOpenPage(open ? null : group.page)}
                className="flex w-full items-center justify-between px-6 py-4 text-left"
              >
                <span className="font-medium text-primary">{group.page}</span>
                <span className="flex items-center gap-3 text-sm text-ink-light">
                  {pageDirty > 0 && (
                    <span className="rounded-full bg-accent/10 px-2 py-0.5 text-accent">
                      {pageDirty}
                    </span>
                  )}
                  <span>{open ? '−' : '+'}</span>
                </span>
              </button>

              {open && (
                <div className="grid gap-5 border-t border-primary/10 px-6 py-6 sm:grid-cols-2">
                  {group.fields.map((f) => {
                    const isWide = f.type === 'textarea' || f.type === 'multiline'
                    const changed = dirtyKeys.includes(f.key)
                    return (
                      <label
                        key={f.key}
                        className={`block text-sm ${isWide ? 'sm:col-span-2' : ''}`}
                      >
                        <span className="flex items-center justify-between">
                          <span className="font-medium text-primary">{f.label}</span>
                          {changed && (
                            <button
                              type="button"
                              onClick={() => resetField(f.key)}
                              className="text-xs text-ink-light hover:text-accent"
                            >
                              Tilbakestill
                            </button>
                          )}
                        </span>
                        {isWide ? (
                          <textarea
                            rows={f.type === 'multiline' ? 6 : 3}
                            value={values[f.key] ?? ''}
                            onChange={(e) => setField(f.key, e.target.value)}
                            className={inputClass}
                          />
                        ) : (
                          <input
                            value={values[f.key] ?? ''}
                            onChange={(e) => setField(f.key, e.target.value)}
                            className={inputClass}
                          />
                        )}
                        {f.type === 'multiline' && (
                          <span className="mt-1 block text-xs text-ink-light">
                            Skill avsnitt med en tom linje.
                          </span>
                        )}
                      </label>
                    )
                  })}
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
