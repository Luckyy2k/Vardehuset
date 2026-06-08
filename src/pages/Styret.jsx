import PageHero from '../components/PageHero'
import SectionHeading from '../components/SectionHeading'
import Button from '../components/Button'
import { useCollection } from '../lib/useCollection'
import { useContent } from '../lib/useContent'
import { board as fallback } from '../data/board'

function initials(name) {
  return name
    .split(' ')
    .map((w) => w[0])
    .slice(0, 2)
    .join('')
    .toUpperCase()
}

export default function Styret() {
  const t = useContent()
  const { data: board } = useCollection('board_members', fallback, {
    orderBy: { column: 'id', ascending: true },
  })

  return (
    <>
      <PageHero eyebrow={t('styret.hero.eyebrow')} title={t('styret.hero.title')} />

      <section className="bg-white">
        <div className="container-page py-16">
          <figure className="mx-auto max-w-3xl">
            <div className="overflow-hidden rounded-2xl shadow-sm">
              <img
                src="/images/historie/styret-2025.png"
                alt="Styret 2025"
                className="w-full object-cover"
              />
            </div>
            <figcaption className="mt-3 text-center text-sm text-ink-light">
              {t('styret.photo.caption')}
            </figcaption>
          </figure>

          <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {board.map((m) => (
              <div
                key={m.id ?? m.name}
                className="flex items-center gap-4 rounded-2xl border border-primary/10 bg-warm p-5"
              >
                <span className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-accent/10 text-sm font-semibold text-accent">
                  {initials(m.name)}
                </span>
                <div>
                  <p className="font-medium text-primary">{m.name}</p>
                  <p className="text-sm text-accent">{m.role}</p>
                  {m.phone && (
                    <a
                      href={`tel:${m.phone.replace(/\s/g, '')}`}
                      className="text-sm text-ink-light hover:text-accent"
                    >
                      {m.phone}
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-warm">
        <div className="container-page py-16 text-center">
          <SectionHeading
            center
            title={t('styret.contact.title')}
            intro={t('styret.contact.intro')}
          />
          <div className="mt-8">
            <Button to="/bli-medlem" variant="primary">
              Bli medlem
            </Button>
          </div>
        </div>
      </section>
    </>
  )
}
