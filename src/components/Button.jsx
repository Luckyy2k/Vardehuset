import { Link } from 'react-router-dom'

const styles = {
  primary: 'bg-accent text-white hover:bg-accent-light',
  light: 'bg-white text-primary hover:bg-warm',
  outline: 'border border-white/40 text-white hover:bg-white/10',
  outlineDark: 'border border-primary/20 text-primary hover:bg-primary/5',
}

const base =
  'inline-flex items-center justify-center gap-2 rounded-full px-6 py-3 text-sm font-medium transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2'

export default function Button({
  to,
  href,
  variant = 'primary',
  className = '',
  children,
  ...props
}) {
  const cls = `${base} ${styles[variant]} ${className}`
  if (to) {
    return (
      <Link to={to} className={cls} {...props}>
        {children}
      </Link>
    )
  }
  if (href) {
    return (
      <a href={href} className={cls} {...props}>
        {children}
      </a>
    )
  }
  return (
    <button className={cls} {...props}>
      {children}
    </button>
  )
}
