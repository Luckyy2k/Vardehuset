// Supabase Edge Function: sender e-postvarsel når en forespørsel kommer inn.
//
// Deploy:
//   supabase functions deploy notify-inquiry --no-verify-jwt
// Secrets:
//   supabase secrets set RESEND_API_KEY=...
//   (valgfritt) supabase secrets set MAIL_TO=post@vardehuset.no
//   (valgfritt) supabase secrets set MAIL_FROM="Vardehuset <onboarding@resend.dev>"

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
    const i = await req.json()
    const apiKey = Deno.env.get('RESEND_API_KEY')
    const to = Deno.env.get('MAIL_TO') ?? 'post@vardehuset.no'
    const from = Deno.env.get('MAIL_FROM') ?? 'Vardehuset <onboarding@resend.dev>'

    if (!apiKey) {
      return new Response(JSON.stringify({ error: 'RESEND_API_KEY mangler' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

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

    if (!res.ok) {
      const text = await res.text()
      return new Response(JSON.stringify({ error: text }), {
        status: 502,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    return new Response(JSON.stringify({ ok: true }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  } catch (err) {
    return new Response(JSON.stringify({ error: String(err) }), {
      status: 400,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }
})
