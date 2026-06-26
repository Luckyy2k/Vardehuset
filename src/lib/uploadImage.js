import { supabase } from './supabase'
import { compressImage } from './compressImage'

const BUCKET = 'media'

// Laster opp en fil til Supabase Storage og returnerer offentlig URL.
// Bildet komprimeres i nettleseren først, så galleriene holder seg raske.
export async function uploadImage(file, folder = 'uploads') {
  const upload = await compressImage(file)
  const ext = upload.name.includes('.') ? upload.name.split('.').pop() : 'jpg'
  const safeExt = ext.toLowerCase().replace(/[^a-z0-9]/g, '') || 'jpg'
  const path = `${folder}/${crypto.randomUUID()}.${safeExt}`

  const { error } = await supabase.storage.from(BUCKET).upload(path, upload, {
    cacheControl: '3600',
    upsert: false,
    contentType: upload.type || undefined,
  })
  if (error) throw error

  const { data } = supabase.storage.from(BUCKET).getPublicUrl(path)
  return data.publicUrl
}
