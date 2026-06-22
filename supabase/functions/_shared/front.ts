// Delt hjelpemodul for Front SMS Gateway (pling.as).
// Brukes av både notify-inquiry (varsel til forvalter) og send-sms (svar til kunde).

// Normaliser norsk telefonnummer til Fronts 00-format (f.eks. 004791615147).
// Returnerer tom streng hvis nummeret er ugyldig.
export function normalizeNO(raw: unknown): string {
  let s = String(raw || '').replace(/[\s\-()]/g, '')
  if (/^\d{8}$/.test(s)) s = `+47${s}` // 8 siffer → norsk
  if (s.startsWith('00')) s = `+${s.slice(2)}`
  if (!/^\+\d{7,15}$/.test(s)) return '' // ugyldig
  return s.replace(/^\+/, '00') // Front vil ha 00-format
}

// Vanlige Front-feilkoder (for tydeligere logging).
export const FRONT_ERRORS: Record<number, string> = {
  1: 'Ugyldig telefonnummer',
  3: 'Ugyldig fromid (avsendernavn)',
  5: 'Ingen SMS-kreditter',
  7: 'Konto blokkert',
  13: 'Ugyldig passord',
  21: 'Nummer svartelistet',
}

// Sender én SMS via Front. Kaster ved feil; returnerer Front-responsen ved suksess.
// Hopper over (returnerer { skipped }) hvis Front-secrets ikke er satt.
export async function sendSms(toRaw: unknown, text: string) {
  const serviceid = Deno.env.get('FRONT_SERVICE_ID')
  const password = Deno.env.get('FRONT_PASSWORD')
  const fromid = Deno.env.get('FRONT_FROM_ID')
  if (!serviceid || !password || !fromid) {
    return { skipped: true, reason: 'Front-secrets mangler' }
  }

  const phoneno = normalizeNO(toRaw)
  if (!phoneno) throw new Error('Ugyldig mottakernummer')

  // Bruk unicode bare når teksten har tegn utenfor ren ASCII (f.eks. æ/ø/å),
  // slik at vanlige meldinger sendes som billig GSM.
  const unicode = /[^\x00-\x7F]/.test(text)

  const resp = await fetch('https://www.pling.as/psk/push.php', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ serviceid, password, phoneno, fromid, txt: text, unicode }),
  })

  const data = await resp.json().catch(() => null)
  const code = data?.errorcode ?? -1
  if (!resp.ok || code !== 0) {
    const desc = data?.description || FRONT_ERRORS[code] || `HTTP ${resp.status}`
    throw new Error(`Front-feil: ${code} ${desc}`)
  }
  return data
}
