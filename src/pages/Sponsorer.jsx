import PageHero from '../components/PageHero'
import SectionHeading from '../components/SectionHeading'
import ZoomableImage from '../components/ZoomableImage'
import { useCollection } from '../lib/useCollection'
import { useContent, paragraphs } from '../lib/useContent'
import { sponsors as fallback } from '../data/sponsors'

export default function Sponsorer() {
  const t = useContent()
  const { data: sponsors } = useCollection('sponsors', fallback, {
    orderBy: { column: 'id', ascending: true },
  })

  return (
    <>
      <PageHero
        eyebrow={t('sponsorer.hero.eyebrow')}
        title={t('sponsorer.hero.title')}
        intro={t('sponsorer.hero.intro')}
      />

      {/* Historie */}
      <section className="bg-white">
        <div className="container-page grid items-center gap-12 py-20 lg:grid-cols-2">
          <div>
            <SectionHeading eyebrow={t('sponsorer.history.eyebrow')} title={t('sponsorer.history.title')} />
            <div className="mt-6 space-y-4 text-ink-light">
              {paragraphs(t('sponsorer.history.body')).map((p, i) => (
                <p key={i}>{p}</p>
              ))}
            </div>
          </div>
          <ZoomableImage
            src="/images/historie/spadestikket.jpg"
            alt="Byggestart – Kulturhuset Varde"
            className="overflow-hidden rounded-2xl shadow-sm"
            imgClassName="aspect-[4/3] w-full object-cover"
          />
        </div>
      </section>

      {/* Sponsorer */}
      <section className="bg-warm">
        <div className="container-page py-20">
          <SectionHeading
            center
            eyebrow={t('sponsorer.list.eyebrow')}
            title={t('sponsorer.list.title')}
            intro={t('sponsorer.list.intro')}
          />
          <div className="mx-auto mt-12 grid max-w-4xl gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {sponsors.map((s) => (
              <div
                key={s.id ?? s.name}
                className="rounded-xl border border-primary/10 bg-white p-6 text-center"
              >
                <p className="font-medium text-primary">{s.name}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
