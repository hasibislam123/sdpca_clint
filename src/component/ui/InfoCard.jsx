import { Link } from 'react-router-dom'
import { Icon } from './Icon'
import useLanguage from '../../hook/useLanguage'

export default function InfoCard({ icon, title, description, to, href, meta, linkLabel, image, className = '' }) {
  const { t } = useLanguage()

  const body = (
    <>
      {image && <div className="mb-4 overflow-hidden rounded-box border border-base-300">{image}</div>}
      {icon && (
        <span className="mb-4 inline-flex h-11 w-11 items-center justify-center rounded-xl bg-primary/8 text-primary">
          <Icon name={icon} className="h-5 w-5" />
        </span>
      )}
      <h3 className="text-base font-semibold text-base-content">{title}</h3>
      {meta && <p className="mt-1 text-xs font-medium text-secondary">{meta}</p>}
      {description && (
        <p className="mt-2 text-sm leading-relaxed text-base-content/65">{description}</p>
      )}
      {(to || href) && (
        <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-primary">
          {linkLabel ?? t('common.details')}
          <Icon name="arrowRight" className="h-4 w-4" />
        </span>
      )}
    </>
  )

  const classes = `block rounded-box border border-base-300 bg-base-100 p-6 shadow-sm transition duration-200 hover:-translate-y-0.5 hover:border-primary/25 hover:shadow-md ${className}`

  if (to) {
    return (
      <Link to={to} className={classes}>
        {body}
      </Link>
    )
  }

  if (href) {
    return (
      <a href={href} className={classes}>
        {body}
      </a>
    )
  }

  return <div className={classes}>{body}</div>
}
