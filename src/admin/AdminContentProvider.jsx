import { useCallback, useEffect, useMemo, useState } from 'react'
import { AdminContentContext } from '../hook/useAdminContent'
import {
  apiAdminContent,
  apiContentSchema,
  apiCreateCard,
  apiCreateNotice,
  apiCreateTeacher,
  apiDeleteCard,
  apiDeleteMedia,
  apiDeleteNotice,
  apiDeleteTeacher,
  apiSavePage,
  apiUpdateCard,
  apiUpdateNotice,
  apiUpdateTeacher,
  apiUploadMedia,
} from '../api/content'
import { authErrorKey } from '../api/authErrors'
import useContent from '../hook/useContent'

const EMPTY_SCHEMA = { pages: {}, limits: {}, icons: [], languages: ['en', 'bn'], teacherGroups: ['faculty', 'staff'] }
const EMPTY_DATA = { pages: {}, cards: [], notices: [], media: [], teachers: [] }

const readAsDataUrl = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(String(reader.result))
    reader.onerror = () => reject(new Error('read-failed'))
    reader.readAsDataURL(file)
  })

// One source of truth for the dashboard: the editable surface comes from the server's schema, so the
// UI can only ever offer fields the API is prepared to accept.
export default function AdminContentProvider({ children }) {
  const { refresh: refreshPublic } = useContent()
  const [schema, setSchema] = useState(EMPTY_SCHEMA)
  const [data, setData] = useState(EMPTY_DATA)
  const [status, setStatus] = useState('loading')
  const [busy, setBusy] = useState(false)
  const [failure, setFailure] = useState(null)
  const [savedAt, setSavedAt] = useState(0)
  const [token, setToken] = useState(0)

  const reload = useCallback(() => setToken((current) => current + 1), [])

  useEffect(() => {
    let active = true

    Promise.all([apiContentSchema(), apiAdminContent()]).then(
      ([nextSchema, nextData]) => {
        if (!active) return
        setSchema({ ...EMPTY_SCHEMA, ...nextSchema })
        setData({ ...EMPTY_DATA, ...nextData })
        setFailure(null)
        setStatus('ready')
      },
      (error) => {
        if (!active) return
        setFailure({ key: authErrorKey(error), fields: error?.fields })
        setStatus('error')
      },
    )

    return () => {
      active = false
    }
  }, [token])

  // Every write is followed by a reload, so what the dashboard shows is what the database holds —
  // including the new version number that optimistic page saving depends on.
  const run = useCallback(
    async (work) => {
      setBusy(true)
      setFailure(null)
      try {
        const result = await work()
        reload()
        refreshPublic()
        setSavedAt(Date.now())
        return result
      } catch (error) {
        setFailure({ key: authErrorKey(error), fields: error?.fields })
        return null
      } finally {
        setBusy(false)
      }
    },
    [reload, refreshPublic],
  )

  const value = useMemo(
    () => ({
      schema,
      pages: data.pages,
      cards: data.cards,
      notices: data.notices,
      media: data.media,
      teachers: data.teachers,
      status,
      busy,
      failure,
      savedAt,
      reload,
      savePage: (page, payload) => run(() => apiSavePage(page, payload)),
      saveCard: (card) => run(() => (card.id ? apiUpdateCard(card.id, card) : apiCreateCard(card))),
      deleteCard: (id) => run(() => apiDeleteCard(id)),
      saveNotice: (notice) => run(() => (notice.id ? apiUpdateNotice(notice.id, notice) : apiCreateNotice(notice))),
      deleteNotice: (id) => run(() => apiDeleteNotice(id)),
      saveTeacher: (teacher) => run(() => (teacher.id ? apiUpdateTeacher(teacher.id, teacher) : apiCreateTeacher(teacher))),
      deleteTeacher: (id) => run(() => apiDeleteTeacher(id)),
      uploadImage: async (file, alt) => {
        const dataUrl = await readAsDataUrl(file)
        return run(() => apiUploadMedia(dataUrl, alt))
      },
      deleteImage: (id) => run(() => apiDeleteMedia(id)),
    }),
    [schema, data, status, busy, failure, savedAt, reload, run],
  )

  return <AdminContentContext.Provider value={value}>{children}</AdminContentContext.Provider>
}
