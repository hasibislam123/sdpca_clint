import { useCallback, useEffect, useMemo, useState } from 'react'
import {
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  updateProfile,
} from 'firebase/auth'
import { AuthContext } from '../hook/useAuth'
import { auth as firebaseAuth, isFirebaseConfigured } from '../firebase/firebase.init'

export default function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [sessionResolved, setSessionResolved] = useState(!isFirebaseConfigured)
  const [profileRev, setProfileRev] = useState(0)

  useEffect(() => {
    if (!firebaseAuth) return
    return onAuthStateChanged(firebaseAuth, (next) => {
      setUser(next)
      setSessionResolved(true)
    })
  }, [])

  const login = useCallback(async (email, password) => {
    if (!firebaseAuth) throw new Error('firebase-not-configured')
    const credential = await signInWithEmailAndPassword(firebaseAuth, email.trim(), password)
    return credential.user
  }, [])

  const register = useCallback(async (email, password, displayName) => {
    if (!firebaseAuth) throw new Error('firebase-not-configured')
    const credential = await createUserWithEmailAndPassword(firebaseAuth, email.trim(), password)
    const name = displayName.trim()
    if (name) {
      try {
        await updateProfile(credential.user, { displayName: name })
        // updateProfile mutates the Firebase User in place and never re-emits onAuthStateChanged,
        // so bumping a revision is what makes consumers re-read the new name.
        setProfileRev((rev) => rev + 1)
      } catch {
        // The account exists and is signed in; the missing name is cosmetic, so do not fail registration.
      }
    }
    return credential.user
  }, [])

  const loginWithGoogle = useCallback(async () => {
    if (!firebaseAuth) throw new Error('firebase-not-configured')
    const result = await signInWithPopup(firebaseAuth, new GoogleAuthProvider())
    return result.user
  }, [])

  const logout = useCallback(async () => {
    if (!firebaseAuth) return
    try {
      await signOut(firebaseAuth)
    } catch (error) {
      // The local session is already cleared when the Google revoke endpoint fails, so still sign out.
      if (error?.code !== 'auth/network-request-failed') throw error
      await signOut(firebaseAuth, { persist: false })
      setUser(null)
    }
  }, [])

  const value = useMemo(
    () => ({
      user,
      isAuthenticated: Boolean(user),
      // False until Firebase confirms the persisted session, so guards never redirect too early.
      loading: !sessionResolved,
      isFirebaseConfigured,
      login,
      register,
      loginWithGoogle,
      logout,
    }),
    // profileRev is load-bearing: updateProfile mutates the Firebase User in place, so this
    // bump is the only signal that consumers have a new name to read.
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [user, sessionResolved, profileRev, login, logout, register, loginWithGoogle],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
