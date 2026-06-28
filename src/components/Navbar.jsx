import { useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { nav } from '../data/site'

function GroupLinks({ group, onNavigate }) {
  return (
    <div className="px-6 py-2.5 text-center xl:px-9">
      <Link
        to={group.to}
        onClick={onNavigate}
        className="block text-base text-primary transition-colors hover:text-accent"
      >
        {group.group}
      </Link>
      <div className="mt-1.5 flex items-center justify-center gap-4 xl:gap-5">
        {group.links.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            end={link.to === '/'}
            onClick={onNavigate}
            className={({ isActive }) =>
              `whitespace-nowrap text-sm transition-colors hover:text-accent ${
                isActive ? 'font-medium text-accent' : 'text-ink-light'
              }`
            }
          >
            {link.label}
          </NavLink>
        ))}
      </div>
    </div>
  )
}

export default function Navbar() {
  const [open, setOpen] = useState(false)

  return (
    <header className="fixed inset-x-0 top-0 z-50 bg-white/85 shadow-sm backdrop-blur">
      <div className="container-page">
        {/* Desktop: to nøyaktig like halvdeler rundt en sentrert skillestrek */}
        <div className="hidden items-stretch lg:grid lg:grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)]">
          <div className="flex justify-end">
            <GroupLinks group={nav[0]} />
          </div>
          <span className="my-3 w-px self-stretch bg-primary/15" aria-hidden="true" />
          <div className="flex justify-start">
            <GroupLinks group={nav[1]} />
          </div>
        </div>

        {/* Mobil: kompakt bar + meny */}
        <div className="lg:hidden">
          <div className="flex items-center justify-between gap-4 py-3">
            <Link to="/" onClick={() => setOpen(false)} className="font-semibold text-primary">
              Vardehuset
            </Link>
            <button
              type="button"
              onClick={() => setOpen((v) => !v)}
              className="rounded-md p-1 text-primary"
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
            <div className="space-y-5 pb-5">
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
          )}
        </div>
      </div>
    </header>
  )
}
