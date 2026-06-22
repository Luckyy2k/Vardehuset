// Supabase Edge Function: varsler når en forespørsel kommer inn.
//  - E-post via Resend (valgfritt)
//  - SMS via Front SMS Gateway / pling.as (valgfritt)
//
// Begge varslene er «best effort»: forespørselen er allerede lagret i databasen
// før denne funksjonen kalles, så en feil her skal aldri blokkere bookingen.
// Funksjonen svarer alltid 200 med en status per kanal; feil logges i
// funksjonsloggen (supabase functions logs notify-inquiry).
//
// Deploy:
//   supabase functions deploy notify-inquiry --no-verify-jwt
// Secrets (e-post – valgfritt):
//   supabase secrets set RESEND_API_KEY=...
//   supabase secrets set MAIL_TO=post@vardehuset.no
//   supabase secrets set MAIL_FROM="Vardehuset <onboarding@resend.dev>"
// Secrets (SMS – Front):
//   supabase secrets set FRONT_SERVICE_ID=14402
//   supabase secrets set FRONT_PASSWORD=...          # secret key – kun server-side
//   supabase secrets set FRONT_FROM_ID=Vardehuset    # maks 11 tegn, A–Z/0–9, min. én bokstav
//   supabase secrets set MANAGER_PHONE=004791615147  # mottaker som skal varsles

import { sendSms } from '../_shared/front.ts'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers':
    'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
}

async function sendEmail(i: Record<string, unknown>) {
  const apiKey = Deno.env.get('RESEND_API_KEY')
  if (!apiKey) return { skipped: true, reason: 'RESEND_API_KEY mangler' }

  const to = Deno.env.get('MAIL_TO') ?? 'post@vardehuset.no'
  const from = Deno.env.get('MAIL_FROM') ?? 'Vardehuset <onboarding@resend.dev>'

  const rows = [
    ['Navn', i.name],
    ['E-post', i.email],
    ['Telefon', i.phone],
    ['Type arrangement', i.event_type],
    ['Ønsket dato', i.event_date],
    ['Antall gjester', i.guests],
  ]
    .filter(([, v]) => v)
    .map(([k, v]) => `<tr><td style="padding:4px 12px 4px 0"><b>${k}</b></td><td>${v}</td></tr>`)
    .join('')

  const html = `
    <h2>Ny forespørsel om leie</h2>
    <table>${rows}</table>
    ${i.message ? `<p><b>Melding:</b><br>${String(i.message).replace(/\n/g, '<br>')}</p>` : ''}
  `

  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from,
      to,
      reply_to: i.email,
      subject: `Ny forespørsel: ${i.event_type ?? 'arrangement'} – ${i.name}`,
      html,
    }),
  })

  if (!res.ok) throw new Error(`Resend-feil: HTTP ${res.status} ${await res.text()}`)
  return { ok: true }
}

// Kort SMS-oppsummering til forvalteren.
function smsText(i: Record<string, unknown>) {
  const navn = String(i.name || 'ukjent')
  const tlf = i.phone ? String(i.phone) : 'tlf ikke oppgitt'
  const type = String(i.event_type || 'arrangement')
  const dato = i.event_date ? ` ${i.event_date}` : ''
  return `Ny booking fra ${navn} (${tlf}) - ${type}${dato}. Se admin.`
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  const result: { email?: unknown; sms?: unknown } = {}

  try {
    const i = await req.json()

    // E-post (best effort)
    try {
      result.email = await sendEmail(i)
    } catch (err) {
      console.error('E-postvarsel feilet:', err)
      result.email = { error: String(err) }
    }

    // SMS (best effort)
    try {
      result.sms = await sendSms(Deno.env.get('MANAGER_PHONE'), smsText(i))
    } catch (err) {
      console.error('SMS-varsel feilet:', err)
      result.sms = { error: String(err) }
    }

    return new Response(JSON.stringify({ ok: true, ...result }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  } catch (err) {
    // Ugyldig payload e.l. – logg, men ikke kritisk for bookingen.
    console.error('notify-inquiry feilet:', err)
    return new Response(JSON.stringify({ error: String(err) }), {
      status: 400,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }
})
