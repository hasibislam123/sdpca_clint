import { Link } from 'react-router-dom'
import Logo from '../ui/Logo'
import Alert from '../ui/Alert'
import useAuth from '../../hook/useAuth'
import useLanguage from '../../hook/useLanguage'
import { missingEnvKeys } from '../../firebase/firebase.init'

export default function AuthShell({ title, description, children, footer }) {
  const { t } = useLanguage()
  const { isFirebaseConfigured, redirectErrorKey } = useAuth()

  return (
    <section className="py-12 sm:py-16">
      <div className="mx-auto w-full max-w-md px-4 sm:px-6">
        <Link to="/" className="mx-auto mb-6 w-fit" aria-label={t('nav.logoAria', { school: t('brand.name') })}>
          <Logo size="sm" />
        </Link>
        <div className="flex flex-col gap-5 rounded-box border border-base-300 bg-base-100 p-6 shadow-sm sm:p-8">
          <div className="flex flex-col gap-1.5">
            <h1 className="text-xl font-semibold text-base-content sm:text-2xl">{title}</h1>
            <p className="text-sm leading-relaxed text-base-content/65">{description}</p>
          </div>
          {redirectErrorKey && (
            <Alert variant="error" title={t('auth.errorTitle')}>
              {t(redirectErrorKey)}
            </Alert>
          )}
          {!isFirebaseConfigured && (
            <Alert variant="warning" title={t('auth.setupTitle')}>
              {t(missingEnvKeys.length ? 'auth.setupMissingKeys' : 'auth.setupBody', { keys: missingEnvKeys.join(', ') })}
            </Alert>
          )}
          {children}
        </div>
        <p className="mt-5 text-center text-sm text-base-content/65">{footer}</p>
      </div>
    </section>
  )
}
