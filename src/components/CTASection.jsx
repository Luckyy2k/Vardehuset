import Button from './Button'

export default function CTASection({
  eyebrow,
  title,
  text,
  primary,
  secondary,
}) {
  return (
    <section className="bg-primary">
      <div className="container-page py-20 text-center sm:py-24">
        {eyebrow && (
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent-light">
            {eyebrow}
          </p>
        )}
        <h2 className="mx-auto mt-4 max-w-2xl text-3xl text-white sm:text-4xl">
          {title}
        </h2>
        {text && <p className="mx-auto mt-4 max-w-xl text-white/70">{text}</p>}
        <div className="mt-8 flex flex-wrap justify-center gap-4">
          {primary && (
            <Button to={primary.to} href={primary.href} variant="light">
              {primary.label}
            </Button>
          )}
          {secondary && (
            <Button to={secondary.to} href={secondary.href} variant="outline">
              {secondary.label}
            </Button>
          )}
        </div>
      </div>
    </section>
  )
}
