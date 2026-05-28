import { Link } from 'react-router-dom'
import { nav, site } from '../data/site'

const allLinks = nav.flatMap((g) => g.links)

export default function Footer() {
  return (
    <footer className="bg-primary text-white/70">
      <div className="container-page grid gap-10 py-14 sm:grid-cols-2 lg:grid-cols-3">
        <div>
          <p className="text-lg font-semibold text-white">{site.name}</p>
          <p className="mt-3 max-w-xs text-sm">{site.tagline}</p>
        </div>

        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-accent-light">
            Kontakt
          </p>
          <ul className="mt-3 space-y-1 text-sm">
            {site.contacts.map((c) => (
              <li key={c.name}>
                {c.name}:{' '}
                <a href={`tel:${c.phone.replace(/\s/g, '')}`} className="hover:text-white">
                  {c.phone}
                </a>
              </li>
            ))}
            <li>
              <a href={`mailto:${site.email}`} className="hover:text-white">
                {site.email}
              </a>
            </li>
            <li className="pt-2">
              {site.address.street}, {site.address.zip}
            </li>
          </ul>
        </div>

        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-accent-light">
            Snarveier
          </p>
          <ul className="mt-3 grid grid-cols-2 gap-x-6 gap-y-1 text-sm">
            {allLinks.map((link) => (
              <li key={link.to}>
                <Link to={link.to} className="hover:text-white">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="container-page py-5 text-center text-xs text-white/50">
          © {new Date().getFullYear()} {site.name}. Alle rettigheter reservert.
        </div>
      </div>
    </footer>
  )
}
