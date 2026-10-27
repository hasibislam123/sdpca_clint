import { useEffect, useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
import Logo from '../ui/Logo'
import Button from '../ui/Button'
import { Icon } from '../ui/Icon'
import LanguageSwitcher from '../ui/LanguageSwitcher'
import ThemeSwitcher from '../ui/ThemeSwitcher'
import AuthMenu from './AuthMenu'
import MobileNav from './MobileNav'
import useLanguage from '../../hook/useLanguage'
import { contact, navLinks, telHref } from '../../config/site'
import { applyPath } from '../../config/admission'

const linkBase = 'rounded-lg px-3 py-2 text-sm font-medium transition duration-200'

const Navbar = () => {
  const { t } = useLanguage()
  const [open, setOpen] = useState(false)
  const close = () => setOpen(false)

  const navClasses = ({ isActive }) =>
    `${linkBase} ${
      isActive ? 'bg-primary/10 text-primary' : 'text-base-content/70 hover:bg-base-200 hover:text-primary'
    }`

  useEffect(() => {
    const onKeyDown = (event) => {
      if (event.key === 'Escape') setOpen(false)
    }
    document.addEventListener('keydown', onKeyDown)
    return () => document.removeEventListener('keydown', onKeyDown)
  }, [])

  useEffect(() => {
    if (!open) return
    const { overflow } = document.body.style
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = overflow
    }
  }, [open])

  return (
    <header className="sticky top-0 z-50">
      <div className="hidden bg-primary text-primary-content lg:block">
        <div className="mx-auto flex w-full max-w-6xl items-center justify-between gap-6 px-4 py-2 text-xs sm:px-6">
          <p className="flex items-center gap-2 opacity-90">
            <Icon name="clock" className="h-3.5 w-3.5" />
            {t('school.officeHours')}
          </p>
          <div className="flex items-center gap-6">
            <a href={telHref(contact.phone)} className="flex items-center gap-2 opacity-90 transition hover:opacity-100">
              <Icon name="phone" className="h-3.5 w-3.5" />
              {contact.phone}
            </a>
            <a href={telHref(contact.phone1)} className="flex items-center gap-2 opacity-90 transition hover:opacity-100">
              <Icon name="phone" className="h-3.5 w-3.5" />
              {contact.phone1}
            </a>
            <a href={`mailto:${contact.email}`} className="flex items-center gap-2 opacity-90 transition hover:opacity-100">
              <Icon name="mail" className="h-3.5 w-3.5" />
              {contact.email}
            </a>
          </div>
        </div>
      </div>

      <div className="navbar border-b border-base-300 bg-base-100 shadow-sm">
        <div className="navbar-start">
          <Link to="/" aria-label={t('nav.logoAria', { school: t('brand.name') })} className="flex items-center">
            <Logo size="sm" nameClassName="max-lg:hidden" />
          </Link>
        </div>

        <div className="navbar-end hidden gap-1 lg:flex">
          <ul className="flex items-center">
            {navLinks.map((link) => (
              <li key={link.to}>
                <NavLink to={link.to} end={link.to === '/'} className={navClasses}>
                  {t(link.key)}
                </NavLink>
              </li>
            ))}
          </ul>
          <div className="ms-3 flex items-center gap-2 border-s border-base-300 ps-3">
            <ThemeSwitcher />
            <LanguageSwitcher />
          </div>
          <Button to={applyPath} size="sm" className="ms-2">
            {t('common.applyNow')}
          </Button>
          <AuthMenu />
        </div>

        <div className="navbar-end lg:hidden">
          <button
            type="button"
            onClick={() => setOpen((value) => !value)}
            aria-expanded={open}
            aria-controls="mobile-navigation"
            className="btn btn-ghost btn-circle"
          >
            <Icon name={open ? 'close' : 'menu'} className="h-6 w-6" label={open ? t('nav.closeMenu') : t('nav.openMenu')} />
          </button>
        </div>
      </div>

      <MobileNav open={open} onClose={close} />
    </header>
  )
}

export default Navbar
