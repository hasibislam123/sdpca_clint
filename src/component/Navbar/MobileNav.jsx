import { useEffect, useRef } from 'react'
import { NavLink } from 'react-router-dom'
import Logo from '../ui/Logo'
import Button from '../ui/Button'
import { Icon } from '../ui/Icon'
import LanguageSwitcher from '../ui/LanguageSwitcher'
import ThemeSwitcher from '../ui/ThemeSwitcher'
import AuthMenu from './AuthMenu'
import useLanguage from '../../hook/useLanguage'
import { contact, navLinks, telHref } from '../../config/site'
import { applyPath } from '../../config/admission'

const itemBase =
  'flex min-h-12 items-center justify-between gap-3 rounded-xl px-4 py-3 text-[0.95rem] font-medium transition duration-200'
const itemIdle = 'text-base-content/80 hover:bg-base-200 hover:text-primary'
const itemActive = 'bg-primary/10 text-primary'

const SectionLabel = ({ children }) => (
  <p className="pb-1.5 text-xs font-semibold uppercase tracking-wider text-base-content/45">{children}</p>
)

export default function MobileNav({ open, onClose }) {
  const { t } = useLanguage()
  const panelRef = useRef(null)

  useEffect(() => {
    if (open) panelRef.current?.focus({ preventScroll: true })
  }, [open])

  return (
    <div className="lg:hidden">
      <div
        aria-hidden="true"
        onClick={onClose}
        className={`fixed inset-0 z-40 bg-neutral/50 transition-opacity duration-300 ${
          open ? 'opacity-100' : 'pointer-events-none opacity-0'
        }`}
      />

      <aside
        ref={panelRef}
        id="mobile-navigation"
        role="dialog"
        aria-modal="true"
        tabIndex={-1}
        aria-label={t('nav.mobileMenu')}
        aria-hidden={!open}
        inert={!open}
        className={`fixed inset-y-0 right-0 z-50 flex w-[min(20rem,88vw)] flex-col bg-base-100 shadow-2xl outline-none transition-transform duration-300 ease-out ${
          open ? 'translate-x-0' : 'pointer-events-none translate-x-full'
        }`}
      >
        <div className="flex items-center justify-between gap-3 border-b border-base-300 px-4 py-3">
          <span className="min-w-0">
            <Logo size="sm" />
          </span>
          <button type="button" onClick={onClose} aria-label={t('nav.closeMenu')} className="btn btn-ghost btn-circle shrink-0">
            <Icon name="close" className="h-5 w-5" />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto overscroll-contain pb-6" aria-label={t('nav.mobileMenu')}>
          <div className="px-4 pt-4">
            <SectionLabel>{t('nav.sectionPages')}</SectionLabel>
            <ul className="-mx-4 flex flex-col gap-1">
              {navLinks.map((link) => (
                <li key={link.to}>
                  <NavLink
                    to={link.to}
                    end={link.to === '/'}
                    onClick={onClose}
                    className={({ isActive }) => `${itemBase} ${isActive ? itemActive : itemIdle}`}
                  >
                    <span>{t(link.key)}</span>
                    <Icon name="arrowRight" className="h-4 w-4 opacity-40" />
                  </NavLink>
                </li>
              ))}
            </ul>
          </div>

          <div className="mt-5 border-t border-base-300 pt-5">
            <div className="px-4">
              <Button to={applyPath} onClick={onClose} className="w-full">
                {t('common.applyNow')}
              </Button>
            </div>
            <div className="mt-5 px-4">
              <SectionLabel>{t('auth.account')}</SectionLabel>
              <div className="mt-1">
                <AuthMenu onNavigate={onClose} fullWidth />
              </div>
            </div>
          </div>

          <div className="mt-5 border-t border-base-300 px-4 pt-5">
            <SectionLabel>{t('nav.sectionPreferences')}</SectionLabel>
            <div className="flex flex-col gap-3 rounded-box bg-base-200 p-3">
              <div className="flex items-center justify-between gap-3">
                <span className="text-sm font-medium text-base-content/70">{t('lang.label')}</span>
                <LanguageSwitcher size="md" />
              </div>
              <div className="flex items-center justify-between gap-3">
                <span className="text-sm font-medium text-base-content/70">{t('theme.label')}</span>
                <ThemeSwitcher size="md" />
              </div>
            </div>
          </div>

          <div className="mt-5 border-t border-base-300 px-4 pt-5">
            <SectionLabel>{t('nav.sectionContact')}</SectionLabel>
            <div className="-mx-4 flex flex-col gap-1 text-sm">
              <a
                href={telHref(contact.phone)}
                onClick={onClose}
                className={`${itemBase} ${itemIdle} text-base-content/70`}
              >
                <span className="flex items-center gap-3">
                  <Icon name="phone" className="h-4 w-4" />
                  {contact.phone}
                </span>
              </a>
              <a
                href={`mailto:${contact.email}`}
                onClick={onClose}
                className={`${itemBase} ${itemIdle} break-all text-base-content/70`}
              >
                <span className="flex items-center gap-3">
                  <Icon name="mail" className="h-4 w-4" />
                  {contact.email}
                </span>
              </a>
            </div>
          </div>
        </nav>
      </aside>
    </div>
  )
}
