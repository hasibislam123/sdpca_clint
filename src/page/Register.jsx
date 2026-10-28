import { useState } from 'react'
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom'
import AuthShell from '../component/Auth/AuthShell'
import GoogleButton from '../component/Auth/GoogleButton'
import Button from '../component/ui/Button'
import Alert from '../component/ui/Alert'
import Input from '../component/ui/Input'
import useAuth from '../hook/useAuth'
import useLanguage from '../hook/useLanguage'
import { validateRegister } from '../util/validators'
import { localizeNumbers } from '../util/bn'
import { safeRedirectPath } from '../util/redirect'
import { authErrorKey } from '../api/authErrors'

const emptyValues = { name: '', email: '', password: '', confirm: '' }

export default function Register() {
  const { t, tNumber } = useLanguage()
  const { register, isAuthenticated, apiOnline } = useAuth()
  const location = useLocation()
  const navigate = useNavigate()

  const [values, setValues] = useState(emptyValues)
  const [errors, setErrors] = useState({})
  const [formError, setFormError] = useState(null)
  const [submitting, setSubmitting] = useState(false)

  const target = safeRedirectPath(location.state?.from, '/')

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
    const found = validateRegister(values)
    setErrors(found)
    setFormError(null)
    if (Object.keys(found).length > 0) return

    setSubmitting(true)
    try {
      await register(values.email, values.password, values.name)
      navigate(target, { replace: true })
    } catch (error) {
      setFormError(t(authErrorKey(error)))
      setSubmitting(false)
    }
  }

  return (
    <AuthShell
      title={t('auth.registerTitle')}
      description={t('auth.registerSubtitle')}
      footer={
        <>
          {t('auth.haveAccount')}{' '}
          <Link to="/login" state={{ from: location.state?.from }} className="font-medium text-primary hover:underline">
            {t('auth.signInLink')}
          </Link>
        </>
      }
    >
      {formError && <Alert variant="error" title={t('auth.errorTitleRegister')}>{formError}</Alert>}

      <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">
        <Input
          label={t('auth.name')}
          id="register-name"
          name="name"
          autoComplete="name"
          required
          value={values.name}
          onChange={handleChange}
          error={message(errors.name)}
        />
        <Input
          label={t('auth.email')}
          id="register-email"
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
          id="register-password"
          name="password"
          type="password"
          autoComplete="new-password"
          required
          hint={t('auth.passwordHint', { n: tNumber(8) })}
          value={values.password}
          onChange={handleChange}
          error={message(errors.password)}
        />
        <Input
          label={t('auth.confirmPassword')}
          id="register-confirm"
          name="confirm"
          type="password"
          autoComplete="new-password"
          required
          value={values.confirm}
          onChange={handleChange}
          error={message(errors.confirm)}
        />
        <Button type="submit" disabled={submitting || !apiOnline}>
          {submitting ? t('auth.creatingAccount') : t('auth.createAccount')}
        </Button>
      </form>

      <GoogleButton onError={setFormError} />
    </AuthShell>
  )
}
