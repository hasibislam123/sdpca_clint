import { useState } from 'react'
import Button from '../ui/Button'
import { Icon } from '../ui/Icon'
import useLanguage from '../../hook/useLanguage'

// Deleting is final, so the button arms itself and asks once instead of relying on a browser dialog
// that the site never uses anywhere else.
export default function ConfirmDelete({ label, busy = false, disabled = false, onConfirm }) {
  const { t } = useLanguage()
  const [armed, setArmed] = useState(false)

  if (!armed) {
    return (
      <Button
        type="button"
        size="sm"
        variant="ghost"
        className="gap-2 text-error hover:bg-error/10"
        disabled={busy || disabled}
        onClick={() => setArmed(true)}
      >
        <Icon name="trash" className="h-4 w-4" />
        <span className="sr-only">{label}</span>
        {t('admin.delete')}
      </Button>
    )
  }

  return (
    <span className="flex flex-wrap items-center gap-2">
      <span className="text-xs font-medium text-error">{t('admin.confirmDelete')}</span>
      <Button
        type="button"
        size="sm"
        onClick={() => {
          setArmed(false)
          onConfirm()
        }}
        disabled={busy}
      >
        {t('admin.yes')}
      </Button>
      <Button type="button" size="sm" variant="light" onClick={() => setArmed(false)}>
        {t('admin.no')}
      </Button>
    </span>
  )
}
