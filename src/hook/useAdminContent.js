import { createContext, useContext } from 'react'

export const AdminContentContext = createContext(null)

export default function useAdminContent() {
  const context = useContext(AdminContentContext)
  if (!context) throw new Error('useAdminContent must be used inside <AdminContentProvider>')
  return context
}
