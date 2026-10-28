import { useCallback, useEffect, useMemo, useState } from 'react'
import { LanguageContext } from '../hook/useLanguage'
import useContent from '../hook/useContent'
import { translations } from './translations'
import { toBanglaDigits } from '../util/bn'

const STORAGE_KEY = 'sms.lang'
const FALLBACK = 'en'

const UNSAFE_KEY = /^(?:__proto__|constructor|prototype)$/

// Saved wording sits on top of the built-in dictionary rather than replacing it: an empty field in
// the database means "use the shipped wording", so a page can never be blanked by a half-filled
// translation and clearing a field is how an admin reverts a single string.
function mergeDictionary(base, patch) {
  if (!patch) return base

  const out = { ...base }
  for (const [key, value] of Object.entries(patch)) {
    if (UNSAFE_KEY.test(key)) continue
    const existing = out[key]

    if (value && typeof value === 'object') {
      out[key] = mergeDictionary(existing, value)
    } else if (typeof value === 'string' && value !== '') {
      out[key] = value
    }
  }
  return out
}

function readStoredLanguage() {
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY)
    return stored && stored in translations ? stored : FALLBACK
  } catch {
    return FALLBACK
  }
}

function resolve(dictionary, key) {
  return key.split('.').reduce((node, part) => (node == null ? undefined : node[part]), dictionary)
}

function interpolate(template, vars) {
  if (!vars) return template
  return template.replace(/\{(\w+)\}/g, (match, name) => (name in vars ? String(vars[name]) : match))
}

export default function LanguageProvider({ children }) {
  const { overrides } = useContent()
  const [lang, setLangState] = useState(readStoredLanguage)

  const dictionary = useMemo(
    () => mergeDictionary(translations[lang] ?? translations[FALLBACK], overrides[lang]),
    [lang, overrides],
  )

  const fallbackDictionary = useMemo(
    () => mergeDictionary(translations[FALLBACK], overrides[FALLBACK]),
    [overrides],
  )

  const setLang = useCallback((next) => {
    const code = next in translations ? next : FALLBACK
    setLangState(code)
    try {
      window.localStorage.setItem(STORAGE_KEY, code)
    } catch {
      /* storage unavailable — the in-memory language still applies */
    }
  }, [])

  const t = useCallback(
    (key, vars) => {
      const value = resolve(dictionary, key)
      if (typeof value !== 'string') return interpolate(resolve(fallbackDictionary, key) ?? key, vars)
      return interpolate(value, vars)
    },
    [dictionary, fallbackDictionary],
  )

  const tNumber = useCallback((value) => (lang === 'bn' ? toBanglaDigits(value) : String(value)), [lang])

  useEffect(() => {
    document.documentElement.lang = dictionary.meta.htmlLang
    document.title = dictionary.meta.documentTitle
  }, [dictionary])

  const value = useMemo(() => ({ lang, setLang, t, tNumber }), [lang, setLang, t, tNumber])

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>
}
