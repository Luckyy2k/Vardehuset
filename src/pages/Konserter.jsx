import PageHero from '../components/PageHero'
import SectionHeading from '../components/SectionHeading'
import Button from '../components/Button'
import LinkedText from '../components/LinkedText'
import ZoomableImage from '../components/ZoomableImage'
import { useCollection } from '../lib/useCollection'
import { useContent } from '../lib/useContent'
import { concerts as fallback } from '../data/concerts'
import { articles } from '../data/articles'

const fmt = new Intl.DateTimeFormat('no-NO', {
  day: 'numeric',
  month: 'short',
})
const weekday = new Intl.DateTimeFormat('no-NO', { weekday: 'long' })

function ConcertCard({ concert, muted }) {
  const date = new Date(concert.date)
  return (
    <div
      className={`flex flex-col overflow-hidden rounded-2xl border ${
        muted ? 'border-primary/10 bg-warm' : 'border-primary/10 bg-white shadow-sm'
      }`}
    >
      <ZoomableImage
        src={concert.image}
        alt={concert.title}
        className="aspect-[4/3] overflow-hidden"
        imgClassName="h-full w-full object-cover transition-transform duration-500 hover:scale-105"
      />
      <div className="flex flex-1 flex-col gap-5 p-6 sm:flex-row">
        <div className="shrink-0 text-center sm:text-left">
          <p className="text-3xl font-light text-accent">{date.getDate()}</p>
          <p className="text-xs uppercase tracking-wider text-ink-light">
            {fmt.format(date).replace(/^\d+\.?\s*/, '')}
          </p>
        </div>
        <div className="flex flex-1 flex-col">
          <p className="text-xs uppercase tracking-wider text-ink-light">
            {weekday.format(date)}
          </p>
          <h3 className="text-lg text-primary">{concert.title}</h3>
          {concert.venue && (
            <p className="text-sm font-medium text-accent">{concert.venue}</p>
          )}
          {(concert.doors || concert.start_time) && (
            <div className="mt-1.5 space-y-0.5 text-base font-medium text-primary">
              {concert.doors && <p>Dørene åpner {concert.doors}</p>}
              {concert.start_time && <p>Konserten starter {concert.start_time}</p>}
            </div>
          )}
          {concert.description && (
            <LinkedText
              text={concert.description}
              className="mt-1 whitespace-pre-line text-sm text-ink-light"
            />
          )}
          {concert.ticket_url && (
            <div className="mt-4">
              <Button
                href={concert.ticket_url}
                variant="primary"
                target="_blank"
                rel="noreferrer noopener"
              >
                {concert.ticket_label || 'Bestill billett her'}
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

// Eget kort ved siden av konserten: omtalen av konserten i media.
function ArticleCard({ concert, muted }) {
  const isBypatrioten = /bypatrioten\./i.test(concert.article_url || '')
  return (
    <div
      className={`flex flex-col overflow-hidden rounded-2xl border ${
        muted ? 'border-primary/10 bg-warm' : 'border-primary/10 bg-white shadow-sm'
      }`}
    >
      <ZoomableImage
        src={concert.article_image}
        alt={concert.article_title || concert.title}
        className="aspect-[4/3] overflow-hidden"
        imgClassName="h-full w-full object-cover transition-transform duration-500 hover:scale-105"
      />
      <div className="flex flex-1 flex-col p-6">
        <p className="text-xs uppercase tracking-wider text-ink-light">
          Omtale
        </p>
        <h3 className="mt-0.5 text-lg text-primary">{concert.article_title}</h3>
        {concert.article_excerpt && (
          <p className="mt-2 whitespace-pre-line text-sm text-ink-light">
            {concert.article_excerpt}
          </p>
        )}
        <div className="mt-auto pt-5">
          <Button
            href={concert.article_url}
            variant="primary"
            target="_blank"
            rel="noreferrer noopener"
          >
            Les mer
          </Button>
          {isBypatrioten && (
            <div className="mt-4 flex items-center gap-2">
              <span className="text-xs uppercase tracking-wider text-ink-light">
                Kilde
              </span>
              <img
                src="/bypatrioten-logo.svg"
                alt="Bypatrioten"
                className="h-5 w-auto"
              />
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

// Slår sammen konserten med presseomtalen for datoen. Verdier fra Supabase
// vinner, slik at omtalen kan overstyres i admin uten kodeendring.
function withArticle(concert) {
  const a = articles[concert.date]
  if (!a) return concert
  return {
    ...concert,
    article_url: concert.article_url || a.url,
    article_title: concert.article_title || a.title,
    article_excerpt: concert.article_excerpt || a.excerpt,
    article_image: concert.article_image || a.image,
  }
}

// Konsertkortet, og – dersom konserten er omtalt – artikkelkortet rett ved siden av.
function concertCards(list, muted) {
  return list.flatMap((concert) => {
    const c = withArticle(concert)
    const key = c.id ?? c.date + c.title
    const cards = [<ConcertCard key={key} concert={c} muted={muted} />]
    // Vis bare artikkelkortet når det faktisk finnes noe å vise i det.
    if (c.article_url && (c.article_title || c.article_image)) {
      cards.push(<ArticleCard key={`${key}-artikkel`} concert={c} muted={muted} />)
    }
    return cards
  })
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
            <div className="mt-8 grid items-stretch gap-5 md:grid-cols-2">
              {concertCards(upcoming)}
            </div>
          ) : (
            <p className="mt-8 text-ink-light">{t('konserter.upcoming.empty')}</p>
          )}

          {past.length > 0 && (
            <div className="mt-16">
              <SectionHeading eyebrow={t('konserter.past.eyebrow')} title={t('konserter.past.title')} />
              <div className="mt-8 grid items-stretch gap-5 md:grid-cols-2">
                {concertCards(past, true)}
              </div>
            </div>
          )}
        </div>
      </section>
    </>
  )
}
