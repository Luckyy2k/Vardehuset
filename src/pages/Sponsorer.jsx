import PageHero from '../components/PageHero'
import SectionHeading from '../components/SectionHeading'
import { useCollection } from '../lib/useCollection'
import { sponsors as fallback, history } from '../data/sponsors'

export default function Sponsorer() {
  const { data: sponsors } = useCollection('sponsors', fallback, {
    orderBy: { column: 'id', ascending: true },
  })

  return (
    <>
      <PageHero
        eyebrow="Tusen takk"
        title="Våre sponsorer"
        intro="Kulturhuset Varde hadde ikke vært mulig uten våre fantastiske støttespillere."
      />

      {/* Historie */}
      <section className="bg-white">
        <div className="container-page grid items-center gap-12 py-20 lg:grid-cols-2">
          <div>
            <SectionHeading eyebrow="Historien" title={history.title} />
            <div className="mt-6 space-y-4 text-ink-light">
              {history.paragraphs.map((p, i) => (
                <p key={i}>{p}</p>
              ))}
            </div>
          </div>
          <div className="overflow-hidden rounded-2xl shadow-sm">
            <img
              src="/images/historie/spadestikket.jpg"
              alt="Byggestart – Kulturhuset Varde"
              className="aspect-[4/3] w-full object-cover"
            />
          </div>
        </div>
      </section>

      {/* Sponsorer */}
      <section className="bg-warm">
        <div className="container-page py-20">
          <SectionHeading
            center
            eyebrow="En stor takk"
            title="Disse støttespillerne har bidratt"
            intro="Sammen har de gjort Kulturhuset Varde til virkelighet."
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
