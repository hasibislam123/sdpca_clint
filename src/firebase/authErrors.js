const keysByCode = {
  'auth/invalid-email': 'errors.invalidEmail',
  'auth/user-disabled': 'errors.userDisabled',
  'auth/user-not-found': 'errors.userNotFound',
  'auth/wrong-password': 'errors.wrongPassword',
  'auth/invalid-credential': 'errors.invalidCredential',
  'auth/email-already-in-use': 'errors.emailAlreadyInUse',
  'auth/weak-password': 'errors.weakPassword',
  'auth/operation-not-allowed': 'errors.operationNotAllowed',
  'auth/too-many-requests': 'errors.tooManyRequests',
  'auth/network-request-failed': 'errors.network',
  'auth/missing-password': 'errors.missingPassword',
  'auth/popup-closed-by-user': 'errors.popupClosed',
  'auth/cancelled-popup-request': 'errors.popupCancelled',
  'auth/popup-blocked': 'errors.popupBlocked',
  'auth/unauthorized-domain': 'errors.unauthorizedDomain',
  'auth/invalid-api-key': 'errors.invalidApiKey',
  'auth/configuration-not-found': 'errors.configurationNotFound',
  'auth/account-exists-with-different-credential': 'errors.accountExistsDifferent',
}

// Raised by the auth layer itself when .env has no usable Firebase values.
const sentinelKey = 'firebase-not-configured'

export const authErrorKey = (error) => {
  if (error?.message === sentinelKey) return 'errors.notConfigured'
  const code = error?.code
  if (!code) return 'errors.unknown'
  // This one arrives with a varying suffix, e.g. auth/api-key-not-valid.-please-pass-a-valid-api-key.
  if (code.startsWith('auth/api-key-not-valid')) return 'errors.invalidApiKey'
  return keysByCode[code] ?? 'errors.unknown'
}
