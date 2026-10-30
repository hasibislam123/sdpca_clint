import { Link } from 'react-router-dom'

const variantClass = {
  primary: 'btn-primary',
  secondary: 'btn-secondary',
  outline: 'btn-outline border-primary/30 text-primary hover:bg-primary hover:text-primary-content',
  ghost: 'btn-ghost text-primary hover:bg-primary/10',
  light: 'btn-soft bg-base-100 text-primary shadow-sm hover:bg-base-200',
  // The navy bands — hero, page headers, footer — stay navy in both themes, so a button sitting on one
  // needs a light face in dark mode too. `light` follows the theme and would vanish there.
  onNavy: 'btn-soft bg-mist text-navy shadow-sm hover:bg-white',
}

const sizeClass = {
  sm: 'btn-sm',
  md: '',
  lg: 'btn-lg',
}

export default function Button({
  children,
  to,
  href,
  variant = 'primary',
  size = 'md',
  className = '',
  ...rest
}) {
  const classes = ['btn font-medium', variantClass[variant], sizeClass[size], className]
    .filter(Boolean)
    .join(' ')

  if (to) {
    return (
      <Link to={to} className={classes} {...rest}>
        {children}
      </Link>
    )
  }

  if (href) {
    return (
      <a href={href} className={classes} {...rest}>
        {children}
      </a>
    )
  }

  return (
    <button className={classes} {...rest}>
      {children}
    </button>
  )
}
