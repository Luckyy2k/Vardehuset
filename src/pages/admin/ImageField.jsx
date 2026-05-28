import { useRef, useState } from 'react'
import { uploadImage } from '../../lib/uploadImage'

export default function ImageField({ value, onChange, folder = 'uploads', shape = 'square' }) {
  const inputRef = useRef(null)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState('')

  async function handleFile(e) {
    const file = e.target.files?.[0]
    if (!file) return
    setUploading(true)
    setError('')
    try {
      const url = await uploadImage(file, folder)
      onChange(url)
    } catch (err) {
      setError(err.message || 'Opplasting feilet')
    } finally {
      setUploading(false)
      if (inputRef.current) inputRef.current.value = ''
    }
  }

  return (
    <div className="mt-1 flex items-center gap-4">
      <div
        className={`h-20 w-20 shrink-0 overflow-hidden bg-primary/5 ${
          shape === 'round' ? 'rounded-full' : 'rounded-lg'
        }`}
      >
        {value ? (
          <img src={value} alt="" className="h-full w-full object-cover" />
        ) : (
          <div className="grid h-full w-full place-items-center text-xs text-ink-light">
            Ingen
          </div>
        )}
      </div>

      <div className="space-y-2">
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          onChange={handleFile}
          disabled={uploading}
          className="block text-sm text-ink-light file:mr-3 file:rounded-full file:border-0 file:bg-accent file:px-4 file:py-1.5 file:text-sm file:font-medium file:text-white hover:file:bg-accent-light"
        />
        <div className="flex items-center gap-3 text-sm">
          {uploading && <span className="text-ink-light">Laster opp…</span>}
          {value && !uploading && (
            <button
              type="button"
              onClick={() => onChange('')}
              className="text-red-600 hover:underline"
            >
              Fjern bilde
            </button>
          )}
        </div>
        {error && <p className="text-sm text-red-600">{error}</p>}
      </div>
    </div>
  )
}
