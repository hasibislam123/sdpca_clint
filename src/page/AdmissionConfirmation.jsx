import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import PageHeader from '../component/ui/PageHeader'
import Alert from '../component/ui/Alert'
import Button from '../component/ui/Button'
import LoadingState from '../component/ui/LoadingState'
import EmptyState from '../component/ui/EmptyState'
import ApplicationDetails, { StatusBadge } from '../component/Admission/ApplicationDetails'
import { Icon } from '../component/ui/Icon'
import useLanguage from '../hook/useLanguage'
import { apiApplication } from '../api/admission'
import { authErrorKey } from '../api/authErrors'
import { formatNoticeDate } from '../util/localised'

function Summary({ label, children }) {
  return (
    <div className="flex flex-col gap-1 rounded-box border border-base-300 bg-base-100 p-4">
      <span className="text-xs font-medium uppercase tracking-wide text-base-content/50">{label}</span>
      {children}
    </div>
  )
}

export default function AdmissionConfirmation() {
  const { t, lang } = useLanguage()
  const { id } = useParams()
  const [application, setApplication] = useState(null)
  const [failure, setFailure] = useState(null)

  useEffect(() => {
    let active = true

    // Re-read from the API rather than passing the form values along: this page has to show what was
    // actually stored, and a reload or a saved link still has to work.
    apiApplication(id).then(
      (data) => {
        if (active) setApplication(data?.application ?? null)
      },
      (error) => {
        if (active) setFailure(error?.status === 404 ? 'notFound' : authErrorKey(error))
      },
    )

    return () => {
      active = false
    }
  }, [id])

  const header = (
    <PageHeader
      title={t('admissionConfirm.title')}
      description={t('admissionConfirm.description')}
      breadcrumb={[{ label: t('nav.admission'), to: '/admission' }, { label: t('admissionConfirm.crumb') }]}
    />
  )

  if (failure) {
    const missing = failure === 'notFound'
    return (
      <div>
        {header}
        <div className="mx-auto w-full max-w-3xl px-4 py-12 sm:px-6 sm:py-16">
          <EmptyState
            icon="alert"
            title={t(missing ? 'admissionConfirm.notFoundTitle' : 'admissionConfirm.loadFailedTitle')}
            description={t(missing ? 'admissionConfirm.notFoundBody' : failure)}
            action={<Button to="/admission/apply" variant="light">{t('admissionForm.title')}</Button>}
          />
        </div>
      </div>
    )
  }

  if (!application) {
    return (
      <div>
        {header}
        <LoadingState className="py-20" />
      </div>
    )
  }

  return (
    <>
      {header}

      <div className="mx-auto flex w-full max-w-3xl flex-col gap-6 px-4 py-12 sm:px-6 sm:py-16">
        <Alert variant="success" title={t('admissionConfirm.successTitle')}>
          {t('admissionConfirm.successBody', { reference: application.reference })}
        </Alert>

        <div className="grid gap-3 sm:grid-cols-3">
          <Summary label={t('admissionConfirm.reference')}>
            <span className="font-display text-lg font-semibold text-primary">{application.reference}</span>
          </Summary>
          <Summary label={t('admissionConfirm.status')}>
            <StatusBadge status={application.status} />
          </Summary>
          <Summary label={t('admissionConfirm.submittedOn')}>
            <span className="text-sm font-medium text-base-content">{formatNoticeDate(application.submittedAt, lang)}</span>
          </Summary>
        </div>

        <div className="flex flex-col gap-3 border-t border-base-300 pt-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-col gap-1">
            <h2 className="text-lg font-semibold text-base-content sm:text-xl">{t('admissionConfirm.detailsTitle')}</h2>
            <p className="text-xs leading-relaxed text-base-content/55">{t('admissionConfirm.detailsBody')}</p>
          </div>
          <Button
            type="button"
            variant="light"
            className="no-print shrink-0 gap-2"
            // The browser's own print dialog is the download: it is the one path that renders Bangla
            // correctly on a phone and a desktop alike, with no file to fetch and no font to embed.
            onClick={() => window.print()}
          >
            <Icon name="download" className="h-4 w-4" />
            {t('admissionConfirm.download')}
          </Button>
        </div>

        <ApplicationDetails application={application} />

        <p className="flex items-start gap-2 text-xs leading-relaxed text-base-content/55">
          <Icon name="shield" className="mt-0.5 h-4 w-4 shrink-0 text-secondary" />
          {t('admissionConfirm.privateNote')}
        </p>

        <div className="no-print flex flex-col gap-3 border-t border-base-300 pt-6 sm:flex-row sm:items-center sm:justify-between">
          <Button to="/admission" variant="ghost">{t('admissionForm.cancel')}</Button>
          <Button to="/" variant="light">{t('common.home')}</Button>
        </div>
      </div>
    </>
  )
}
