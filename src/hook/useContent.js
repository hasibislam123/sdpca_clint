import { createContext, useContext } from 'react'

export const ContentContext = createContext(null)

export default function useContent() {
  const context = useContext(ContentContext)
  if (!context) throw new Error('useContent must be used inside <ContentProvider>')
  return context
}
