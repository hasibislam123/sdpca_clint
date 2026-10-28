import { apiBaseUrl } from '../config/api'

// Carries the server's machine-readable code rather than its prose, so the UI can localise it.
export class ApiClientError extends Error {
  constructor(code, status, fields) {
    super(code)
    this.name = 'ApiClientError'
    this.code = code
    this.status = status
    this.fields = fields
  }

  get isNetwork() {
    return this.code === 'network'
  }
}

export async function request(path, { method = 'GET', body } = {}) {
  let response

  try {
    response = await fetch(`${apiBaseUrl}${path}`, {
      method,
      // The session lives in an httpOnly cookie, so the browser must be allowed to send it.
      credentials: 'include',
      headers: body === undefined ? undefined : { 'Content-Type': 'application/json' },
      body: body === undefined ? undefined : JSON.stringify(body),
    })
  } catch {
    throw new ApiClientError('network', 0)
  }

  if (response.status === 204) return null

  const payload = await response.json().catch(() => null)

  if (!response.ok) {
    throw new ApiClientError(payload?.error?.code ?? 'server_error', response.status, payload?.error?.fields)
  }

  return payload
}

export const apiLogin = (email, password) =>
  request('/auth/login', { method: 'POST', body: { email, password } })

export const apiRegister = (name, email, password) =>
  request('/auth/register', { method: 'POST', body: { name, email, password } })

// The Firebase ID token is exchanged for this site's own session cookie. From here on the browser
// never has to look at Firebase again, and the role comes back from the database.
export const apiGoogleSession = (idToken) =>
  request('/auth/google', { method: 'POST', body: { idToken } })

export const apiAuthConfig = () => request('/auth/config')

export const apiLogout = () => request('/auth/logout', { method: 'POST' })

// 401 is the normal answer for a visitor, so it resolves to "nobody is signed in" instead of
// throwing. Anything else — including the API being unreachable — is a real failure for the caller.
export async function apiSession() {
  try {
    const payload = await request('/auth/me')
    return payload?.user ?? null
  } catch (error) {
    if (error instanceof ApiClientError && error.status === 401) return null
    throw error
  }
}
