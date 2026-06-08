import { createContext, useContext } from 'react'
import { contentDefaults } from '../data/content'

// Kontekst med overstyrte sidetekster (key → value). Fylles av ContentProvider.
export const ContentContext = createContext({})

// Returnerer en oppslagsfunksjon t(key) som gir overstyrt tekst eller standard.
export function useContent() {
  const overrides = useContext(ContentContext)
  return (key) => overrides[key] ?? contentDefaults[key] ?? ''
}

// Deler en flerlinjes tekst inn i avsnitt (skilt med tomme linjer eller linjeskift).
export function paragraphs(text) {
  return String(text || '')
    .split(/\n{2,}|\n/)
    .map((p) => p.trim())
    .filter(Boolean)
}
