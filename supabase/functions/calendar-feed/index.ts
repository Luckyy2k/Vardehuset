// Supabase Edge Function: serverer opptatte datoer som en iCal-feed (.ics)
// som Google Kalender kan abonnere på («Fra URL»).
//
// Beskyttet med en hemmelig token i URL-en (?token=...), så feeden ikke er
// offentlig gjettbar. Deployes uten JWT-verifisering slik at Google kan hente
// den uten innlogging:
//   supabase functions deploy calendar-feed --no-verify-jwt
// Secret:
//   supabase secrets set FEED_TOKEN=<hemmelig>

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const cors = { 'Access-Control-Allow-Origin': '*' }

const pad = (n: number) => String(n).padStart(2, '0')
const ymd = (dateStr: string) => dateStr.replaceAll('-', '')

function nextDay(dateStr: string) {
  const d = new Date(dateStr + 'T00:00:00Z')
  d.setUTCDate(d.getUTCDate() + 1)
  return `${d.getUTCFullYear()}${pad(d.getUTCMonth() + 1)}${pad(d.getUTCDate())}`
}

function stamp() {
  const d = new Date()
  return (
    `${d.getUTCFullYear()}${pad(d.getUTCMonth() + 1)}${pad(d.getUTCDate())}` +
    `T${pad(d.getUTCHours())}${pad(d.getUTCMinutes())}${pad(d.getUTCSeconds())}Z`
  )
}

// Escape iCal-tekst (komma, semikolon, backslash, linjeskift).
const esc = (s: unknown) =>
  String(s ?? '')
    .replace(/\\/g, '\\\\')
    .replace(/([,;])/g, '\\$1')
    .replace(/\n/g, '\\n')

// Brett lange linjer til <=74 tegn (RFC 5545).
function fold(line: string) {
  let out = ''
  while (line.length > 74) {
    out += line.slice(0, 74) + '\r\n '
    line = line.slice(74)
  }
  return out + line
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: cors })

  const url = new URL(req.url)
  const expected = Deno.env.get('FEED_TOKEN')
  if (expected && url.searchParams.get('token') !== expected) {
    return new Response('Unauthorized', { status: 401, headers: cors })
  }

  const supabase = createClient(
    Deno.env.get('SUPABASE_URL')!,
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
  )
  const { data } = await supabase
    .from('booked_dates')
    .select('id, date, name, phone, inquiries(name, phone, event_type, guests)')

  const now = stamp()
  const lines = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Vardehuset//Booking//NO',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    'X-WR-CALNAME:Vardehuset – opptatte datoer',
    'X-WR-TIMEZONE:Europe/Oslo',
  ]

  for (const r of data ?? []) {
    const inq = (r.inquiries as Record<string, unknown>) || {}
    const name = r.name || inq.name || ''
    const type = inq.event_type || ''
    const phone = r.phone || inq.phone || ''
    const summary = name
      ? `Opptatt: ${name}${type ? ` (${type})` : ''}`
      : type
        ? `Opptatt: ${type}`
        : 'Opptatt'

    const desc: string[] = []
    if (type) desc.push(`Arrangement: ${type}`)
    if (phone) desc.push(`Telefon: ${phone}`)
    if (inq.guests) desc.push(`Gjester: ${inq.guests}`)

    lines.push('BEGIN:VEVENT')
    lines.push(`UID:${r.id}@vardehuset.no`)
    lines.push(`DTSTAMP:${now}`)
    lines.push(`DTSTART;VALUE=DATE:${ymd(r.date)}`)
    lines.push(`DTEND;VALUE=DATE:${nextDay(r.date)}`)
    lines.push(fold(`SUMMARY:${esc(summary)}`))
    if (desc.length) lines.push(fold(`DESCRIPTION:${esc(desc.join('\n'))}`))
    lines.push('TRANSP:OPAQUE')
    lines.push('END:VEVENT')
  }

  lines.push('END:VCALENDAR')

  return new Response(lines.join('\r\n'), {
    headers: {
      ...cors,
      'Content-Type': 'text/calendar; charset=utf-8',
      'Cache-Control': 'public, max-age=300',
    },
  })
})
