import { Component } from 'react'

// Fanger feil under visning, slik at en feil på én side ikke gjør hele
// nettsiden hvit. Gi den `key` lik stien, så den nullstilles ved navigering.
export default class ErrorBoundary extends Component {
  state = { error: null }

  static getDerivedStateFromError(error) {
    return { error }
  }

  componentDidCatch(error) {
    // Etter en ny publisering kan gamle filer mangle. Last siden på nytt én gang.
    const stale = /dynamically imported module|Importing a module script failed|Loading chunk/i.test(
      String(error?.message),
    )
    if (stale) {
      try {
        if (!sessionStorage.getItem('reloaded-after-deploy')) {
          sessionStorage.setItem('reloaded-after-deploy', '1')
          window.location.reload()
        }
      } catch {
        // Lagring kan være blokkert. Da vises feilmeldingen under i stedet.
      }
    }
    console.error(error)
  }

  render() {
    if (!this.state.error) return this.props.children
    return (
      <div className="container-page py-32 text-center">
        <h1 className="text-2xl text-primary">Noe gikk galt</h1>
        <p className="mt-3 text-ink-light">Siden kunne ikke vises. Prøv å laste den inn på nytt.</p>
        <button
          type="button"
          onClick={() => window.location.reload()}
          className="mt-6 rounded-full bg-accent px-6 py-3 text-sm font-medium text-white hover:bg-accent-light"
        >
          Last inn på nytt
        </button>
      </div>
    )
  }
}
