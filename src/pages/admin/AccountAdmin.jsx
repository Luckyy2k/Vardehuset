import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabase'

const inputClass =
  'mt-1 w-full rounded-lg border border-primary/15 px-3 py-2 text-sm outline-none focus:border-accent focus:ring-2 focus:ring-accent/20'

export default function AccountAdmin() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [done, setDone] = useState(false)

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setEmail(data.user?.email ?? ''))
  }, [])

  async function save(e) {
    e.preventDefault()
    setError('')
    setDone(false)

    if (password.length < 8) {
      setError('Passordet må være minst 8 tegn.')
      return
    }
    if (password !== confirm) {
      setError('Passordene er ikke like.')
      return
    }

    setSaving(true)
    const { error: err } = await supabase.auth.updateUser({ password })
    setSaving(false)
    if (err) {
      setError(err.message)
      return
    }
    setPassword('')
    setConfirm('')
    setDone(true)
  }

  return (
    <div>
      <h2 className="mb-1 text-2xl">Konto</h2>
      <p className="mb-6 text-sm text-ink-light">
        Du er innlogget som <span className="font-medium text-primary">{email}</span>.
      </p>

      <form onSubmit={save} className="max-w-sm rounded-2xl border border-primary/10 bg-white p-6">
        <h3 className="text-lg text-primary">Bytt passord</h3>
        <p className="mt-1 text-sm text-ink-light">
          Velg et passord dere husker (minst 8 tegn).
        </p>

        <label className="mt-4 block text-sm">
          <span className="font-medium text-primary">Nytt passord</span>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="new-password"
            className={inputClass}
          />
        </label>
        <label className="mt-4 block text-sm">
          <span className="font-medium text-primary">Gjenta passord</span>
          <input
            type="password"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            autoComplete="new-password"
            className={inputClass}
          />
        </label>

        {error && <p className="mt-4 text-sm text-red-600">{error}</p>}
        {done && <p className="mt-4 text-sm text-green-700">Passordet er endret ✓</p>}

        <button
          type="submit"
          disabled={saving || !password || !confirm}
          className="mt-6 rounded-full bg-accent px-5 py-2 text-sm font-medium text-white hover:bg-accent-light disabled:opacity-50"
        >
          {saving ? 'Lagrer…' : 'Lagre nytt passord'}
        </button>
      </form>
    </div>
  )
}
