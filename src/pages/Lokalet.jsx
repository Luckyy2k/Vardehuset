import PageHero from '../components/PageHero'
import SectionHeading from '../components/SectionHeading'
import CTASection from '../components/CTASection'
import { highlights, rooms, practical, gallery } from '../data/venue'

export default function Lokalet() {
  const roomImgs = new Set(rooms.map((r) => r.img))
  const galleryImages = gallery.filter((g) => !roomImgs.has(g.img))

  return (
    <>
      <PageHero
        eyebrow="Våre lokaler"
        title="Om lokalet"
        intro="Flotte og moderne selskapslokaler i gjennomført stil, sentralt plassert mellom Ålesund sentrum og Moa."
      />

      {/* Høydepunkter */}
      <section className="bg-white">
        <div className="container-page py-16">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-5">
            {highlights.map((h) => (
              <div
                key={h.title}
                className="rounded-xl border border-primary/10 bg-warm p-5"
              >
                <p className="font-medium text-primary">{h.title}</p>
                <p className="mt-2 text-sm text-ink-light">{h.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Rom */}
      <section className="bg-warm">
        <div className="container-page py-16">
          <div className="grid gap-8 md:grid-cols-2">
            {rooms.map((room) => (
              <div
                key={room.title}
                className="overflow-hidden rounded-2xl bg-white shadow-sm"
              >
                <div className="aspect-[16/10] overflow-hidden">
                  <img
                    src={room.img}
                    alt={room.title}
                    loading="lazy"
                    className="h-full w-full object-cover"
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-xl">{room.title}</h3>
                  <p className="mt-2 text-ink-light">{room.text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Galleri */}
      <section className="bg-white">
        <div className="container-page py-20">
          <SectionHeading
            center
            eyebrow="Galleri"
            title="Bilder fra lokalet"
          />
          <div className="mt-12 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
            {galleryImages.map((g) => (
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
        </div>
      </section>

      {/* Praktisk informasjon */}
      <section className="bg-warm">
        <div className="container-page py-20">
          <SectionHeading
            center
            eyebrow="Alt du trenger"
            title="Praktisk informasjon"
          />
          <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {practical.map((col) => (
              <div key={col.title}>
                <h3 className="text-lg text-accent">{col.title}</h3>
                <ul className="mt-3 space-y-2 text-sm text-ink-light">
                  {col.items.map((item) => (
                    <li key={item} className="flex gap-2">
                      <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      <CTASection
        eyebrow="Interessert i å leie?"
        title="Ta kontakt for en uforpliktende visning"
        text="Send oss en forespørsel om din ønskede dato, så hjelper vi deg videre."
        primary={{ label: 'Send forespørsel', to: '/foresporsel' }}
        secondary={{ label: 'Se kalender', to: '/kalender' }}
      />
    </>
  )
}
