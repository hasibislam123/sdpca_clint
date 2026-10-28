// Same-origin by default: vite.config.js proxies /api to the Express server in development, so the
// browser sends the session cookie without any cross-origin plumbing. Set VITE_API_BASE_URL to an
// absolute origin (https://api.example.com/api) only when the API is deployed elsewhere, and
// add that browser origin to CLIENT_ORIGIN in the server's .env.
const configured = String(import.meta.env.VITE_API_BASE_URL ?? '').trim()

export const apiBaseUrl = (configured || '/api').replace(/\/+$/, '')

// Public on purpose: an <img> element cannot send a session cookie, and site imagery is not private.
export const mediaUrl = (mediaId) => `${apiBaseUrl}/media/${String(mediaId).replace(/[^0-9a-f]/gi, '')}`
