export default function SectionHeading({ eyebrow, title, intro, center, light }) {
  return (
    <div className={`${center ? 'mx-auto max-w-2xl text-center' : 'max-w-2xl'}`}>
      {eyebrow && <p className="eyebrow">{eyebrow}</p>}
      <h2
        className={`mt-3 text-3xl sm:text-4xl ${light ? 'text-white' : ''}`}
      >
        {title}
      </h2>
      {intro && (
        <p className={`mt-4 text-lg ${light ? 'text-white/70' : 'text-ink-light'}`}>
          {intro}
        </p>
      )}
    </div>
  )
}
