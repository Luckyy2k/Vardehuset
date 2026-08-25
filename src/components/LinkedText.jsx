// Viser tekst der nettadresser automatisk blir klikkbare lenker.
// Trygt: teksten settes inn som React-noder, ikke som rå HTML.

const URL_RE = /((?:https?:\/\/|www\.)[^\s]+)/gi
const TRAILING = /[.,;:!?)\]}"']+$/

const toHref = (raw) => (/^https?:\/\//i.test(raw) ? raw : `https://${raw}`)

export default function LinkedText({ text, className = '' }) {
  const parts = String(text ?? '').split(URL_RE)

  return (
    <p className={className}>
      {parts.map((part, i) => {
        if (!part) return null
        if (!/^(?:https?:\/\/|www\.)/i.test(part)) return <span key={i}>{part}</span>

        // Flytt etterfølgende tegnsetting utenfor selve lenken.
        const trail = part.match(TRAILING)?.[0] ?? ''
        const url = trail ? part.slice(0, -trail.length) : part

        return (
          <span key={i}>
            <a
              href={toHref(url)}
              target="_blank"
              rel="noreferrer noopener"
              className="font-medium text-accent underline underline-offset-2 hover:text-accent-light"
            >
              {url}
            </a>
            {trail}
          </span>
        )
      })}
    </p>
  )
}
