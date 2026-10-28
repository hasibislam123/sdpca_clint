import { Outlet } from 'react-router-dom'
import AdminContentProvider from '../admin/AdminContentProvider'
import AdminNav from '../component/Admin/AdminNav'
import AdminStatus from '../component/Admin/AdminStatus'
import PageHeader from '../component/ui/PageHeader'
import Button from '../component/ui/Button'
import EmptyState from '../component/ui/EmptyState'
import LoadingState from '../component/ui/LoadingState'
import useAdminContent from '../hook/useAdminContent'
import useLanguage from '../hook/useLanguage'

function AdminContent() {
  const { t } = useLanguage()
  const { status, failure, reload } = useAdminContent()

  if (status === 'loading') return <LoadingState label={t('admin.loading')} rows={3} />

  if (status === 'error') {
    return (
      <EmptyState
        icon="alert"
        title={t('admin.loadFailed')}
        description={failure ? t(failure.key) : undefined}
        action={
          <Button type="button" variant="light" onClick={reload}>
            {t('admin.retry')}
          </Button>
        }
      />
    )
  }

  return <Outlet />
}

export default function AdminLayout() {
  const { t } = useLanguage()

  return (
    <AdminContentProvider>
      <PageHeader
        title={t('admin.dashboard')}
        description={t('admin.dashboardDescription')}
        breadcrumb={[{ label: t('admin.title') }]}
      />
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-5 px-4 py-10 sm:px-6 sm:py-12">
        <AdminNav />
        <AdminStatus />
        <AdminContent />
      </div>
    </AdminContentProvider>
  )
}
