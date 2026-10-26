import { createContext, useContext } from 'react'

export const LanguageContext = createContext(null)

export default function useLanguage() {
  const context = useContext(LanguageContext)
  if (!context) throw new Error('useLanguage must be used inside <LanguageProvider>')
  return context
}
