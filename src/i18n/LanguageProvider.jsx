import { useCallback, useEffect, useMemo, useState } from 'react'
import { LanguageContext } from '../hook/useLanguage'
import { translations } from './translations'
import { toBanglaDigits } from '../util/bn'

const STORAGE_KEY = 'sms.lang'
const FALLBACK = 'en'

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
  const [lang, setLangState] = useState(readStoredLanguage)

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
      const value = resolve(translations[lang] ?? translations[FALLBACK], key)
      if (typeof value !== 'string') return interpolate(resolve(translations[FALLBACK], key) ?? key, vars)
      return interpolate(value, vars)
    },
    [lang],
  )

  const tNumber = useCallback((value) => (lang === 'bn' ? toBanglaDigits(value) : String(value)), [lang])

  useEffect(() => {
    const dictionary = translations[lang] ?? translations[FALLBACK]
    document.documentElement.lang = dictionary.meta.htmlLang
    document.title = dictionary.meta.documentTitle
  }, [lang])

  const value = useMemo(() => ({ lang, setLang, t, tNumber }), [lang, setLang, t, tNumber])

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>
}
