import { useEffect, useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { nav } from '../data/site'

function GroupLinks({ group, onNavigate, light }) {
  return (
    <div className="px-6 py-2.5 text-center xl:px-9">
      <Link
        to={group.to}
        onClick={onNavigate}
        className={`block text-base transition-colors duration-500 ${
          light ? 'text-white hover:text-white/80' : 'text-primary hover:text-accent'
        }`}
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
              `whitespace-nowrap text-sm transition-colors duration-500 ${
                light
                  ? isActive
                    ? 'font-medium text-white'
                    : 'text-white/75 hover:text-white'
                  : isActive
                    ? 'font-medium text-accent'
                    : 'text-ink-light hover:text-accent'
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

// Pille-overflaten (bakgrunn/skygge/blur) som krysstoner mellom usynlig og synlig.
const pillSurface =
  'bg-[#e8e8ed]/95 shadow-xl ring-1 ring-black/5 backdrop-blur'
const transparentSurface = 'bg-transparent shadow-none ring-0 backdrop-blur-0'
const surfaceTransition =
  'transition-[background-color,box-shadow,backdrop-filter] duration-500 ease-out'

export default function Navbar() {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const { pathname } = useLocation()

  // Bare forsiden har det store bilde-heroet headeren skal ligge usynlig oppå.
  const overHero = pathname === '/'

  useEffect(() => {
    // På sider uten hero er expanded uansett false (se under), så vi trenger
    // bare scroll-lytteren på forsiden.
    if (!overHero) return
    // Bytt til pill når man har scrollet forbi (nesten) hele hero-bildet.
    const onScroll = () => setScrolled(window.scrollY > window.innerHeight * 0.7)
    window.addEventListener('scroll', onScroll, { passive: true })
    // Sett riktig starttilstand asynkront (unngår synkron setState i effekt).
    const raf = requestAnimationFrame(onScroll)
    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('scroll', onScroll)
    }
  }, [overHero])

  const expanded = overHero && !scrolled // gjennomsiktig, lys tekst, øverst på forsiden
  const light = expanded && !open // åpen mobilmeny bruker mørk tekst mot hvit panel-bakgrunn
  const desktopSurface = expanded ? transparentSurface : pillSurface

  return (
    <header className="pointer-events-none fixed inset-x-0 top-0 z-50">
      <div className="container-page py-4">
        {/* Desktop: sentrert nav som krysstoner mellom usynlig og pill */}
        <div
          className={`pointer-events-auto mx-auto hidden w-fit items-stretch rounded-full px-2 lg:flex ${surfaceTransition} ${desktopSurface}`}
        >
          <GroupLinks group={nav[0]} light={light} />
          <span
            className={`my-3 w-px self-stretch transition-colors duration-500 ${
              light ? 'bg-white/30' : 'bg-primary/15'
            }`}
            aria-hidden="true"
          />
          <GroupLinks group={nav[1]} light={light} />
        </div>

        {/* Mobil: kompakt bar + meny */}
        <div className="lg:hidden">
          <div
            className={`pointer-events-auto flex items-center justify-between gap-4 rounded-full px-5 py-3 ${surfaceTransition} ${
              open ? pillSurface : desktopSurface
            }`}
          >
            <Link
              to="/"
              onClick={() => setOpen(false)}
              className={`font-semibold transition-colors duration-500 ${
                light ? 'text-white' : 'text-primary'
              }`}
            >
              Vardehuset
            </Link>
            <button
              type="button"
              onClick={() => setOpen((v) => !v)}
              className={`rounded-md p-1 transition-colors duration-500 ${
                light ? 'text-white' : 'text-primary'
              }`}
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
      </div>
    </header>
  )
}
