import { useState } from 'react'
import { Link } from 'react-router-dom'
import { supabase, isSupabaseConfigured } from '../../lib/supabase'
import { useSession } from '../../lib/useSession'
import Login from './Login'
import InquiriesAdmin from './InquiriesAdmin'
import CollectionAdmin from './CollectionAdmin'
import MembersAdmin from './MembersAdmin'
import ContentAdmin from './ContentAdmin'
import AccountAdmin from './AccountAdmin'

const SECTIONS = [
  { key: 'foresporsler', label: 'Forespørsler' },
  { key: 'tekster', label: 'Tekster' },
  { key: 'konserter', label: 'Konserter' },
  { key: 'styret', label: 'Styret' },
  { key: 'sponsorer', label: 'Sponsorer' },
  { key: 'medlemmer', label: 'Medlemmer' },
  { key: 'konto', label: 'Konto' },
]

function Section({ active }) {
  switch (active) {
    case 'foresporsler':
      return <InquiriesAdmin />
    case 'tekster':
      return <ContentAdmin />
    case 'konserter':
      return (
        <CollectionAdmin
          table="concerts"
          title="Konserter"
          orderBy="date"
          fields={[
            { key: 'title', label: 'Tittel' },
            { key: 'date', label: 'Dato', type: 'date' },
            { key: 'venue', label: 'Sted' },
            { key: 'doors', label: 'Dørene åpner (f.eks. kl. 18:30)' },
            { key: 'start_time', label: 'Konserten starter (f.eks. kl. 19:00)' },
            { key: 'description', label: 'Beskrivelse', type: 'textarea' },
            { key: 'ticket_url', label: 'Billettlink (valgfri)' },
            { key: 'ticket_label', label: 'Tekst på billettknapp (standard: Bestill billett her)' },
            { key: 'article_url', label: 'Artikkellink, f.eks. omtale hos Bypatrioten (valgfri)' },
            { key: 'article_label', label: 'Tekst på artikkellenke (standard: Les omtalen)' },
            { key: 'image', label: 'Bilde', type: 'image', folder: 'konserter' },
          ]}
        />
      )
    case 'styret':
      return (
        <CollectionAdmin
          table="board_members"
          title="Styret"
          fields={[
            { key: 'name', label: 'Navn' },
            { key: 'role', label: 'Rolle' },
            { key: 'phone', label: 'Telefon' },
          ]}
        />
      )
    case 'sponsorer':
      return (
        <CollectionAdmin
          table="sponsors"
          title="Sponsorer"
          fields={[{ key: 'name', label: 'Navn' }]}
        />
      )
    case 'medlemmer':
      return <MembersAdmin />
    case 'konto':
      return <AccountAdmin />
    default:
      return null
  }
}

export default function Admin() {
  const { session, loading } = useSession()
  const [active, setActive] = useState('foresporsler')

  if (!isSupabaseConfigured) {
    return (
      <div className="grid min-h-svh place-items-center bg-warm px-5 text-center">
        <div>
          <h1 className="text-2xl">Admin er ikke tilgjengelig</h1>
          <p className="mt-3 text-ink-light">
            Supabase er ikke konfigurert. Legg inn miljøvariabler for å bruke admin.
          </p>
          <Link to="/" className="mt-6 inline-block text-accent hover:underline">
            Til forsiden
          </Link>
        </div>
      </div>
    )
  }

  if (loading)
    return <div className="grid min-h-svh place-items-center text-ink-light">Laster…</div>

  if (!session) return <Login />

  return (
    <div className="min-h-svh bg-warm">
      <header className="border-b border-primary/10 bg-white">
        <div className="container-page flex items-center justify-between py-4">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-accent">Admin</p>
            <p className="font-semibold text-primary">Kulturhuset Varde</p>
          </div>
          <div className="flex items-center gap-4 text-sm">
            <Link to="/" className="text-ink-light hover:text-accent">
              Se nettsiden
            </Link>
            <button
              onClick={() => supabase.auth.signOut()}
              className="rounded-full border border-primary/20 px-4 py-1.5 text-primary hover:bg-warm"
            >
              Logg ut
            </button>
          </div>
        </div>
      </header>

      <div className="container-page grid gap-8 py-10 lg:grid-cols-[200px_1fr]">
        <nav className="flex gap-2 overflow-x-auto lg:flex-col">
          {SECTIONS.map((s) => (
            <button
              key={s.key}
              onClick={() => setActive(s.key)}
              className={`whitespace-nowrap rounded-lg px-4 py-2 text-left text-sm transition ${
                active === s.key
                  ? 'bg-accent text-white'
                  : 'text-ink-light hover:bg-white'
              }`}
            >
              {s.label}
            </button>
          ))}
        </nav>
        <div>
          <Section active={active} />
        </div>
      </div>
    </div>
  )
}
