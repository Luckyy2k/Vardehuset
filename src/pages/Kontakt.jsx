import PageHero from '../components/PageHero'
import { useContent } from '../lib/useContent'
import { choirContacts } from '../data/choir'

export default function Kontakt() {
  const t = useContent()
  return (
    <>
      <PageHero
        eyebrow={t('kontakt.hero.eyebrow')}
        title={t('kontakt.hero.title')}
        intro={t('kontakt.hero.intro')}
      />

      <section className="bg-white">
        <div className="container-page py-20">
          <div className="mx-auto grid max-w-3xl gap-8 sm:grid-cols-2">
            {choirContacts.map((c) => (
              <div
                key={c.name}
                className="rounded-2xl border border-primary/10 bg-warm p-8"
              >
                <p className="text-sm font-semibold uppercase tracking-wider text-accent">
                  {c.role}
                </p>
                <p className="mt-2 text-xl text-primary">{c.name}</p>
                <dl className="mt-5 space-y-3 text-sm">
                  <div>
                    <dt className="text-ink-light">Telefon</dt>
                    <dd>
                      <a
                        href={`tel:${c.phone.replace(/\s/g, '')}`}
                        className="text-primary hover:text-accent"
                      >
                        {c.phone}
                      </a>
                    </dd>
                  </div>
                  <div>
                    <dt className="text-ink-light">E-post</dt>
                    <dd>
                      <a
                        href={`mailto:${c.email}`}
                        className="break-all text-primary hover:text-accent"
                      >
                        {c.email}
                      </a>
                    </dd>
                  </div>
                </dl>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
