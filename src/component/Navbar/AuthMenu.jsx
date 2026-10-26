import { Icon } from '../ui/Icon'
import Button from '../ui/Button'
import useAuth from '../../hook/useAuth'
import useLanguage from '../../hook/useLanguage'

export default function AuthMenu() {
  const { t } = useLanguage()
  const { user, loading, isAuthenticated, logout } = useAuth()

  if (loading) {
    return <span className="skeleton h-8 w-24 rounded-full" aria-hidden="true" />
  }

  if (!isAuthenticated) {
    return (
      <Button to="/login" variant="ghost" size="sm" className="border border-base-300">
        <Icon name="users" className="h-4 w-4" />
        {t('auth.signIn')}
      </Button>
    )
  }

  const name = user.displayName?.trim() || user.email

  return (
    <details className="dropdown dropdown-end">
      <summary className="btn btn-ghost btn-sm max-w-40 gap-2 border border-base-300">
        <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary">
          {name.slice(0, 1).toUpperCase()}
        </span>
        <span className="truncate">{name}</span>
      </summary>
      <ul className="menu dropdown-content z-[1] mt-2 w-60 rounded-box border border-base-300 bg-base-100 p-2 shadow-md">
        <li className="menu-title truncate">{user.email}</li>
        <li>
          <button type="button" onClick={logout}>
            <Icon name="close" className="h-4 w-4" />
            {t('auth.signOut')}
          </button>
        </li>
      </ul>
    </details>
  )
}
