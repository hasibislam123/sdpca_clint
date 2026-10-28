import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import Panel from '../component/Admin/Panel'
import ConfirmDelete from '../component/Admin/ConfirmDelete'
import Select from '../component/ui/Select'
import Input from '../component/ui/Input'
import Button from '../component/ui/Button'
import Alert from '../component/ui/Alert'
import EmptyState from '../component/ui/EmptyState'
import LoadingState from '../component/ui/LoadingState'
import ApplicationDetails, { StatusBadge } from '../component/Admission/ApplicationDetails'
import { Icon } from '../component/ui/Icon'
import useAdminContent from '../hook/useAdminContent'
import useLanguage from '../hook/useLanguage'
import { apiAdminApplications, apiDeleteApplication, apiSetApplicationStatus } from '../api/admission'
import { authErrorKey } from '../api/authErrors'
import { formatNoticeDate } from '../util/localised'

const FALLBACK_STATUSES = ['submitted', 'under_review', 'approved', 'declined']

export default function AdminApplications() {
  const { t, lang, tNumber } = useLanguage()
  const { schema, busy: contentBusy } = useAdminContent()
  const [params, setParams] = useSearchParams()
  const [rows, setRows] = useState(null)
  const [truncated, setTruncated] = useState(false)
  const [failure, setFailure] = useState(null)
  const [busy, setBusy] = useState(false)
  const [selectedId, setSelectedId] = useState(null)
  const [draft, setDraft] = useState('')
  const [term, setTerm] = useState(params.get('q') ?? '')

  const statuses = schema.applicationStatuses?.length ? schema.applicationStatuses : FALLBACK_STATUSES
  const status = statuses.includes(params.get('status')) ? params.get('status') : ''
  const search = params.get('q') ?? ''

  useEffect(() => {
    let active = true

    apiAdminApplications({ status, search }).then(
      (data) => {
        if (!active) return
        setRows(data?.applications ?? [])
        setTruncated(Boolean(data?.truncated))
        setFailure(null)
      },
      (error) => {
        if (active) {
          setRows([])
          setFailure(authErrorKey(error))
        }
      },
    )

    return () => {
      active = false
    }
  }, [status, search])

  const selected = (rows ?? []).find((row) => row.id === selectedId) ?? null

  const open = (row) => {
    setSelectedId(row.id)
    setDraft(row.status)
  }

  const applyFilter = (nextStatus, nextTerm) => {
    const next = {}
    if (nextStatus) next.status = nextStatus
    if (nextTerm.trim()) next.q = nextTerm.trim()
    setParams(next)
  }

  const saveStatus = async () => {
    if (!selected || draft === selected.status) return

    setBusy(true)
    try {
      const { application } = await apiSetApplicationStatus(selected.id, draft)
      // The list row keeps its applicant account next to it; the API answers with the file alone.
      setRows((current) => current.map((row) => (row.id === application.id ? { ...row, ...application } : row)))
      setFailure(null)
    } catch (error) {
      setFailure(authErrorKey(error))
    } finally {
      setBusy(false)
    }
  }

  const remove = async () => {
    if (!selected) return

    setBusy(true)
    try {
      await apiDeleteApplication(selected.id)
      setRows((current) => current.filter((row) => row.id !== selected.id))
      setSelectedId(null)
      setFailure(null)
    } catch (error) {
      setFailure(authErrorKey(error))
    } finally {
      setBusy(false)
    }
  }

  const disabled = busy || contentBusy

  return (
    <div className="flex flex-col gap-5">
      <Panel title={t('admin.applicationsTitle')} description={t('admin.applicationsDescription')}>
        <div className="grid gap-3 sm:grid-cols-[minmax(0,12rem)_minmax(0,1fr)_auto] sm:items-end">
          <Select
            id="application-status"
            label={t('admin.status')}
            value={status}
            options={[{ value: '', label: t('admin.allStatuses') }, ...statuses.map((value) => ({ value, label: t(`admissionStatus.${value}`) }))]}
            onChange={(event) => applyFilter(event.target.value, term)}
          />
          <form
            className="flex items-end gap-2"
            onSubmit={(event) => {
              event.preventDefault()
              applyFilter(status, term)
            }}
          >
            <Input
              id="application-search"
              label={t('admin.search')}
              value={term}
              placeholder={t('admin.searchPlaceholder')}
              onChange={(event) => setTerm(event.target.value)}
            />
            <Button type="submit" size="sm" variant="light" className="gap-2 shrink-0">
              <Icon name="search" className="h-4 w-4" />
              {t('admin.search')}
            </Button>
          </form>
          <p className="text-sm text-base-content/60 sm:pb-2">
            {rows ? t('admin.applicationCount', { n: tNumber(String(rows.length)) }) : ''}
          </p>
        </div>

        {failure && (
          <Alert variant="error" title={t('admin.loadFailed')}>
            {t(failure)}
          </Alert>
        )}

        {truncated && (
          <Alert variant="warning" title={t('admin.truncatedTitle')}>
            {t('admin.truncatedBody')}
          </Alert>
        )}

        {!rows ? (
          <LoadingState label={t('admin.loading')} rows={2} />
        ) : rows.length === 0 ? (
          <EmptyState icon="inbox" title={t('admin.emptyApplications')} description={t('admin.emptyApplicationsBody')} />
        ) : (
          <ul className="flex flex-col gap-2">
            {rows.map((row) => (
              <li
                key={row.id}
                className={`flex flex-wrap items-center gap-3 rounded-box border p-3 transition ${
                  row.id === selectedId ? 'border-primary/40 bg-primary/5' : 'border-base-300 bg-base-200/50 hover:bg-base-200'
                }`}
              >
                <div className="min-w-40 flex-1">
                  <p className="flex flex-wrap items-center gap-2 text-sm font-semibold text-base-content">
                    {row.studentName}
                    <span className="text-xs font-normal text-base-content/50">{t(`options.class.${row.className}`)}</span>
                  </p>
                  <p className="text-xs text-base-content/55">
                    {row.reference} · {formatNoticeDate(row.submittedAt, lang)} · {row.mobile}
                  </p>
                  <p className="text-xs text-base-content/40">{row.applicant?.email}</p>
                </div>
                <StatusBadge status={row.status} />
                <Button type="button" size="sm" variant="outline" disabled={disabled} onClick={() => open(row)}>
                  {t('admin.review')}
                </Button>
              </li>
            ))}
          </ul>
        )}
      </Panel>

      {selected && (
        <Panel
          title={t('admin.reviewApplication')}
          description={`${selected.reference} · ${selected.applicant?.name ?? ''} ${selected.applicant?.email ?? ''}`.trim()}
          action={
            <Button type="button" size="sm" variant="ghost" onClick={() => setSelectedId(null)}>
              {t('admin.close')}
            </Button>
          }
        >
          <ApplicationDetails application={selected} />

          <div className="flex flex-wrap items-end gap-3 border-t border-base-300 pt-5">
            <Select
              id="application-new-status"
              label={t('admin.newStatus')}
              value={draft}
              options={statuses.map((value) => ({ value, label: t(`admissionStatus.${value}`) }))}
              onChange={(event) => setDraft(event.target.value)}
              className="w-full sm:w-56"
            />
            <Button type="button" size="sm" onClick={saveStatus} disabled={disabled || draft === selected.status}>
              {busy ? t('admin.saving') : t('admin.saveStatus')}
            </Button>
            <ConfirmDelete label={selected.reference} busy={disabled} onConfirm={remove} />
          </div>

          <p className="text-xs leading-relaxed text-base-content/55">{t('admin.applicationsPrivateNote')}</p>
        </Panel>
      )}
    </div>
  )
}
