import { Link } from 'react-router-dom'
import Button from '../component/ui/Button'
import { Icon } from '../component/ui/Icon'
import useLanguage from '../hook/useLanguage'
import { navLinks } from '../config/site'

export default function NotFound() {
  const { t, tNumber } = useLanguage()

  return (
    <section className="bg-base-100">
      <div className="mx-auto flex w-full max-w-2xl flex-col items-center gap-5 px-4 py-20 text-center sm:py-28">
        <span className="inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/8 text-primary">
          <Icon name="search" className="h-8 w-8" />
        </span>
        <p className="text-5xl font-semibold text-primary sm:text-6xl">{tNumber(404)}</p>
        <h1 className="text-2xl sm:text-3xl">{t('notFound.heading')}</h1>
        <p className="max-w-md text-sm leading-relaxed text-base-content/65">{t('notFound.description')}</p>
        <div className="flex flex-wrap justify-center gap-3 pt-2">
          <Button to="/">{t('notFound.backHome')}</Button>
          <Button to="/admission" variant="outline">
            {t('notFound.admission')}
          </Button>
        </div>
        <ul className="flex flex-wrap justify-center gap-x-5 gap-y-2 pt-4 text-sm text-base-content/55">
          {navLinks.slice(1).map((link) => (
            <li key={link.to}>
              <Link to={link.to} className="transition hover:text-primary">
                {t(link.key)}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
