import { useCallback, useEffect, useMemo, useState } from 'react'
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth'
import { AuthContext } from '../hook/useAuth'
import {
  ApiClientError,
  apiAuthConfig,
  apiGoogleSession,
  apiLogin,
  apiLogout,
  apiRegister,
  apiSession,
} from '../api/client'
import { NOT_CONFIGURED_ERROR, auth, isFirebaseConfigured } from '../firebase/firebase.init'

const isOffline = (error) => error instanceof ApiClientError && error.isNetwork

// The account picker is requested every time, so a shared or family Google session cannot silently
// sign the guardian in as whoever the browser happens to remember.
const googleProvider = new GoogleAuthProvider()
googleProvider.setCustomParameters({ prompt: 'select_account' })

export default function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  // Stays true until the API answers, so ProtectedRoute never bounces a signed-in guardian to the
  // login page while the session cookie is still being checked.
  const [loading, setLoading] = useState(true)
  const [apiOnline, setApiOnline] = useState(true)
  // Firebase on this client decides whether a Google popup can run at all. The API only gets to
  // veto: an explicit googleSignIn:false hides the button, but an older or unreachable API that
  // never answers the config request is silence, not a refusal, and must not hide it.
  const [googleSignIn, setGoogleSignIn] = useState(isFirebaseConfigured)

  useEffect(() => {
    let active = true

    apiSession().then(
      (next) => {
        if (!active) return
        setUser(next)
        setLoading(false)
      },
      (error) => {
        if (!active) return
        setUser(null)
        setLoading(false)
        if (isOffline(error)) setApiOnline(false)
      },
    )

    apiAuthConfig().then(
      (config) => {
        if (active) setGoogleSignIn(isFirebaseConfigured && Boolean(config?.googleSignIn))
      },
      () => {
        /* nothing heard: keep the value derived from Firebase, since the server never declined */
      },
    )

    return () => {
      active = false
    }
  }, [])

  const login = useCallback(async (email, password) => {
    try {
      const payload = await apiLogin(email, password)
      setUser(payload.user)
      setApiOnline(true)
      return payload.user
    } catch (error) {
      if (isOffline(error)) setApiOnline(false)
      throw error
    }
  }, [])

  const register = useCallback(async (email, password, fullName) => {
    try {
      const payload = await apiRegister(fullName.trim(), email.trim(), password)
      setUser(payload.user)
      setApiOnline(true)
      return payload.user
    } catch (error) {
      if (isOffline(error)) setApiOnline(false)
      throw error
    }
  }, [])

  // Firebase only ever runs the Google popup here. The ID token it returns is exchanged for this
  // site's own session cookie, so the account, the role and every later decision live in MongoDB.
  const loginWithGoogle = useCallback(async () => {
    if (!googleSignIn) throw new ApiClientError('google_not_configured', 503)
    if (!auth) throw new Error(NOT_CONFIGURED_ERROR)

    const outcome = await signInWithPopup(auth, googleProvider)
    const idToken = await outcome.user.getIdToken()

    try {
      const payload = await apiGoogleSession(idToken)
      setUser(payload.user)
      setApiOnline(true)
      return payload.user
    } catch (error) {
      if (isOffline(error)) setApiOnline(false)
      throw error
    }
  }, [googleSignIn])

  const logout = useCallback(async () => {
    // Clear locally first: if the API is unreachable the guardian still leaves the signed-in state,
    // and the session cookie expires on its own server-side.
    setUser(null)
    try {
      await apiLogout()
      setApiOnline(true)
    } catch (error) {
      if (isOffline(error)) setApiOnline(false)
    }
  }, [])

  const value = useMemo(
    () => ({
      user,
      isAuthenticated: Boolean(user),
      // Read from the role the server sent with the session. Nothing here trusts anything the
      // browser stores; a refreshed page re-reads it from /api/auth/me.
      isAdmin: user?.role === 'admin',
      loading,
      apiOnline,
      googleSignIn,
      login,
      register,
      loginWithGoogle,
      logout,
    }),
    [user, loading, apiOnline, googleSignIn, login, register, loginWithGoogle, logout],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
