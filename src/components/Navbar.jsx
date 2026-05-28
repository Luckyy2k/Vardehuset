import { useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { nav, site } from '../data/site'

function DesktopLinks() {
  return (
    <nav className="hidden items-stretch gap-6 lg:flex">
      {nav.map((group, i) => (
        <div key={group.group} className="flex items-center gap-6">
          {i > 0 && <span className="h-8 w-px bg-primary/10" aria-hidden="true" />}
          <div>
            <p className="mb-1 text-center text-[10px] font-semibold uppercase tracking-[0.18em] text-accent">
              {group.group}
            </p>
            <div className="flex gap-4">
              {group.links.map((link) => (
                <NavLink
                  key={link.to}
                  to={link.to}
                  end={link.to === '/'}
                  className={({ isActive }) =>
                    `text-sm transition-colors hover:text-accent ${
                      isActive ? 'font-medium text-accent' : 'text-ink-light'
                    }`
                  }
                >
                  {link.label}
                </NavLink>
              ))}
            </div>
          </div>
        </div>
      ))}
    </nav>
  )
}

export default function Navbar() {
  const [open, setOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 border-b border-primary/10 bg-white/90 backdrop-blur">
      <div className="container-page flex items-center justify-between gap-6 py-3">
        <Link to="/" className="flex flex-col leading-tight">
          <span className="text-base font-semibold text-primary">
            {site.name}
          </span>
          <span className="text-xs uppercase tracking-[0.2em] text-accent">
            {site.shortName}
          </span>
        </Link>

        <DesktopLinks />

        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className="rounded-md p-2 text-primary lg:hidden"
          aria-label="Meny"
          aria-expanded={open}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            {open ? (
              <path d="M6 6l12 12M18 6L6 18" strokeLinecap="round" />
            ) : (
              <path d="M4 7h16M4 12h16M4 17h16" strokeLinecap="round" />
            )}
          </svg>
        </button>
      </div>

      {open && (
        <div className="border-t border-primary/10 bg-white lg:hidden">
          <div className="container-page space-y-5 py-5">
            {nav.map((group) => (
              <div key={group.group}>
                <p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.18em] text-accent">
                  {group.group}
                </p>
                <div className="flex flex-col">
                  {group.links.map((link) => (
                    <NavLink
                      key={link.to}
                      to={link.to}
                      end={link.to === '/'}
                      onClick={() => setOpen(false)}
                      className={({ isActive }) =>
                        `border-b border-primary/5 py-2 text-sm ${
                          isActive ? 'font-medium text-accent' : 'text-ink'
                        }`
                      }
                    >
                      {link.label}
                    </NavLink>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </header>
  )
}
