import Button from '../components/Button'

export default function NotFound() {
  return (
    <section className="grid min-h-[60vh] place-items-center bg-warm">
      <div className="container-page text-center">
        <p className="eyebrow">404</p>
        <h1 className="mt-3 text-4xl">Siden finnes ikke</h1>
        <p className="mt-4 text-ink-light">
          Vi fant dessverre ikke siden du lette etter.
        </p>
        <div className="mt-8">
          <Button to="/" variant="primary">
            Til forsiden
          </Button>
        </div>
      </div>
    </section>
  )
}
