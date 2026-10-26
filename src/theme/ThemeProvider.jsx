import { useCallback, useEffect, useMemo, useState } from 'react'
import { ThemeContext } from '../hook/useTheme'
import { THEME_STORAGE_KEY, themes } from './themes'

const mediaQuery = '(prefers-color-scheme: dark)'

function systemTheme() {
  return window.matchMedia?.(mediaQuery).matches ? 'dark' : 'light'
}

function readStoredTheme() {
  try {
    const stored = window.localStorage.getItem(THEME_STORAGE_KEY)
    if (stored === 'light' || stored === 'dark') return stored
  } catch {
    /* storage unavailable — fall through to the system preference */
  }
  return systemTheme()
}

function hasSavedPreference() {
  try {
    const stored = window.localStorage.getItem(THEME_STORAGE_KEY)
    return stored === 'light' || stored === 'dark'
  } catch {
    return true
  }
}

export default function ThemeProvider({ children }) {
  const [mode, setModeState] = useState(readStoredTheme)

  const setMode = useCallback((next) => {
    const value = next === 'dark' ? 'dark' : 'light'
    setModeState(value)
    try {
      window.localStorage.setItem(THEME_STORAGE_KEY, value)
    } catch {
      /* storage unavailable — the in-memory theme still applies */
    }
  }, [])

  const toggle = useCallback(() => setMode(mode === 'dark' ? 'light' : 'dark'), [mode, setMode])

  useEffect(() => {
    const root = document.documentElement
    const theme = themes[mode]
    root.setAttribute('data-theme', theme.name)
    root.style.colorScheme = mode

    const meta = document.querySelector('meta[name="theme-color"]')
    if (meta) meta.setAttribute('content', theme.chromeColor)
  }, [mode])

  useEffect(() => {
    const media = window.matchMedia?.(mediaQuery)
    if (!media) return

    const onChange = (event) => {
      if (hasSavedPreference()) return
      setModeState(event.matches ? 'dark' : 'light')
    }

    media.addEventListener('change', onChange)
    return () => media.removeEventListener('change', onChange)
  }, [])

  const value = useMemo(() => ({ mode, setMode, toggle }), [mode, setMode, toggle])

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
}
