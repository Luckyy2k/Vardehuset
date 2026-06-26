// Krymper et bilde i nettleseren før opplasting: skalerer ned til maxSize på
// lengste side og re-koder som JPEG. Hopper over filer som ikke bør rasteres
// (SVG/GIF), og faller tilbake til originalen hvis noe feiler eller blir større.
export async function compressImage(file, { maxSize = 1400, quality = 0.8 } = {}) {
  if (
    !file.type?.startsWith('image/') ||
    file.type === 'image/svg+xml' ||
    file.type === 'image/gif'
  ) {
    return file
  }

  try {
    const bitmap = await createImageBitmap(file, { imageOrientation: 'from-image' })
    const scale = Math.min(1, maxSize / Math.max(bitmap.width, bitmap.height))
    const w = Math.round(bitmap.width * scale)
    const h = Math.round(bitmap.height * scale)

    const canvas = document.createElement('canvas')
    canvas.width = w
    canvas.height = h
    canvas.getContext('2d').drawImage(bitmap, 0, 0, w, h)
    bitmap.close?.()

    const blob = await new Promise((resolve) =>
      canvas.toBlob(resolve, 'image/jpeg', quality),
    )
    // Behold originalen hvis komprimering feilet eller ikke ga noe mindre.
    if (!blob || blob.size >= file.size) return file

    const name = file.name.replace(/\.[^.]+$/, '') + '.jpg'
    return new File([blob], name, { type: 'image/jpeg' })
  } catch {
    return file // beste forsøk – last opp originalen
  }
}
