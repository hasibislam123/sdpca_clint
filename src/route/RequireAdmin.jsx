import { Navigate, Outlet, useLocation } from 'react-router-dom'
import EmptyState from '../component/ui/EmptyState'
import LoadingState from '../component/ui/LoadingState'
import Button from '../component/ui/Button'
import useAuth from '../hook/useAuth'
import useLanguage from '../hook/useLanguage'

// The cookie decides who is calling, and the role is read from the database behind it. Hiding this
// route on the client is only the courtesy layer: /api/admin answers 401/403 regardless of what the
// browser claims, so a hand-edited profile can no more reach the dashboard than the API.
export default function RequireAdmin() {
  const { t } = useLanguage()
  const { loading, isAuthenticated, isAdmin } = useAuth()
  const location = useLocation()

  if (loading) {
    return (
      <section className="py-16">
        <div className="mx-auto w-full max-w-6xl px-4 sm:px-6">
          <LoadingState label={t('auth.checking')} rows={0} />
        </div>
      </section>
    )
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: `${location.pathname}${location.search}` }} replace />
  }

  if (!isAdmin) {
    return (
      <div className="mx-auto w-full max-w-3xl px-4 py-16 sm:px-6">
        <EmptyState
          icon="shield"
          title={t('admin.deniedTitle')}
          description={t('admin.deniedBody')}
          action={
            <Button to="/" variant="light">
              {t('admin.backToSite')}
            </Button>
          }
        />
      </div>
    )
  }

  return <Outlet />
}
