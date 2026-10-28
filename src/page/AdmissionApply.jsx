import { useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import PageHeader from '../component/ui/PageHeader'
import Input from '../component/ui/Input'
import Select from '../component/ui/Select'
import Textarea from '../component/ui/Textarea'
import Button from '../component/ui/Button'
import Alert from '../component/ui/Alert'
import { Icon } from '../component/ui/Icon'
import useAuth from '../hook/useAuth'
import useLanguage from '../hook/useLanguage'
import { validateApplication } from '../util/validators'
import { localizeNumbers } from '../util/bn'
import { classLevels, genders, guardianRelations } from '../config/admission'
import { apiMyApplications, apiSubmitApplication } from '../api/admission'
import { authErrorKey } from '../api/authErrors'

const initialValues = {
  studentName: '',
  className: '',
  gender: '',
  dateOfBirth: '',
  birthRegistrationNumber: '',
  institutionName: '',
  guardianName: '',
  relation: '',
  mobile: '',
  email: '',
  presentAddress: '',
  upazila: '',
  district: '',
  postalCode: '',
  medical: '',
  declaration: false,
}

const gridClass = 'grid gap-4 sm:grid-cols-2'

function Group({ eyebrow, title, children }) {
  return (
    <fieldset className="flex flex-col gap-5">
      <legend className="flex flex-col gap-1">
        <span className="text-xs font-medium uppercase tracking-wide text-secondary">{eyebrow}</span>
        <span className="text-lg font-semibold text-base-content sm:text-xl">{title}</span>
      </legend>
      {children}
    </fieldset>
  )
}

export default function AdmissionApply() {
  const { t, tNumber } = useLanguage()
  const { user } = useAuth()
  const navigate = useNavigate()
  const [values, setValues] = useState(initialValues)
  const [errors, setErrors] = useState({})
  const [notice, setNotice] = useState(null)
  const [busy, setBusy] = useState(false)
  const summaryRef = useRef(null)

  const message = (failure) => (failure ? t(failure.key, localizeNumbers(tNumber, failure.vars)) : undefined)
  const today = new Date().toISOString().slice(0, 10)

  const handleChange = (event) => {
    const { name, type, value, checked } = event.target
    setValues((previous) => ({ ...previous, [name]: type === 'checkbox' ? checked : value }))
    setNotice(null)
    setErrors((previous) => {
      if (!previous[name]) return previous
      const next = { ...previous }
      delete next[name]
      return next
    })
  }

  // The server checks the same rules again and answers with the field names it rejected. Their own
  // wording is English and machine-generated, so the UI names the problem in the current language
  // instead of showing the API's prose.
  const serverFieldErrors = (fields) => {
    if (!fields || typeof fields !== 'object') return {}
    return Object.fromEntries(Object.keys(fields).map((field) => [field, { key: 'validation.serverField' }]))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    const found = validateApplication(values)
    setErrors(found)

    if (Object.keys(found).length > 0) {
      setNotice({ variant: 'error', title: t('validation.invalidTitle'), body: t('validation.invalidBody', { n: tNumber(Object.keys(found).length) }) })
      summaryRef.current?.focus()
      return
    }

    setBusy(true)
    try {
      const { application } = await apiSubmitApplication(values)
      // The saved record is read back by id on the confirmation page, so what a guardian sees there is
      // what MongoDB holds, not what the browser still has in memory.
      navigate(`/admission/application/${application.id}`)
    } catch (error) {
      setErrors(serverFieldErrors(error.fields))
      setNotice({ variant: 'error', title: t('admissionForm.failedTitle'), body: t(authErrorKey(error)) })

      // One application per account per session, so a guardian who has already filed and lost their
      // confirmation link is pointed straight back at the file instead of at a dead end. The id rides
      // on the notice, so it disappears with it as soon as the form is edited again.
      if (error.code === 'already_applied') {
        apiMyApplications().then(
          (data) => setNotice((previous) => (previous ? { ...previous, existingId: data?.applications?.[0]?.id ?? null } : previous)),
          () => {},
        )
      }

      summaryRef.current?.focus()
    } finally {
      setBusy(false)
    }
  }

  return (
    <>
      <PageHeader
        title={t('admissionForm.title')}
        description={t('admissionForm.description', { year: tNumber(t('school.academicYear')) })}
        breadcrumb={[{ label: t('nav.admission'), to: '/admission' }, { label: t('admissionForm.crumb') }]}
      />

      <form onSubmit={handleSubmit} noValidate className="border-t border-base-300 bg-base-100 py-12 sm:py-16">
        <div className="mx-auto flex w-full max-w-3xl flex-col gap-10 px-4 sm:px-6">
          <div ref={summaryRef} tabIndex={-1} className="flex flex-col gap-4 outline-none">
            {notice && (
              <Alert variant={notice.variant} title={notice.title}>
                {notice.body}
              </Alert>
            )}
            {notice?.existingId && (
              <div className="flex justify-end">
                <Button to={`/admission/application/${notice.existingId}`} variant="light" size="sm">
                  {t('admissionForm.viewExisting')}
                </Button>
              </div>
            )}
            <p className="flex items-start gap-2 text-sm text-base-content/65">
              <Icon name="shield" className="mt-0.5 h-4 w-4 shrink-0 text-secondary" />
              {t('admissionForm.applicant', { name: user.name?.trim() || user.email })}
            </p>
          </div>

          <Group eyebrow={t('admissionForm.studentEyebrow')} title={t('admissionForm.studentTitle')}>
            <div className={gridClass}>
              <Input
                label={t('admissionForm.studentName')}
                id="studentName"
                name="studentName"
                autoComplete="off"
                required
                value={values.studentName}
                onChange={handleChange}
                error={message(errors.studentName)}
              />
              <Select
                label={t('admissionForm.className')}
                id="className"
                name="className"
                required
                placeholder={t('common.selectPlaceholder')}
                options={classLevels.map((value) => ({ value, label: t(`options.class.${value}`) }))}
                value={values.className}
                onChange={handleChange}
                error={message(errors.className)}
              />
              <Select
                label={t('admissionForm.gender')}
                id="gender"
                name="gender"
                required
                placeholder={t('common.selectPlaceholder')}
                options={genders.map((value) => ({ value, label: t(`options.gender.${value}`) }))}
                value={values.gender}
                onChange={handleChange}
                error={message(errors.gender)}
              />
              <Input
                label={t('admissionForm.dateOfBirth')}
                id="dateOfBirth"
                name="dateOfBirth"
                type="date"
                max={today}
                required
                value={values.dateOfBirth}
                onChange={handleChange}
                error={message(errors.dateOfBirth)}
              />
              <Input
                label={t('admissionForm.birthRegistration')}
                id="birthRegistrationNumber"
                name="birthRegistrationNumber"
                inputMode="numeric"
                hint={t('admissionForm.birthRegistrationHint')}
                value={values.birthRegistrationNumber}
                onChange={handleChange}
                error={message(errors.birthRegistrationNumber)}
              />
              <Input
                label={t('admissionForm.institution')}
                id="institutionName"
                name="institutionName"
                required
                value={values.institutionName}
                onChange={handleChange}
                error={message(errors.institutionName)}
              />
            </div>
          </Group>

          <Group eyebrow={t('admissionForm.guardianEyebrow')} title={t('admissionForm.guardianTitle')}>
            <div className={gridClass}>
              <Input
                label={t('admissionForm.guardianName')}
                id="guardianName"
                name="guardianName"
                required
                value={values.guardianName}
                onChange={handleChange}
                error={message(errors.guardianName)}
              />
              <Select
                label={t('admissionForm.relation')}
                id="relation"
                name="relation"
                required
                placeholder={t('common.selectPlaceholder')}
                options={guardianRelations.map((value) => ({ value, label: t(`options.relation.${value}`) }))}
                value={values.relation}
                onChange={handleChange}
                error={message(errors.relation)}
              />
              <Input
                label={t('admissionForm.mobile')}
                id="mobile"
                name="mobile"
                type="tel"
                autoComplete="tel"
                required
                hint={t('admissionForm.mobileHint')}
                value={values.mobile}
                onChange={handleChange}
                error={message(errors.mobile)}
              />
              <Input
                label={t('admissionForm.email')}
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                value={values.email}
                onChange={handleChange}
                error={message(errors.email)}
              />
            </div>
          </Group>

          <Group eyebrow={t('admissionForm.addressEyebrow')} title={t('admissionForm.addressTitle')}>
            <Textarea
              label={t('admissionForm.presentAddress')}
              id="presentAddress"
              name="presentAddress"
              rows={3}
              required
              value={values.presentAddress}
              onChange={handleChange}
              error={message(errors.presentAddress)}
            />
            <div className={gridClass}>
              <Input
                label={t('admissionForm.upazila')}
                id="upazila"
                name="upazila"
                required
                value={values.upazila}
                onChange={handleChange}
                error={message(errors.upazila)}
              />
              <Input
                label={t('admissionForm.district')}
                id="district"
                name="district"
                required
                value={values.district}
                onChange={handleChange}
                error={message(errors.district)}
              />
              <Input
                label={t('admissionForm.postalCode')}
                id="postalCode"
                name="postalCode"
                inputMode="numeric"
                required
                value={values.postalCode}
                onChange={handleChange}
                error={message(errors.postalCode)}
              />
            </div>
          </Group>

          <Group eyebrow={t('admissionForm.extraEyebrow')} title={t('admissionForm.extraTitle')}>
            <Textarea
              label={t('admissionForm.medical')}
              id="medical"
              name="medical"
              rows={3}
              value={values.medical}
              onChange={handleChange}
            />
            <label className="flex items-start gap-3 text-sm text-base-content/75">
              <input
                type="checkbox"
                name="declaration"
                checked={values.declaration}
                onChange={handleChange}
                aria-invalid={errors.declaration ? true : undefined}
                className="checkbox mt-0.5 border-base-300 bg-base-100"
              />
              <span>{t('admissionForm.declaration')}</span>
            </label>
            {errors.declaration && (
              <p role="alert" className="text-xs font-medium text-error">
                {message(errors.declaration)}
              </p>
            )}
          </Group>

          <div className="flex flex-col gap-3 border-t border-base-300 pt-6 sm:flex-row sm:items-center sm:justify-between">
            <Button type="submit" disabled={busy}>
              {busy ? t('admissionForm.submitting') : t('admissionForm.submit')}
            </Button>
            <Button to="/admission" variant="ghost">{t('admissionForm.cancel')}</Button>
          </div>
        </div>
      </form>
    </>
  )
}
