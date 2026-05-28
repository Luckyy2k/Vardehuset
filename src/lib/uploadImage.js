import { supabase } from './supabase'

const BUCKET = 'media'

// Laster opp en fil til Supabase Storage og returnerer offentlig URL.
export async function uploadImage(file, folder = 'uploads') {
  const ext = file.name.includes('.') ? file.name.split('.').pop() : 'jpg'
  const safeExt = ext.toLowerCase().replace(/[^a-z0-9]/g, '') || 'jpg'
  const path = `${folder}/${crypto.randomUUID()}.${safeExt}`

  const { error } = await supabase.storage.from(BUCKET).upload(path, file, {
    cacheControl: '3600',
    upsert: false,
    contentType: file.type || undefined,
  })
  if (error) throw error

  const { data } = supabase.storage.from(BUCKET).getPublicUrl(path)
  return data.publicUrl
}
