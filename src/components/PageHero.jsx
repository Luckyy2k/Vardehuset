export default function PageHero({ eyebrow, title, intro }) {
  return (
    <section className="bg-gradient-to-br from-primary to-accent">
      <div className="container-page py-20 text-center sm:py-28">
        {eyebrow && (
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent-light">
            {eyebrow}
          </p>
        )}
        <h1 className="mt-4 text-4xl text-white sm:text-5xl">{title}</h1>
        {intro && (
          <p className="mx-auto mt-5 max-w-2xl text-lg text-white/75">{intro}</p>
        )}
      </div>
    </section>
  )
}
