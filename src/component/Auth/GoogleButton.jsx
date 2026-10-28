import { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import Button from '../ui/Button'
import useAuth from '../../hook/useAuth'
import useLanguage from '../../hook/useLanguage'
import { safeRedirectPath } from '../../util/redirect'
import { authErrorKey } from '../../api/authErrors'

function GoogleMark({ className = 'h-4 w-4' }) {
  return (
    <svg viewBox="0 0 48 48" className={className} aria-hidden="true" focusable="false">
      <path
        fill="#FFC107"
        d="M43.6 20.1H42V20H24v8h11.3C33.7 32.7 29.2 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.8 1.2 7.9 3l5.7-5.7C34 6.1 29.3 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.7-.4-3.9z"
      />
      <path
        fill="#FF3D00"
        d="M6.3 14.7l6.6 4.8C14.7 15.1 19 12 24 12c3.1 0 5.8 1.2 7.9 3l5.7-5.7C34 6.1 29.3 4 24 4 16.3 4 9.7 8.3 6.3 14.7z"
      />
      <path
        fill="#4CAF50"
        d="M24 44c5.2 0 9.9-2 13.4-5.2l-6.2-5.2C29.9 35.9 27.1 37 24 37c-5.2 0-9.6-3.3-11.3-7.9l-6.5 5C9.5 39.6 16.2 44 24 44z"
      />
      <path
        fill="#1976D2"
        d="M43.6 20.1H42V20H24v8h11.3c-.8 2.2-2.1 4.2-3.7 5.7l6.2 5.2C42 35.5 44 30.2 44 24c0-1.3-.1-2.7-.4-3.9z"
      />
    </svg>
  )
}

export default function GoogleButton({ onError }) {
  const { t } = useLanguage()
  const { loginWithGoogle, googleSignIn } = useAuth()
  const location = useLocation()
  const navigate = useNavigate()
  const [busy, setBusy] = useState(false)

  const handleClick = async () => {
    setBusy(true)
    onError(null)
    try {
      await loginWithGoogle()
      navigate(safeRedirectPath(location.state?.from, '/'), { replace: true })
    } catch (error) {
      onError(t(authErrorKey(error)))
      setBusy(false)
    }
  }

  // The API has to say it will accept a Google token before this is offered at all, so a server
  // without FIREBASE_PROJECT_ID never shows a button that can only fail.
  if (!googleSignIn) return null

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center gap-3 text-xs text-base-content/50">
        <span className="h-px flex-1 bg-base-300" />
        {t('auth.or')}
        <span className="h-px flex-1 bg-base-300" />
      </div>
      <Button type="button" variant="light" onClick={handleClick} disabled={busy} className="gap-2.5">
        {busy ? <span className="loading loading-spinner loading-sm" /> : <GoogleMark />}
        {busy ? t('auth.googleConnecting') : t('auth.continueWithGoogle')}
      </Button>
    </div>
  )
}
