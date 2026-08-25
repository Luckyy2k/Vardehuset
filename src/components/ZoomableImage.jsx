import { useState } from 'react'
import Lightbox from './Lightbox'

// Bilde som kan klikkes for å vises stort (lightbox).
// `className` gjelder rammen rundt (f.eks. størrelsesforhold og hjørner),
// `imgClassName` gjelder selve bildet.
export default function ZoomableImage({
  src,
  alt = '',
  className = '',
  imgClassName = 'h-full w-full object-cover',
  loading = 'lazy',
}) {
  const [zoomed, setZoomed] = useState(false)
  if (!src) return null

  return (
    <>
      <button
        type="button"
        onClick={() => setZoomed(true)}
        aria-label={alt ? `Vis bilde i full størrelse: ${alt}` : 'Vis bilde i full størrelse'}
        className={`block w-full cursor-zoom-in ${className}`}
      >
        <img src={src} alt={alt} loading={loading} decoding="async" className={imgClassName} />
      </button>
      {zoomed && <Lightbox src={src} alt={alt} onClose={() => setZoomed(false)} />}
    </>
  )
}
