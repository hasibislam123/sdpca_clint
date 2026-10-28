import { useCallback, useEffect, useMemo, useState } from 'react'
import { ContentContext } from '../hook/useContent'
import { apiPublicContent } from '../api/content'
import { mediaUrl } from '../config/api'

const EMPTY = { pages: {}, cards: [], notices: [], teachers: [] }

// Wording saved in MongoDB is reshaped into the same { lang: { page: { key: text } } } form the
// built-in dictionary uses, so it merges into t() instead of replacing it.
function buildOverrides(pages) {
  const overrides = { en: {}, bn: {} }

  for (const [page, document] of Object.entries(pages ?? {})) {
    for (const language of Object.keys(overrides)) {
      const texts = document?.texts?.[language]
      if (!texts || Object.keys(texts).length === 0) continue
      overrides[language][page] = { ...overrides[language][page], ...texts }
    }
  }

  return overrides
}

const pinnedFirst = (a, b) => Number(b.pinned) - Number(a.pinned) || new Date(b.noticeDate) - new Date(a.noticeDate)

export default function ContentProvider({ children }) {
  const [payload, setPayload] = useState(EMPTY)
  const [status, setStatus] = useState('loading')
  const [token, setToken] = useState(0)

  useEffect(() => {
    let active = true

    apiPublicContent().then(
      (data) => {
        if (!active) return
        setPayload(data && typeof data === 'object' ? { ...EMPTY, ...data } : EMPTY)
        setStatus('ready')
      },
      () => {
        if (!active) return
        // Nothing saved yet, or the API is down: every page keeps its built-in wording and its
        // placeholder sections. Content is an enhancement, never a dependency for reading the site.
        setPayload(EMPTY)
        setStatus('offline')
      },
    )

    return () => {
      active = false
    }
  }, [token])

  const refresh = useCallback(() => setToken((current) => current + 1), [])

  const overrides = useMemo(() => buildOverrides(payload.pages), [payload.pages])

  const grouped = useMemo(() => {
    const map = new Map()
    for (const card of payload.cards) {
      if (!card.active) continue
      const key = `${card.page}.${card.slot}`
      if (!map.has(key)) map.set(key, [])
      map.get(key).push(card)
    }
    for (const list of map.values()) list.sort((a, b) => a.sort - b.sort || a.id.localeCompare(b.id))
    return map
  }, [payload.cards])

  const cardsFor = useCallback((page, slot) => grouped.get(`${page}.${slot}`) ?? [], [grouped])

  // Teachers arrive from the database already visible-only and in the admin's order, so the client
  // only splits them into the two sections the public page has.
  const teachersByGroup = useMemo(() => {
    const map = new Map()
    for (const teacher of payload.teachers) {
      if (!map.has(teacher.group)) map.set(teacher.group, [])
      map.get(teacher.group).push(teacher)
    }
    return map
  }, [payload.teachers])

  const teachersFor = useCallback((group) => teachersByGroup.get(group) ?? [], [teachersByGroup])

  // A profile page looks a teacher up by id. Only visible teachers are in the payload at all, so a
  // hidden profile simply has no details page — no separate filter to forget to apply.
  const teachersById = useMemo(() => new Map(payload.teachers.map((teacher) => [teacher.id, teacher])), [payload.teachers])
  const teacherById = useCallback((id) => teachersById.get(id) ?? null, [teachersById])

  const imageFor = useCallback(
    (page, slot) => {
      const mediaId = payload.pages?.[page]?.images?.[slot]
      return mediaId ? mediaUrl(mediaId) : ''
    },
    [payload.pages],
  )

  const notices = useMemo(() => [...payload.notices].filter((notice) => notice.publish).sort(pinnedFirst), [payload.notices])

  const value = useMemo(
    () => ({
      overrides,
      cardsFor,
      teachersFor,
      teacherById,
      imageFor,
      notices,
      status,
      loading: status === 'loading',
      refresh,
    }),
    [overrides, cardsFor, teachersFor, teacherById, imageFor, notices, status, refresh],
  )

  return <ContentContext.Provider value={value}>{children}</ContentContext.Provider>
}
