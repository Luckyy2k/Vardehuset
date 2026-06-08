import PageHero from '../components/PageHero'
import SectionHeading from '../components/SectionHeading'
import CTASection from '../components/CTASection'
import { useContent, paragraphs } from '../lib/useContent'
import { choirStats, conductor } from '../data/choir'

export default function Mannskoret() {
  const t = useContent()
  return (
    <>
      <PageHero
        eyebrow={t('mannskoret.hero.eyebrow')}
        title={t('mannskoret.hero.title')}
        intro={t('mannskoret.hero.intro')}
      />

      {/* Statistikk */}
      <section className="bg-primary">
        <div className="container-page grid grid-cols-2 gap-8 py-12 lg:grid-cols-4">
          {choirStats.map((s) => (
            <div key={s.label} className="text-center">
              <p className="text-4xl font-light text-white">{s.value}</p>
              <p className="mt-1 text-sm text-white/60">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Historie */}
      <section className="bg-white">
        <div className="container-page py-20">
          <SectionHeading eyebrow={t('mannskoret.history.eyebrow')} title={t('mannskoret.history.title')} />
          <div className="mt-6 max-w-3xl space-y-4 text-ink-light">
            {paragraphs(t('mannskoret.history.body')).map((p, i) => (
              <p key={i}>{p}</p>
            ))}
          </div>
        </div>
      </section>

      {/* Dirigent */}
      <section className="bg-warm">
        <div className="container-page grid items-center gap-12 py-20 lg:grid-cols-2">
          <div className="order-2 lg:order-1">
            <SectionHeading eyebrow={t('mannskoret.conductor.eyebrow')} title={conductor.name} />
            <div className="mt-6 space-y-4 text-ink-light">
              {paragraphs(t('mannskoret.conductor.body')).map((p, i) => (
                <p key={i}>{p}</p>
              ))}
            </div>
          </div>
          <div className="order-1 overflow-hidden rounded-2xl shadow-sm lg:order-2">
            <img
              src={conductor.img}
              alt={conductor.name}
              className="aspect-[4/5] w-full object-cover"
            />
          </div>
        </div>
      </section>

      {/* Forestillinger */}
      <section className="bg-white">
        <div className="container-page py-20">
          <SectionHeading eyebrow={t('mannskoret.performance.eyebrow')} title={t('mannskoret.performance.title')} />
          <div className="mt-6 max-w-3xl space-y-4 text-ink-light">
            {paragraphs(t('mannskoret.performance.body')).map((p, i) => (
              <p key={i}>{p}</p>
            ))}
          </div>
        </div>
      </section>

      <CTASection
        eyebrow={t('mannskoret.cta.eyebrow')}
        title={t('mannskoret.cta.title')}
        text={t('mannskoret.cta.text')}
        primary={{ label: 'Les mer om medlemskap', to: '/bli-medlem' }}
        secondary={{ label: 'Se medlemmer', to: '/medlemmer' }}
      />
    </>
  )
}
