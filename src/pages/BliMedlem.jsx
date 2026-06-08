import PageHero from '../components/PageHero'
import SectionHeading from '../components/SectionHeading'
import Button from '../components/Button'
import { useContent } from '../lib/useContent'
import { membership, choirContacts } from '../data/choir'

export default function BliMedlem() {
  const t = useContent()
  const formann = choirContacts.find((c) => c.role === 'Formann')

  return (
    <>
      <PageHero
        eyebrow={t('blimedlem.hero.eyebrow')}
        title={t('blimedlem.hero.title')}
        intro={t('blimedlem.hero.intro')}
      />

      {/* Fordeler */}
      <section className="bg-white">
        <div className="container-page py-20">
          <SectionHeading
            center
            eyebrow={t('blimedlem.benefits.eyebrow')}
            title={t('blimedlem.benefits.title')}
          />
          <div className="mt-12 grid gap-6 sm:grid-cols-2">
            {membership.benefits.map((b) => (
              <div
                key={b.title}
                className="rounded-2xl border border-primary/10 bg-warm p-7"
              >
                <h3 className="text-lg text-primary">{b.title}</h3>
                <p className="mt-2 text-ink-light">{b.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Øvinger */}
      <section className="bg-warm">
        <div className="container-page py-20">
          <SectionHeading
            center
            eyebrow={t('blimedlem.practice.eyebrow')}
            title={t('blimedlem.practice.title')}
          />
          <div className="mx-auto mt-12 grid max-w-3xl gap-6 sm:grid-cols-2">
            <div className="rounded-2xl bg-white p-7 shadow-sm">
              <p className="text-sm font-semibold uppercase tracking-wider text-accent">
                Tid
              </p>
              <p className="mt-2 text-lg text-primary">{membership.practice.time}</p>
            </div>
            <div className="rounded-2xl bg-white p-7 shadow-sm">
              <p className="text-sm font-semibold uppercase tracking-wider text-accent">
                Sted
              </p>
              <p className="mt-2 text-lg text-primary">{membership.practice.place}</p>
            </div>
          </div>
          <p className="mx-auto mt-6 max-w-2xl text-center text-ink-light">
            {membership.practice.note}
          </p>
        </div>
      </section>

      {/* Kontakt */}
      <section className="bg-primary">
        <div className="container-page py-20 text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent-light">
            {t('blimedlem.contact.eyebrow')}
          </p>
          <h2 className="mt-4 text-3xl text-white sm:text-4xl">
            {t('blimedlem.contact.title')}
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-white/70">
            {t('blimedlem.contact.intro')}
          </p>
          <div className="mx-auto mt-10 grid max-w-2xl gap-6 sm:grid-cols-2">
            {choirContacts.map((c) => (
              <div key={c.name} className="rounded-2xl bg-white/5 p-6">
                <p className="text-sm text-accent-light">{c.role}</p>
                <p className="mt-1 text-lg text-white">{c.name}</p>
                <a
                  href={`tel:${c.phone.replace(/\s/g, '')}`}
                  className="mt-2 block text-white/70 hover:text-white"
                >
                  {c.phone}
                </a>
              </div>
            ))}
          </div>
          {formann && (
            <div className="mt-10">
              <Button href={`tel:${formann.phone.replace(/\s/g, '')}`} variant="light">
                Ring formannen
              </Button>
            </div>
          )}
        </div>
      </section>
    </>
  )
}
