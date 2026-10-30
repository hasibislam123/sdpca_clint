import { Link } from 'react-router-dom'
import Logo from '../ui/Logo'
import { Icon } from '../ui/Icon'
import useLanguage from '../../hook/useLanguage'
import { contact, footerGroups, legalLinks, telHref } from '../../config/site'

const Footer = () => {
  const { t, tNumber } = useLanguage()

  return (
    <footer className="border-t-2 border-t-gold bg-neutral text-neutral-content">
      <div className="mx-auto grid w-full max-w-6xl gap-10 px-4 py-14 sm:px-6 lg:grid-cols-[1.4fr_1fr_1fr_1fr]">
        <div className="flex flex-col gap-4">
          <Logo size="md" nameClassName="text-neutral-content" />
          <p className="max-w-sm text-sm leading-relaxed text-neutral-content/65">{t('school.blurb')}</p>
          <div className="flex flex-col gap-2 text-sm text-neutral-content/70">
            <p className="flex items-start gap-2">
              <Icon name="mapPin" className="mt-0.5 h-4 w-4 shrink-0" />
              <span>
                {t('school.addressLine1')}, {t('school.addressLine2')}
                <br />
                {t('school.district')} - {tNumber(t('school.postalCode'))}, {t('school.country')}
              </span>
            </p>
            <a href={telHref(contact.phone)} className="flex items-center gap-2 transition hover:text-neutral-content">
              <Icon name="phone" className="h-4 w-4 shrink-0" />
              {contact.phone}
            </a>
            <a href={`mailto:${contact.email}`} className="flex items-center gap-2 transition hover:text-neutral-content">
              <Icon name="mail" className="h-4 w-4 shrink-0" />
              {contact.email}
            </a>
          </div>
        </div>

        {footerGroups.map((group) => (
          <nav key={group.titleKey} aria-label={t(group.titleKey)} className="flex flex-col gap-3">
            <h6 className="text-sm font-semibold uppercase tracking-wide text-neutral-content">{t(group.titleKey)}</h6>
            <ul className="flex flex-col gap-2">
              {group.items.map((item) => (
                <li key={item.key}>
                  <Link to={item.to} className="text-sm text-neutral-content/65 transition hover:text-gold">
                    {t(item.key)}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        ))}
      </div>

      <div className="border-t border-neutral-content/10">
        <div className="mx-auto flex w-full max-w-6xl flex-col items-center justify-between gap-3 px-4 py-5 text-xs text-neutral-content/55 sm:flex-row sm:px-6">
          <p>{t('footer.copyright', { year: tNumber(new Date().getFullYear()), school: t('brand.name') })}</p>
          <div className="flex items-center gap-5">
            {legalLinks.map((link) => (
              <Link key={link.to} to={link.to} className="transition hover:text-neutral-content">
                {t(link.key)}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
