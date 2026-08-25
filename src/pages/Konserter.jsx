import PageHero from '../components/PageHero'
import SectionHeading from '../components/SectionHeading'
import { useCollection } from '../lib/useCollection'
import { useContent } from '../lib/useContent'
import { concerts as fallback } from '../data/concerts'

const fmt = new Intl.DateTimeFormat('no-NO', {
  day: 'numeric',
  month: 'short',
})
const weekday = new Intl.DateTimeFormat('no-NO', { weekday: 'long' })

function ConcertCard({ concert, muted }) {
  const date = new Date(concert.date)
  return (
    <div
      className={`overflow-hidden rounded-2xl border ${
        muted ? 'border-primary/10 bg-warm' : 'border-primary/10 bg-white shadow-sm'
      }`}
    >
      {concert.image && (
        <div className="aspect-[4/3] overflow-hidden">
          <img
            src={concert.image}
            alt={concert.title}
            loading="lazy"
            className="h-full w-full object-cover"
          />
        </div>
      )}
      <div className="flex gap-5 p-6">
        <div className="shrink-0 text-center">
          <p className="text-3xl font-light text-accent">{date.getDate()}</p>
          <p className="text-xs uppercase tracking-wider text-ink-light">
            {fmt.format(date).replace(/^\d+\.?\s*/, '')}
          </p>
        </div>
        <div>
          <p className="text-xs uppercase tracking-wider text-ink-light">
            {weekday.format(date)}
          </p>
          <h3 className="text-lg text-primary">{concert.title}</h3>
          {concert.venue && (
            <p className="text-sm font-medium text-accent">{concert.venue}</p>
          )}
          {concert.doors && (
            <p className="mt-1.5 text-base font-medium text-primary">
              Dørene åpner {concert.doors}
            </p>
          )}
          {concert.description && (
            <p className="mt-1 text-sm text-ink-light">{concert.description}</p>
          )}
        </div>
      </div>
    </div>
  )
}

export default function Konserter() {
  const t = useContent()
  const { data } = useCollection('concerts', fallback, {
    orderBy: { column: 'date', ascending: true },
  })

  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const sorted = [...data].sort((a, b) => a.date.localeCompare(b.date))
  const upcoming = sorted.filter((c) => new Date(c.date) >= today)
  const past = sorted.filter((c) => new Date(c.date) < today).reverse()

  return (
    <>
      <PageHero
        eyebrow={t('konserter.hero.eyebrow')}
        title={t('konserter.hero.title')}
        intro={t('konserter.hero.intro')}
      />

      <section className="bg-white">
        <div className="container-page py-20">
          <SectionHeading eyebrow={t('konserter.upcoming.eyebrow')} title={t('konserter.upcoming.title')} />
          {upcoming.length > 0 ? (
            <div className="mt-8 grid gap-5 md:grid-cols-2">
              {upcoming.map((c) => (
                <ConcertCard key={c.id ?? c.date + c.title} concert={c} />
              ))}
            </div>
          ) : (
            <p className="mt-8 text-ink-light">{t('konserter.upcoming.empty')}</p>
          )}

          {past.length > 0 && (
            <div className="mt-16">
              <SectionHeading eyebrow={t('konserter.past.eyebrow')} title={t('konserter.past.title')} />
              <div className="mt-8 grid gap-5 md:grid-cols-2">
                {past.map((c) => (
                  <ConcertCard key={c.id ?? c.date + c.title} concert={c} muted />
                ))}
              </div>
            </div>
          )}
        </div>
      </section>
    </>
  )
}
