import PageHero from '../components/PageHero'
import CTASection from '../components/CTASection'
import { useContent } from '../lib/useContent'
import { technical, technicalNotes } from '../data/venue'

export default function TekniskeLosninger() {
  const t = useContent()
  return (
    <>
      <PageHero
        eyebrow={t('teknisk.hero.eyebrow')}
        title={t('teknisk.hero.title')}
        intro={t('teknisk.hero.intro')}
      />

      <section className="bg-white">
        <div className="container-page py-16">
          <div className="grid gap-10 lg:grid-cols-2">
            {technical.map((block) => (
              <div key={block.title} className="rounded-2xl border border-primary/10 p-7">
                <h2 className="text-2xl">{block.title}</h2>
                <ul className="mt-4 space-y-3 text-ink-light">
                  {block.items.map((item) => (
                    <li key={item} className="flex gap-3">
                      <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="mt-10 space-y-1 text-sm text-ink-light">
            {technicalNotes.map((note) => (
              <p key={note}>{note}</p>
            ))}
          </div>
        </div>
      </section>

      <CTASection
        eyebrow={t('teknisk.cta.eyebrow')}
        title={t('teknisk.cta.title')}
        text={t('teknisk.cta.text')}
        primary={{ label: 'Send forespørsel', to: '/foresporsel' }}
        secondary={{ label: 'Se lokalet', to: '/lokalet' }}
      />
    </>
  )
}
