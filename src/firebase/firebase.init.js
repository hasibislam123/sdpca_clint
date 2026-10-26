import { getApp, getApps, initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'

const env = import.meta.env

// Client-side identifiers only, as published by Firebase for a web app. A service account key must
// never reach this file, .env or the bundle.
const config = {
  apiKey: env.VITE_FIREBASE_API_KEY,
  authDomain: env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: env.VITE_FIREBASE_APP_ID,
}

// A copied-but-never-filled .env is the most common cause of "sign-in does nothing": Firebase then
// answers with errors that look like bad credentials. Treat template values as absent instead.
const templatePattern = /^(?:your[\s_-]|replace[\s_-]|paste[\s_-]|changeme|todo|todo:|fixme|<|\{|\[|null|undefined|n\/a$)/i
const isUsable = (value) => {
  const text = String(value ?? '').trim()
  if (text === '' || templatePattern.test(text)) return false
  return !/x{6,}|placeholder|example\.com|devtest/i.test(text)
}

const requiredEnvKeys = {
  apiKey: 'VITE_FIREBASE_API_KEY',
  authDomain: 'VITE_FIREBASE_AUTH_DOMAIN',
  projectId: 'VITE_FIREBASE_PROJECT_ID',
  appId: 'VITE_FIREBASE_APP_ID',
}

// Only the four values Firebase Auth needs are required; bucket and sender are optional here.
export const missingEnvKeys = Object.entries(requiredEnvKeys)
  .filter(([field]) => !isUsable(config[field]))
  .map(([, name]) => name)

export const isFirebaseConfigured = missingEnvKeys.length === 0

let auth = null

if (isFirebaseConfigured) {
  const app = getApps().length ? getApp() : initializeApp(config)
  auth = getAuth(app)
} else if (import.meta.env.DEV) {
  // Names only: never print configured values to the console.
  console.warn(
    `[firebase] Sign-in is disabled until .env provides ${missingEnvKeys.join(', ')}. ` +
      'Copy the values from Firebase Console -> Project settings -> Your apps -> Web app, then restart `npm run dev`.',
  )
}

export { auth }
