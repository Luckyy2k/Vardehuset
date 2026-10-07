import { useRef, useState } from 'react'
import { uploadFile } from '../../lib/uploadImage'

const MAX_MB = 50

// Opplasting av PDF-dokument. Verdien er den offentlige URL-en til filen.
export default function FileField({ value, onChange, folder = 'uploads' }) {
  const inputRef = useRef(null)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState('')

  async function handleFile(e) {
    const file = e.target.files?.[0]
    if (!file) return
    setError('')
    if (file.type !== 'application/pdf') {
      setError('Filen må være en PDF.')
    } else if (file.size > MAX_MB * 1024 * 1024) {
      setError(`Filen er for stor (maks ${MAX_MB} MB).`)
    } else {
      setUploading(true)
      try {
        onChange(await uploadFile(file, folder))
      } catch (err) {
        setError(err.message || 'Opplasting feilet')
      } finally {
        setUploading(false)
      }
    }
    if (inputRef.current) inputRef.current.value = ''
  }

  return (
    <div className="mt-1 space-y-2">
      <input
        ref={inputRef}
        type="file"
        accept="application/pdf"
        onChange={handleFile}
        disabled={uploading}
        className="block text-sm text-ink-light file:mr-3 file:rounded-full file:border-0 file:bg-accent file:px-4 file:py-1.5 file:text-sm file:font-medium file:text-white hover:file:bg-accent-light"
      />
      <div className="flex items-center gap-3 text-sm">
        {uploading && <span className="text-ink-light">Laster opp…</span>}
        {value && !uploading && (
          <>
            <a
              href={value}
              target="_blank"
              rel="noreferrer"
              className="text-accent hover:underline"
            >
              Åpne dokumentet
            </a>
            <button
              type="button"
              onClick={() => onChange('')}
              className="text-red-600 hover:underline"
            >
              Fjern dokument
            </button>
          </>
        )}
        {!value && !uploading && <span className="text-ink-light">Ingen PDF lastet opp</span>}
      </div>
      {error && <p className="text-sm text-red-600">{error}</p>}
    </div>
  )
}
