import { Link } from 'react-router-dom'
import { Icon } from './Icon'
import useLanguage from '../../hook/useLanguage'

export default function PageHeader({ title, description, breadcrumb = [] }) {
  const { t } = useLanguage()

  return (
    <header className="border-b border-base-300 bg-primary text-primary-content">
      <div className="mx-auto w-full max-w-6xl px-4 py-12 sm:px-6 sm:py-16">
        <nav aria-label="Breadcrumb" className="mb-3 flex flex-wrap items-center gap-1.5 text-xs text-primary-content/70">
          <Link to="/" className="transition hover:text-primary-content">
            {t('common.home')}
          </Link>
          {breadcrumb.map((item) => (
            <span key={item.label} className="flex items-center gap-1.5">
              <Icon name="arrowRight" className="h-3 w-3" />
              {item.to ? (
                <Link to={item.to} className="transition hover:text-primary-content">
                  {item.label}
                </Link>
              ) : (
                <span aria-current="page" className="text-primary-content">
                  {item.label}
                </span>
              )}
            </span>
          ))}
        </nav>
        <h1 className="text-2xl leading-snug sm:text-4xl">{title}</h1>
        {description && <p className="mt-3 max-w-2xl text-sm leading-relaxed text-primary-content/80 sm:text-base">{description}</p>}
      </div>
    </header>
  )
}
