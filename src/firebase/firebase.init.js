import { getApp, getApps, initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'

// Client-side identifiers only, as published by Firebase for a web app. A service account key must
// never reach this file, .env or the bundle.
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
}

// A copied-but-never-filled .env is the most common cause of "sign-in does nothing": Firebase then
// answers with errors that look like bad credentials. Treat template values as absent instead.
const templatePattern = /^(?:your[\s_-]|replace[\s_-]|paste[\s_-]|changeme|todo|todo:|fixme|<|\{|\[|null|undefined|n\/a$)/i

const isUsable = (value) => {
  const text = String(value ?? '').trim()
  if (text === '' || templatePattern.test(text)) return false
  return !/x{6,}|placeholder|devtest/i.test(text)
}

// Only these four are needed for Firebase Auth; bucket and sender id stay optional here.
const requiredEnvKeys = {
  apiKey: 'VITE_FIREBASE_API_KEY',
  authDomain: 'VITE_FIREBASE_AUTH_DOMAIN',
  projectId: 'VITE_FIREBASE_PROJECT_ID',
  appId: 'VITE_FIREBASE_APP_ID',
}

// Raised by the auth layer itself when .env has no usable Firebase values.
export const NOT_CONFIGURED_ERROR = 'firebase-not-configured'

export const missingEnvKeys = Object.entries(requiredEnvKeys)
  .filter(([field]) => !isUsable(firebaseConfig[field]))
  .map(([, name]) => name)

export const isFirebaseConfigured = missingEnvKeys.length === 0

// Initializing Firebase with empty values makes every request fail in a way that looks like a wrong
// password, so the app is only created once .env is usable.
const app = isFirebaseConfigured ? (getApps().length ? getApp() : initializeApp(firebaseConfig)) : null

export const auth = app ? getAuth(app) : null

if (!isFirebaseConfigured && import.meta.env.DEV) {
  // Names only: never print configured values to the console.
  console.warn(
    `[firebase] Sign-in is disabled until .env provides ${missingEnvKeys.join(', ')}. ` +
      'Copy the values from Firebase Console -> Project settings -> Your apps -> Web app, then restart `npm run dev`.',
  )
}

export default app
