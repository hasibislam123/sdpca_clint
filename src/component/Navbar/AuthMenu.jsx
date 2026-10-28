import { Link } from 'react-router-dom'
import { Icon } from '../ui/Icon'
import Button from '../ui/Button'
import useAuth from '../../hook/useAuth'
import useLanguage from '../../hook/useLanguage'

export default function AuthMenu({ onNavigate, fullWidth = false }) {
  const { t } = useLanguage()
  const { user, loading, isAuthenticated, isAdmin, logout } = useAuth()

  if (loading) {
    return <span className="skeleton h-8 w-24 rounded-full" aria-hidden="true" />
  }

  if (!isAuthenticated) {
    return (
      <Button
        to="/login"
        onClick={onNavigate}
        variant="ghost"
        size={fullWidth ? 'md' : 'sm'}
        className={fullWidth ? 'w-full justify-center border border-base-300' : 'border border-base-300'}
      >
        <Icon name="users" className="h-4 w-4" />
        {t('auth.signIn')}
      </Button>
    )
  }

  const name = user.name?.trim() || user.email

  return (
    <details className={`dropdown ${fullWidth ? 'dropdown-start w-full' : 'dropdown-end'}`}>
      <summary
        className={`btn btn-ghost gap-2 border border-base-300 ${
          fullWidth ? 'btn-md w-full justify-start' : 'btn-sm max-w-40'
        }`}
      >
        <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary">
          {name.slice(0, 1).toUpperCase()}
        </span>
        <span className="truncate">{name}</span>
      </summary>
      <ul className="menu dropdown-content z-[1] mt-2 w-60 rounded-box border border-base-300 bg-base-100 p-2 shadow-md">
        <li className="menu-title truncate">{user.email}</li>
        {isAdmin && (
          <li>
            <Link to="/admin" onClick={onNavigate}>
              <Icon name="shield" className="h-4 w-4" />
              {t('admin.title')}
            </Link>
          </li>
        )}
        <li>
          <button
            type="button"
            onClick={() => {
              onNavigate?.()
              logout()
            }}
          >
            <Icon name="close" className="h-4 w-4" />
            {t('auth.signOut')}
          </button>
        </li>
      </ul>
    </details>
  )
}
