// Logger antall sendte SMS-segmenter til tabellen sms_usage (én rad per år).
// Kjøres server-side med service role, og er «best effort» – en feil her skal
// aldri stoppe selve SMS-en.

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

export async function recordSmsUsage(segments: number) {
  if (!segments || segments < 1) return { ok: false, error: 'ingen segmenter' }
  try {
    const url = Deno.env.get('SUPABASE_URL')
    const key = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')
    if (!url || !key) {
      console.error('Kan ikke logge SMS-bruk: SUPABASE_URL/SERVICE_ROLE_KEY mangler')
      return { ok: false, error: 'SUPABASE_URL/SERVICE_ROLE_KEY mangler' }
    }
    const supabase = createClient(url, key)
    const { error } = await supabase.rpc('increment_sms_usage', { p_segments: segments })
    if (error) {
      console.error('Kunne ikke logge SMS-bruk:', error.message)
      return { ok: false, error: error.message }
    }
    console.log(`SMS-bruk logget: +${segments} segment(er)`)
    return { ok: true }
  } catch (err) {
    console.error('Kunne ikke logge SMS-bruk:', err)
    return { ok: false, error: String(err) }
  }
}
