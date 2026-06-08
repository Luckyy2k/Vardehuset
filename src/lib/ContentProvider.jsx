import { useEffect, useState } from 'react'
import { supabase, isSupabaseConfigured } from './supabase'
import { ContentContext } from './useContent'

// Henter redigerbare sidetekster fra Supabase (tabellen `site_content`) og gjør
// dem tilgjengelige via useContent(). Tekster som ikke er overstyrt i admin
// faller tilbake til standardverdiene i ../data/content, slik at sidene alltid
// viser innhold – også uten Supabase.
export function ContentProvider({ children }) {
  const [overrides, setOverrides] = useState({})

  useEffect(() => {
    if (!isSupabaseConfigured) return

    let active = true
    ;(async () => {
      const { data, error } = await supabase.from('site_content').select('key, value')
      if (!active || error || !data) return
      const map = {}
      for (const row of data) {
        if (row.value != null && row.value !== '') map[row.key] = row.value
      }
      setOverrides(map)
    })()

    return () => {
      active = false
    }
  }, [])

  return <ContentContext.Provider value={overrides}>{children}</ContentContext.Provider>
}
