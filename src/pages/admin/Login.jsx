import { useState } from 'react'
import { supabase } from '../../lib/supabase'

const inputClass =
  'mt-1.5 w-full rounded-lg border border-primary/15 px-4 py-2.5 text-sm outline-none focus:border-accent focus:ring-2 focus:ring-accent/20'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    setLoading(true)
    setError('')
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) setError('Feil e-post eller passord.')
    setLoading(false)
  }

  return (
    <div className="grid min-h-svh place-items-center bg-warm px-5">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-sm rounded-2xl border border-primary/10 bg-white p-8 shadow-sm"
      >
        <p className="eyebrow">Kulturhuset Varde</p>
        <h1 className="mt-2 text-2xl">Admin – logg inn</h1>

        <label className="mt-6 block text-sm">
          <span className="font-medium text-primary">E-post</span>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={inputClass}
          />
        </label>
        <label className="mt-4 block text-sm">
          <span className="font-medium text-primary">Passord</span>
          <input
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className={inputClass}
          />
        </label>

        {error && <p className="mt-4 text-sm text-red-600">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="mt-6 w-full rounded-full bg-accent px-6 py-3 text-sm font-medium text-white transition hover:bg-accent-light disabled:opacity-60"
        >
          {loading ? 'Logger inn...' : 'Logg inn'}
        </button>
      </form>
    </div>
  )
}
