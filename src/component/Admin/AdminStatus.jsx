import { useEffect, useState } from 'react'
import Alert from '../ui/Alert'
import useAdminContent from '../../hook/useAdminContent'
import useLanguage from '../../hook/useLanguage'

// The server answers with a machine code and, for a rejected form, the offending field paths. Both
// are shown here so no prose from the API ever has to be trusted or translated on the fly.
export default function AdminStatus() {
  const { t } = useLanguage()
  const { failure, savedAt, status } = useAdminContent()
  const [hiddenAt, setHiddenAt] = useState(0)

  // Success is shown until a timer hides it, so the banner never needs to be closed by hand.
  useEffect(() => {
    if (!savedAt) return
    const timer = setTimeout(() => setHiddenAt(savedAt), 5000)
    return () => clearTimeout(timer)
  }, [savedAt])

  const showSaved = savedAt > hiddenAt

  // A failed first load is already explained by the retry panel, so the banner is for write failures.
  if (failure && status === 'ready') {
    const fields = Object.keys(failure.fields ?? {})

    return (
      <Alert variant="error" title={t(failure.key)}>
        {fields.length > 0 ? `${t('admin.fieldsNeedAttention')}: ${fields.join(', ')}` : undefined}
      </Alert>
    )
  }

  if (showSaved) return <Alert variant="success" title={t('admin.saved')} />

  return null
}
