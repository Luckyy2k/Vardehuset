// Supabase Edge Function: sender en SMS til et oppgitt nummer via Front.
// Brukes når en innlogget admin godkjenner en forespørsel og svarer kunden.
//
// I MOTSETNING til notify-inquiry deployes denne MED JWT-verifisering, slik at
// kun innloggede admin-brukere kan sende SMS (supabase-js sender med brukerens
// token automatisk). Ikke deploy med --no-verify-jwt.
//
// Deploy:
//   supabase functions deploy send-sms
// Bruker samme Front-secrets som notify-inquiry:
//   FRONT_SERVICE_ID, FRONT_PASSWORD, FRONT_FROM_ID

import { sendSms } from '../_shared/front.ts'
import { recordSmsUsage } from '../_shared/usage.ts'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers':
    'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { phone, text } = await req.json()

    if (!phone || !String(text || '').trim()) {
      return new Response(
        JSON.stringify({ error: 'Mangler telefonnummer eller melding' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
      )
    }

    const result = await sendSms(phone, String(text))

    if ((result as { skipped?: boolean }).skipped) {
      return new Response(
        JSON.stringify({ error: 'SMS er ikke konfigurert (Front-secrets mangler)' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
      )
    }

    // Tell sendte segmenter (best effort).
    if ((result as { segments?: number }).segments) {
      await recordSmsUsage((result as { segments: number }).segments)
    }

    return new Response(JSON.stringify({ ok: true, result }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  } catch (err) {
    console.error('send-sms feilet:', err)
    return new Response(JSON.stringify({ error: String(err).replace(/^Error:\s*/, '') }), {
      status: 502,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }
})
