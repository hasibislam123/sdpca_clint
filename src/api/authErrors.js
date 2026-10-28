// Maps every failure the app can see to a translation key: the API's own codes, and the Firebase
// codes the Google popup can raise. Server and SDK text never reaches the UI directly, so every
// message stays localisable and free of implementation detail.
import { NOT_CONFIGURED_ERROR } from '../firebase/firebase.init'

const keysByCode = {
  // API codes
  validation_failed: 'errors.validationFailed',
  invalid_credentials: 'errors.invalidCredential',
  email_taken: 'errors.emailAlreadyInUse',
  rate_limited: 'errors.tooManyRequests',
  unauthorized: 'errors.sessionExpired',
  session_expired: 'errors.sessionExpired',
  service_unavailable: 'errors.serviceUnavailable',
  origin_not_allowed: 'errors.originNotAllowed',
  malformed_json: 'errors.validationFailed',
  payload_too_large: 'errors.validationFailed',
  network: 'errors.network',
  server_error: 'errors.unknown',
  not_found: 'errors.unknown',
  invalid_google_token: 'errors.googleFailed',
  google_not_configured: 'errors.googleDisabled',
  admin_only: 'errors.adminOnly',
  content_conflict: 'errors.contentConflict',
  duplicate_key: 'errors.unknown',
  unsupported_image: 'errors.unsupportedImage',
  image_too_large: 'errors.imageTooLarge',
  media_in_use: 'errors.imageInUse',
  already_applied: 'errors.alreadyApplied',

  // Firebase Auth codes, reachable only through the Google popup. Email and password never touch
  // this SDK, so credential errors from the old password flow are deliberately not listed.
  'auth/popup-closed-by-user': 'errors.popupClosed',
  'auth/cancelled-popup-request': 'errors.popupCancelled',
  'auth/popup-blocked': 'errors.popupBlocked',
  'auth/operation-not-allowed': 'errors.operationNotAllowed',
  'auth/configuration-not-found': 'errors.configurationNotFound',
  'auth/unauthorized-domain': 'errors.unauthorizedDomain',
  'auth/invalid-api-key': 'errors.invalidApiKey',
  'auth/network-request-failed': 'errors.network',
  'auth/too-many-requests': 'errors.tooManyRequests',
  'auth/user-disabled': 'errors.userDisabled',
  'auth/invalid-credential': 'errors.googleFailed',
  'auth/account-exists-with-different-credential': 'errors.accountExistsDifferent',
}

export const authErrorKey = (error) => {
  if (error?.message === NOT_CONFIGURED_ERROR) return 'errors.notConfigured'
  const code = error?.code
  if (!code || typeof code !== 'string') return 'errors.unknown'
  // This one arrives with a varying suffix, e.g. auth/api-key-not-valid.-please-pass-a-valid-api-key.
  if (code.startsWith('auth/api-key-not-valid')) return 'errors.invalidApiKey'
  return keysByCode[code] ?? 'errors.unknown'
}
