import PageHero from '../components/PageHero'
import { useCollection } from '../lib/useCollection'
import { members as fallback, voiceGroups } from '../data/members'

const order = ['Dirigent', '1T', '2T', '1B', '2B']

function MemberCard({ member }) {
  const roles = (member.role || '')
    .split(',')
    .map((r) => r.trim())
    .filter(Boolean)

  return (
    <figure className="group">
      <div className="aspect-square overflow-hidden rounded-2xl bg-primary/5">
        <img
          src={member.img}
          alt={member.name}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
      </div>
      <figcaption className="mt-2 text-center text-sm font-medium text-primary">
        {member.name}
      </figcaption>
      {roles.length > 0 && (
        <div className="mt-1 flex flex-wrap justify-center gap-1">
          {roles.map((r) => (
            <span
              key={r}
              className="rounded-full bg-accent/10 px-2 py-0.5 text-[11px] font-medium text-accent"
            >
              {r}
            </span>
          ))}
        </div>
      )}
    </figure>
  )
}

export default function Medlemmer() {
  const { data: members } = useCollection('members', fallback)

  const grouped = order
    .map((voice) => ({
      voice,
      label: voiceGroups[voice] ?? voice,
      list: members.filter((m) => m.voice === voice),
    }))
    .filter((g) => g.list.length > 0)

  return (
    <>
      <PageHero
        eyebrow="Mannskoret Varde"
        title="Våre medlemmer"
        intro="47 sangglade medlemmer fordelt på fire stemmegrupper, ledet av vår dirigent."
      />

      <section className="bg-white">
        <div className="container-page space-y-16 py-20">
          {grouped.map((group) => (
            <div key={group.voice}>
              <div className="mb-8 flex items-center gap-4">
                <h2 className="text-2xl text-primary">{group.label}</h2>
                <span className="h-px flex-1 bg-primary/10" />
                <span className="text-sm text-ink-light">
                  {group.list.length}{' '}
                  {group.list.length === 1 ? 'person' : 'personer'}
                </span>
              </div>
              <div className="grid grid-cols-2 gap-5 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
                {group.list.map((m) => (
                  <MemberCard key={m.id ?? m.name} member={m} />
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>
    </>
  )
}
