import { useState } from 'react'
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom'
import AuthShell from '../component/Auth/AuthShell'
import GoogleButton from '../component/Auth/GoogleButton'
import Button from '../component/ui/Button'
import Alert from '../component/ui/Alert'
import Input from '../component/ui/Input'
import useAuth from '../hook/useAuth'
import useLanguage from '../hook/useLanguage'
import { validateLogin } from '../util/validators'
import { localizeNumbers } from '../util/bn'
import { safeRedirectPath } from '../util/redirect'
import { authErrorKey } from '../firebase/authErrors'

export default function Login() {
  const { t, tNumber } = useLanguage()
  const { login, isAuthenticated, isFirebaseConfigured, returnPath } = useAuth()
  const location = useLocation()
  const navigate = useNavigate()

  const [values, setValues] = useState({ email: '', password: '' })
  const [errors, setErrors] = useState({})
  const [formError, setFormError] = useState(null)
  const [submitting, setSubmitting] = useState(false)

  const target = safeRedirectPath(location.state?.from ?? returnPath, '/')

  if (isAuthenticated) return <Navigate to={target} replace />

  const message = (failure) => (failure ? t(failure.key, localizeNumbers(tNumber, failure.vars)) : undefined)

  const handleChange = (event) => {
    const { name, value } = event.target
    setValues((previous) => ({ ...previous, [name]: value }))
    setErrors((previous) => {
      if (!previous[name]) return previous
      const next = { ...previous }
      delete next[name]
      return next
    })
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    const found = validateLogin(values)
    setErrors(found)
    setFormError(null)
    if (Object.keys(found).length > 0) return

    setSubmitting(true)
    try {
      await login(values.email, values.password)
      navigate(target, { replace: true })
    } catch (error) {
      setFormError(t(authErrorKey(error)))
      setSubmitting(false)
    }
  }

  return (
    <AuthShell
      title={t('auth.loginTitle')}
      description={t('auth.loginSubtitle')}
      footer={
        <>
          {t('auth.noAccount')}{' '}
          <Link to="/register" state={{ from: location.state?.from }} className="font-medium text-primary hover:underline">
            {t('auth.registerLink')}
          </Link>
        </>
      }
    >
      {formError && <Alert variant="error" title={t('auth.errorTitle')}>{formError}</Alert>}

      <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">
        <Input
          label={t('auth.email')}
          id="login-email"
          name="email"
          type="email"
          autoComplete="email"
          required
          value={values.email}
          onChange={handleChange}
          error={message(errors.email)}
        />
        <Input
          label={t('auth.password')}
          id="login-password"
          name="password"
          type="password"
          autoComplete="current-password"
          required
          value={values.password}
          onChange={handleChange}
          error={message(errors.password)}
        />
        <Button type="submit" disabled={submitting || !isFirebaseConfigured}>
          {submitting ? t('auth.signingIn') : t('auth.signIn')}
        </Button>
      </form>

      <GoogleButton onError={setFormError} />
    </AuthShell>
  )
}
