import Button from '../components/Button'
import SectionHeading from '../components/SectionHeading'
import CTASection from '../components/CTASection'
import { site } from '../data/site'
import { gallery } from '../data/venue'

const occasions = [
  'Møter',
  'Bryllup',
  'Konfirmasjoner',
  'Åremål',
  'Barnedåp',
  'Minnestunder',
  'Konserter',
]

export default function Home() {
  return (
    <>
      {/* Hero */}
      <section className="relative">
        <div className="absolute inset-0">
          <img
            src="/images/hero.jpg"
            alt="Kulturhuset Varde"
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-primary/95 via-primary/70 to-primary/40" />
        </div>
        <div className="container-page relative flex min-h-[78vh] flex-col justify-center pb-24 pt-56">
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-accent-light">
            {site.name}
          </p>
          <h1 className="mt-4 max-w-2xl text-4xl font-light text-white sm:text-6xl">
            Velkommen til Vardehuset
          </h1>
          <p className="mt-5 max-w-xl text-lg text-white/80">{site.tagline}</p>
          <div className="mt-8 flex flex-wrap gap-4">
            <Button to="/foresporsel" variant="primary">
              Send forespørsel
            </Button>
            <Button to="/kalender" variant="outline">
              Se tilgjengelighet
            </Button>
          </div>
        </div>
      </section>

      {/* Kontaktbar */}
      <section className="border-b border-primary/10 bg-warm">
        <div className="container-page grid gap-6 py-8 sm:grid-cols-3">
          {site.contacts.map((c) => (
            <div key={c.name}>
              <p className="text-xs uppercase tracking-wider text-ink-light">
                {c.name}
              </p>
              <a
                href={`tel:${c.phone.replace(/\s/g, '')}`}
                className="text-lg font-medium text-primary hover:text-accent"
              >
                {c.phone}
              </a>
            </div>
          ))}
          <div>
            <p className="text-xs uppercase tracking-wider text-ink-light">E-post</p>
            <a
              href={`mailto:${site.email}`}
              className="text-lg font-medium text-primary hover:text-accent"
            >
              {site.email}
            </a>
          </div>
        </div>
      </section>

      {/* Anledninger */}
      <section className="bg-white">
        <div className="container-page py-20">
          <SectionHeading
            center
            eyebrow="Våre lokaler"
            title="Perfekt for enhver anledning"
            intro="Moderne og fleksible lokaler tilpasset dine behov, fra intime sammenkomster til større arrangementer."
          />
          <div className="mt-12 flex flex-wrap justify-center gap-3">
            {occasions.map((o) => (
              <span
                key={o}
                className="rounded-full border border-primary/10 bg-warm px-5 py-2.5 text-sm font-medium text-primary"
              >
                {o}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Galleri */}
      <section className="bg-warm">
        <div className="container-page py-20">
          <SectionHeading center eyebrow="Galleri" title="Flotte lokaler" />
          <div className="mt-12 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
            {gallery.slice(0, 8).map((g) => (
              <div
                key={g.img}
                className="aspect-[4/3] overflow-hidden rounded-xl bg-primary/5"
              >
                <img
                  src={g.img}
                  alt={g.alt}
                  loading="lazy"
                  className="h-full w-full object-cover transition-transform duration-500 hover:scale-105"
                />
              </div>
            ))}
          </div>
          <div className="mt-10 text-center">
            <Button to="/lokalet" variant="outlineDark">
              Se mer om lokalet
            </Button>
          </div>
        </div>
      </section>

      {/* Beliggenhet */}
      <section className="bg-white">
        <div className="container-page grid items-center gap-12 py-20 lg:grid-cols-2">
          <div>
            <SectionHeading
              eyebrow="Finn oss"
              title="Beliggenhet"
              intro="Kulturhuset Varde ligger sentralt plassert i Nørvasundet, midt mellom Ålesund sentrum og Moa. Kort vei fra E136, med god skilting og enkel adkomst."
            />
            <dl className="mt-8 space-y-5">
              <div>
                <dt className="text-sm font-semibold text-primary">Adresse</dt>
                <dd className="text-ink-light">
                  {site.address.street}, {site.address.zip}
                </dd>
              </div>
              <div>
                <dt className="text-sm font-semibold text-primary">Parkering</dt>
                <dd className="text-ink-light">Gratis parkering rett utenfor lokalet</dd>
              </div>
              <div>
                <dt className="text-sm font-semibold text-primary">Kjøreavstand</dt>
                <dd className="text-ink-light">
                  10 min fra Ålesund sentrum, 5 min fra Moa
                </dd>
              </div>
            </dl>
            <div className="mt-8">
              <Button href={site.address.mapsUrl} variant="primary" target="_blank" rel="noreferrer">
                Åpne i Google Maps
              </Button>
            </div>
          </div>
          <div className="overflow-hidden rounded-2xl border border-primary/10 shadow-sm">
            <iframe
              title="Kart over Kulturhuset Varde"
              src="https://www.google.com/maps?q=Borgundvegen+393,+6015+%C3%85lesund&output=embed"
              className="h-80 w-full lg:h-96"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </div>
      </section>

      <CTASection
        eyebrow="Planlegger du et arrangement?"
        title="La oss skape uforglemmelige opplevelser sammen"
        text="Kontakt oss for en uforpliktende samtale om ditt arrangement. Vi hjelper deg gjerne med planleggingen."
        primary={{ label: 'Send forespørsel', to: '/foresporsel' }}
        secondary={{ label: 'Ring oss: 412 13 927', href: 'tel:41213927' }}
      />
    </>
  )
}
