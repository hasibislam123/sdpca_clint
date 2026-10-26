const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/
const mobilePattern = /^(\+?88)?0?1[3-9]\d{8}$/
const postalPattern = /^\d{4}$/
const birthRegistrationPattern = /^\d{17}$/

export const hasValue = (value) => String(value ?? '').trim() !== ''
export const isEmail = (value) => emailPattern.test(String(value ?? '').trim())
export const isMobile = (value) => mobilePattern.test(String(value ?? '').replace(/[\s\-.]/g, ''))

const err = (key, vars) => ({ key, vars })

const minLength = (value, length) => (String(value ?? '').trim().length >= length ? null : err('validation.minLength', { n: length }))

function validateDateOfBirth(value) {
  if (!hasValue(value)) return err('validation.required')
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return err('validation.dateInvalid')
  const now = new Date()
  if (date > now) return err('validation.dateFuture')
  const years = (now.getTime() - date.getTime()) / 31557600000
  if (years < 4 || years > 30) return err('validation.ageRange', { min: 4, max: 30 })
  return null
}

export function validateLogin({ email, password }) {
  const errors = {}
  if (!hasValue(email)) errors.email = err('validation.required')
  else if (!isEmail(email)) errors.email = err('validation.email')
  if (!hasValue(password)) errors.password = err('validation.required')
  return errors
}

export function validateRegister({ name, email, password, confirm }) {
  const errors = {}
  const shortName = minLength(name, 3)
  if (!hasValue(name)) errors.name = err('validation.required')
  else if (shortName) errors.name = shortName

  if (!hasValue(email)) errors.email = err('validation.required')
  else if (!isEmail(email)) errors.email = err('validation.email')

  if (!hasValue(password)) errors.password = err('validation.required')
  else if (password.length < 6) errors.password = err('validation.passwordShort', { n: 6 })

  if (!hasValue(confirm)) errors.confirm = err('validation.required')
  else if (confirm !== password) errors.confirm = err('validation.passwordMatch')

  return errors
}

const applicationRules = {
  studentName: (v) => (hasValue(v) ? minLength(v, 3) : err('validation.required')),
  className: (v) => (hasValue(v) ? null : err('validation.required')),
  gender: (v) => (hasValue(v) ? null : err('validation.required')),
  dateOfBirth: validateDateOfBirth,
  birthRegistrationNumber: (v) => {
    if (!hasValue(v)) return null
    return birthRegistrationPattern.test(v.replace(/\s/g, '')) ? null : err('validation.birthRegistration')
  },
  institutionName: (v) => (hasValue(v) ? minLength(v, 2) : err('validation.required')),
  guardianName: (v) => (hasValue(v) ? minLength(v, 3) : err('validation.required')),
  relation: (v) => (hasValue(v) ? null : err('validation.required')),
  mobile: (v) => {
    if (!hasValue(v)) return err('validation.required')
    return isMobile(v) ? null : err('validation.mobile')
  },
  email: (v) => {
    if (!hasValue(v)) return null
    return isEmail(v) ? null : err('validation.email')
  },
  presentAddress: (v) => (hasValue(v) ? minLength(v, 8) : err('validation.required')),
  upazila: (v) => (hasValue(v) ? null : err('validation.required')),
  district: (v) => (hasValue(v) ? null : err('validation.required')),
  postalCode: (v) => {
    if (!hasValue(v)) return err('validation.required')
    return postalPattern.test(v.trim()) ? null : err('validation.postalCode')
  },
  declaration: (v) => (v ? null : err('validation.declaration')),
}

export function validateApplication(values) {
  const errors = {}
  for (const [field, rule] of Object.entries(applicationRules)) {
    const failure = rule(values[field])
    if (failure) errors[field] = failure
  }
  return errors
}
