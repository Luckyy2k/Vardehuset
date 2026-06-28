import { useEffect, useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { nav } from '../data/site'

function GroupLinks({ group, onNavigate }) {
  return (
    <div className="px-6 py-2.5 text-center xl:px-9">
      <Link
        to={group.to}
        onClick={onNavigate}
        className="block text-lg text-primary transition-colors hover:text-accent"
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
              `whitespace-nowrap text-base transition-colors hover:text-accent ${
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

// Bredden styres via header-padding (ikke max-width), så overgangen blir myk:
// øverst padding 0 → full bredde, scrollet → sentrert til 72rem (= container-page).
const pillPadding = 'max(1.25rem, calc((100% - 72rem) / 2))'

const surfaceTransition =
  'transition-[background-color,box-shadow,border-radius,backdrop-filter] duration-500 ease-out'

export default function Navbar() {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    window.addEventListener('scroll', onScroll, { passive: true })
    // Sett riktig starttilstand asynkront (unngår synkron setState i effekt).
    const raf = requestAnimationFrame(onScroll)
    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('scroll', onScroll)
    }
  }, [])

  const expanded = !scrolled // helt øverst: full bredde, frostet hvit bar

  return (
    <header
      className="pointer-events-none fixed inset-x-0 top-0 z-50 transition-[padding] duration-500 ease-out"
      style={{
        paddingLeft: expanded ? '0px' : pillPadding,
        paddingRight: expanded ? '0px' : pillPadding,
        paddingTop: expanded ? '0px' : '0.75rem',
      }}
    >
      {/* Desktop: full-bredde bar øverst → avlang pill når man scroller */}
      <div
        className={`pointer-events-auto hidden items-stretch justify-center px-2 lg:flex ${surfaceTransition} ${
          expanded
            ? 'rounded-none bg-white/60 shadow-none backdrop-blur-md'
            : 'rounded-full bg-white/85 shadow-xl ring-1 ring-black/5 backdrop-blur-xl'
        }`}
      >
        <GroupLinks group={nav[0]} />
        <span className="my-3 w-px self-stretch bg-primary/15" aria-hidden="true" />
        <GroupLinks group={nav[1]} />
      </div>

      {/* Mobil: kompakt bar + meny */}
      <div className="lg:hidden">
        <div
          className={`pointer-events-auto flex items-center justify-between gap-4 px-5 py-3 ${surfaceTransition} ${
            expanded && !open
              ? 'rounded-none bg-white/60 shadow-none backdrop-blur-md'
              : 'rounded-full bg-white/85 shadow-xl ring-1 ring-black/5 backdrop-blur-xl'
          }`}
        >
          <Link to="/" onClick={() => setOpen(false)} className="text-lg font-semibold text-primary">
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
          <div className="pointer-events-auto mt-2 space-y-5 rounded-2xl bg-white p-5 shadow-xl ring-1 ring-black/5">
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
    </header>
  )
}
