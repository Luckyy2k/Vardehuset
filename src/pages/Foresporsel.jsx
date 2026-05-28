import { useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import PageHero from '../components/PageHero'
import { supabase, isSupabaseConfigured } from '../lib/supabase'
import { site } from '../data/site'
import { eventTypes } from '../data/venue'

const inputClass =
  'mt-1.5 w-full rounded-lg border border-primary/15 bg-white px-4 py-2.5 text-sm text-ink shadow-sm outline-none transition focus:border-accent focus:ring-2 focus:ring-accent/20'

function Field({ label, required, children }) {
  return (
    <label className="block text-sm">
      <span className="font-medium text-primary">
        {label} {required && <span className="text-accent">*</span>}
      </span>
      {children}
    </label>
  )
}

const empty = {
  name: '',
  email: '',
  phone: '',
  event_type: '',
  event_date: '',
  guests: '',
  message: '',
}

export default function Foresporsel() {
  const [params] = useSearchParams()
  const [form, setForm] = useState({ ...empty, event_date: params.get('dato') || '' })
  const [status, setStatus] = useState('idle') // idle | submitting | success | error

  const update = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }))

  async function handleSubmit(e) {
    e.preventDefault()
    setStatus('submitting')

    const payload = {
      ...form,
      guests: form.guests ? Number(form.guests) : null,
    }

    if (!isSupabaseConfigured) {
      // Fallback: åpne e-postklient med forhåndsutfylt melding.
      const body = `Navn: ${form.name}%0AE-post: ${form.email}%0ATelefon: ${form.phone}%0AType: ${form.event_type}%0AØnsket dato: ${form.event_date}%0AAntall gjester: ${form.guests}%0A%0A${form.message}`
      window.location.href = `mailto:${site.email}?subject=Forespørsel om leie&body=${body}`
      setStatus('success')
      return
    }

    const { error } = await supabase.from('inquiries').insert(payload)
    if (error) {
      setStatus('error')
      return
    }

    // Send e-postvarsel (best effort – forespørselen er allerede lagret).
    try {
      await supabase.functions.invoke('notify-inquiry', { body: payload })
    } catch {
      /* ignorer – varsel er ikke kritisk */
    }

    setForm(empty)
    setStatus('success')
  }

  return (
    <>
      <PageHero
        eyebrow="Ta kontakt"
        title="Send forespørsel"
        intro="Fyll ut skjemaet under, så kontakter vi deg for å diskutere ditt arrangement."
      />

      <section className="bg-white">
        <div className="container-page grid gap-12 py-20 lg:grid-cols-[1fr_1.4fr]">
          {/* Kontaktinfo */}
          <div>
            <p className="eyebrow">Kontaktinformasjon</p>
            <h2 className="mt-3 text-2xl">Eller kontakt oss direkte</h2>
            <dl className="mt-8 space-y-6 text-sm">
              <div>
                <dt className="font-medium text-primary">Telefon</dt>
                {site.contacts.map((c) => (
                  <dd key={c.name} className="text-ink-light">
                    {c.name.split(' ')[0]}:{' '}
                    <a
                      href={`tel:${c.phone.replace(/\s/g, '')}`}
                      className="hover:text-accent"
                    >
                      {c.phone}
                    </a>
                  </dd>
                ))}
              </div>
              <div>
                <dt className="font-medium text-primary">E-post</dt>
                <dd>
                  <a href={`mailto:${site.email}`} className="text-ink-light hover:text-accent">
                    {site.email}
                  </a>
                </dd>
              </div>
              <div>
                <dt className="font-medium text-primary">Adresse</dt>
                <dd className="text-ink-light">{site.address.area}</dd>
              </div>
            </dl>
          </div>

          {/* Skjema */}
          <div className="rounded-2xl border border-primary/10 bg-warm p-7 sm:p-9">
            {status === 'success' ? (
              <div className="py-10 text-center">
                <h3 className="text-2xl text-primary">Takk for din forespørsel!</h3>
                <p className="mt-3 text-ink-light">
                  Vi tar kontakt med deg så snart som mulig.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="grid gap-5 sm:grid-cols-2">
                <Field label="Navn" required>
                  <input
                    type="text"
                    required
                    value={form.name}
                    onChange={update('name')}
                    placeholder="Ditt fulle navn"
                    className={inputClass}
                  />
                </Field>
                <Field label="E-post" required>
                  <input
                    type="email"
                    required
                    value={form.email}
                    onChange={update('email')}
                    placeholder="din@epost.no"
                    className={inputClass}
                  />
                </Field>
                <Field label="Telefon">
                  <input
                    type="tel"
                    value={form.phone}
                    onChange={update('phone')}
                    placeholder="+47 XXX XX XXX"
                    className={inputClass}
                  />
                </Field>
                <Field label="Type arrangement" required>
                  <select
                    required
                    value={form.event_type}
                    onChange={update('event_type')}
                    className={inputClass}
                  >
                    <option value="">Velg type</option>
                    {eventTypes.map((t) => (
                      <option key={t} value={t}>
                        {t}
                      </option>
                    ))}
                  </select>
                </Field>
                <Field label="Ønsket dato" required>
                  <input
                    type="date"
                    required
                    value={form.event_date}
                    onChange={update('event_date')}
                    className={inputClass}
                  />
                </Field>
                <Field label="Antall gjester">
                  <input
                    type="number"
                    min="0"
                    value={form.guests}
                    onChange={update('guests')}
                    placeholder="Ca. antall"
                    className={inputClass}
                  />
                </Field>
                <div className="sm:col-span-2">
                  <Field label="Melding">
                    <textarea
                      rows="4"
                      value={form.message}
                      onChange={update('message')}
                      placeholder="Fortell oss mer om ditt arrangement..."
                      className={inputClass}
                    />
                  </Field>
                </div>

                {status === 'error' && (
                  <p className="text-sm text-red-600 sm:col-span-2">
                    Noe gikk galt. Prøv igjen, eller kontakt oss på {site.email}.
                  </p>
                )}

                <div className="sm:col-span-2">
                  <button
                    type="submit"
                    disabled={status === 'submitting'}
                    className="w-full rounded-full bg-accent px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-accent-light disabled:opacity-60"
                  >
                    {status === 'submitting' ? 'Sender...' : 'Send forespørsel'}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </section>
    </>
  )
}
