import PageHero from '../components/PageHero'
import Button from '../components/Button'
import { site } from '../data/site'

export default function Kalender() {
  return (
    <>
      <PageHero
        eyebrow="Tilgjengelighet"
        title="Kalender"
        intro="Se når lokalet er ledig. Send oss en forespørsel for datoen du ønsker, så tar vi kontakt."
      />

      <section className="bg-white">
        <div className="container-page grid gap-12 py-20 lg:grid-cols-[1.6fr_1fr]">
          {/* Google Kalender */}
          <div>
            <div className="overflow-hidden rounded-2xl border border-primary/10 shadow-sm">
              <iframe
                title="Vardehuset – kalender"
                src="https://calendar.google.com/calendar/embed?src=vvardehuset%40gmail.com&ctz=Europe%2FOslo"
                className="h-[600px] w-full"
                style={{ border: 0 }}
                loading="lazy"
              />
            </div>
            <div className="mt-6">
              <Button to="/foresporsel" variant="primary">
                Send forespørsel
              </Button>
            </div>
          </div>

          {/* Kontaktinfo */}
          <div className="rounded-2xl border border-primary/10 bg-warm p-7">
            <p className="eyebrow">Kontaktinformasjon</p>
            <h3 className="mt-3 text-xl">Ta kontakt for mer informasjon</h3>
            <dl className="mt-6 space-y-5 text-sm">
              <div>
                <dt className="font-medium text-primary">{site.contacts[0].name}</dt>
                <dd>
                  <a
                    href={`tel:${site.contacts[0].phone.replace(/\s/g, '')}`}
                    className="text-ink-light hover:text-accent"
                  >
                    {site.contacts[0].phone}
                  </a>
                </dd>
              </div>
              <div>
                <dt className="font-medium text-primary">E-post</dt>
                <dd>
                  <a
                    href={`mailto:${site.calendarEmail}`}
                    className="text-ink-light hover:text-accent"
                  >
                    {site.calendarEmail}
                  </a>
                </dd>
              </div>
            </dl>
          </div>
        </div>
      </section>
    </>
  )
}
