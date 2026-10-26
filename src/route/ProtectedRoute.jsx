import { Navigate, Outlet, useLocation } from 'react-router-dom'
import useAuth from '../hook/useAuth'
import useLanguage from '../hook/useLanguage'
import LoadingState from '../component/ui/LoadingState'

export default function ProtectedRoute() {
  const { loading, isAuthenticated } = useAuth()
  const { t } = useLanguage()
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
    return (
      <Navigate to="/login" state={{ from: `${location.pathname}${location.search}` }} replace />
    )
  }

  return <Outlet />
}
