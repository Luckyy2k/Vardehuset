import { useEffect, useState } from 'react'
import { supabase, isSupabaseConfigured } from './supabase'

// Henter en tabell fra Supabase. Faller tilbake til medfølgende data
// dersom Supabase ikke er konfigurert eller spørringen feiler, slik at
// siden alltid viser innhold.
export function useCollection(table, fallback = [], { orderBy } = {}) {
  const [data, setData] = useState(fallback)
  const [loading, setLoading] = useState(isSupabaseConfigured)

  useEffect(() => {
    if (!isSupabaseConfigured) return

    let active = true
    ;(async () => {
      let query = supabase.from(table).select('*')
      if (orderBy) query = query.order(orderBy.column, { ascending: orderBy.ascending ?? true })
      const { data: rows, error } = await query
      if (!active) return
      if (error || !rows || rows.length === 0) {
        setData(fallback)
      } else {
        setData(rows)
      }
      setLoading(false)
    })()

    return () => {
      active = false
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [table])

  return { data, loading }
}
