import { useEffect, useRef, useState } from 'react'

// Viser et PDF-dokument direkte på siden, side for side, som vanlig innhold.
// Sidene tegnes med pdf.js når de nærmer seg skjermen, så selv lange
// dokumenter laster raskt. Biblioteket hentes først når komponenten vises.
// Gi komponenten `key={src}` dersom kilden kan endres mens den er montert.
export default function PdfViewer({ src, title, downloadLabel = 'Last ned PDF' }) {
  const containerRef = useRef(null)
  const [doc, setDoc] = useState(null)
  const [numPages, setNumPages] = useState(0)
  const [ratio, setRatio] = useState(Math.SQRT2) // A4-forhold som startgjetning
  const [width, setWidth] = useState(0)
  const [current, setCurrent] = useState(1)
  const [status, setStatus] = useState('loading') // loading | ready | error

  // Last dokumentet
  useEffect(() => {
    let cancelled = false
    // Lastejobben eier dokumentet. I pdf.js v6 er det den som har destroy(),
    // ikke selve dokumentet, og den avbryter også en nedlasting som pågår.
    let task = null
    ;(async () => {
      try {
        const pdfjs = await import('pdfjs-dist')
        pdfjs.GlobalWorkerOptions.workerSrc = new URL(
          'pdfjs-dist/build/pdf.worker.min.mjs',
          import.meta.url,
        ).toString()
        if (cancelled) return
        task = pdfjs.getDocument({ url: src })
        const loaded = await task.promise
        if (cancelled) return
        const first = await loaded.getPage(1)
        const vp = first.getViewport({ scale: 1 })
        if (cancelled) return
        setRatio(vp.height / vp.width)
        setNumPages(loaded.numPages)
        setDoc(loaded)
        setStatus('ready')
      } catch {
        if (!cancelled) setStatus('error')
      }
    })()
    return () => {
      cancelled = true
      task?.destroy().catch(() => {})
    }
  }, [src])

  // Følg bredden på beholderen, så sidene alltid fyller tilgjengelig plass
  useEffect(() => {
    const el = containerRef.current
    if (!el) return
    const ro = new ResizeObserver(([entry]) => {
      setWidth(Math.floor(entry.contentRect.width))
    })
    ro.observe(el)
    return () => ro.disconnect()
  }, [])

  // Hold styr på hvilken side som er mest synlig
  useEffect(() => {
    const el = containerRef.current
    if (!el || !numPages) return
    const io = new IntersectionObserver(
      (entries) => {
        const best = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0]
        if (best) setCurrent(Number(best.target.dataset.page))
      },
      { rootMargin: '-40% 0px -40% 0px', threshold: [0, 0.25, 0.5, 0.75, 1] },
    )
    el.querySelectorAll('[data-page]').forEach((p) => io.observe(p))
    return () => io.disconnect()
  }, [numPages])

  function goTo(n) {
    const target = containerRef.current?.querySelector(`[data-page="${n}"]`)
    target?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  return (
    <div>
      {/* Verktøylinje: sidetall og nedlasting. Fester seg under toppmenyen. */}
      <div className="sticky top-[60px] z-10 mx-auto mb-6 flex max-w-4xl items-center justify-between gap-4 rounded-full border border-primary/10 bg-white/90 px-4 py-2 text-sm shadow-sm backdrop-blur lg:top-[96px]">
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => goTo(Math.max(1, current - 1))}
            disabled={status !== 'ready' || current <= 1}
            className="rounded-full p-1.5 text-primary hover:bg-primary/5 disabled:opacity-30"
            aria-label="Forrige side"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M15 6l-6 6 6 6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
          <span className="min-w-[7rem] text-center tabular-nums text-ink-light">
            {status === 'ready' ? `Side ${current} av ${numPages}` : status === 'loading' ? 'Laster…' : '—'}
          </span>
          <button
            type="button"
            onClick={() => goTo(Math.min(numPages, current + 1))}
            disabled={status !== 'ready' || current >= numPages}
            className="rounded-full p-1.5 text-primary hover:bg-primary/5 disabled:opacity-30"
            aria-label="Neste side"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M9 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </div>
        <a
          href={src}
          download
          target="_blank"
          rel="noreferrer"
          className="whitespace-nowrap font-medium text-accent hover:underline"
        >
          {downloadLabel}
        </a>
      </div>

      <div ref={containerRef} className="mx-auto max-w-4xl space-y-6">
        {status === 'error' && (
          <div className="rounded-2xl border border-primary/10 bg-white p-8 text-center text-ink-light">
            <p>Dokumentet kunne ikke vises her.</p>
            <a href={src} target="_blank" rel="noreferrer" className="mt-2 inline-block text-accent hover:underline">
              Åpne PDF i ny fane
            </a>
          </div>
        )}

        {status === 'loading' && (
          <div
            className="animate-pulse rounded-2xl border border-primary/10 bg-white shadow-sm"
            style={{ aspectRatio: `1 / ${ratio}` }}
            aria-hidden="true"
          />
        )}

        {doc &&
          Array.from({ length: numPages }, (_, i) => (
            <Page key={i + 1} doc={doc} number={i + 1} width={width} ratio={ratio} title={title} />
          ))}
      </div>
    </div>
  )
}

function Page({ doc, number, width, ratio, title }) {
  const ref = useRef(null)
  const canvasRef = useRef(null)
  const [near, setNear] = useState(false)
  const [rendered, setRendered] = useState(false)

  // Begynn å tegne først når siden nærmer seg skjermen
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setNear(true)
          io.disconnect()
        }
      },
      { rootMargin: '800px 0px' },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [])

  useEffect(() => {
    if (!near || !doc || !width) return
    let cancelled = false
    let task = null
    ;(async () => {
      try {
        const page = await doc.getPage(number)
        if (cancelled) return
        const base = page.getViewport({ scale: 1 })
        const viewport = page.getViewport({ scale: width / base.width })
        const dpr = Math.min(window.devicePixelRatio || 1, 2)
        const canvas = canvasRef.current
        if (!canvas) return
        canvas.width = Math.floor(viewport.width * dpr)
        canvas.height = Math.floor(viewport.height * dpr)
        canvas.style.width = `${Math.floor(viewport.width)}px`
        canvas.style.height = `${Math.floor(viewport.height)}px`
        const ctx = canvas.getContext('2d')
        task = page.render({
          canvas,
          canvasContext: ctx,
          viewport,
          transform: dpr !== 1 ? [dpr, 0, 0, dpr, 0, 0] : undefined,
        })
        await task.promise
        if (!cancelled) setRendered(true)
      } catch {
        // Avbrutt tegning (f.eks. ved endret bredde) er forventet og ignoreres.
      }
    })()
    return () => {
      cancelled = true
      task?.cancel()
    }
  }, [near, doc, number, width])

  return (
    <div
      ref={ref}
      data-page={number}
      className="scroll-mt-[120px] overflow-hidden rounded-2xl border border-primary/10 bg-white shadow-sm lg:scroll-mt-[156px]"
      style={{ aspectRatio: `1 / ${ratio}` }}
    >
      <canvas
        ref={canvasRef}
        className={`block h-full w-full transition-opacity duration-300 ${rendered ? 'opacity-100' : 'opacity-0'}`}
        role="img"
        aria-label={`${title} – side ${number}`}
      />
    </div>
  )
}
