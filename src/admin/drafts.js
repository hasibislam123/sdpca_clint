// The dashboard holds a draft of what the server says exists, so "unsaved changes" is a comparison
// rather than a flag that can drift out of sync with the fields.
export const emptyLocalised = (languages = ['en', 'bn']) => Object.fromEntries(languages.map((code) => [code, '']))

export const localisedOf = (value, languages = ['en', 'bn']) =>
  Object.fromEntries(languages.map((code) => [code, value?.[code] ?? '']))

export const emptyCard = (page, slot, languages) => ({
  page,
  slot,
  title: emptyLocalised(languages),
  meta: emptyLocalised(languages),
  description: emptyLocalised(languages),
  icon: '',
  mediaId: '',
  link: '',
  sort: 0,
  active: true,
})

export const cardDraft = (card, languages) => ({
  ...card,
  title: localisedOf(card.title, languages),
  meta: localisedOf(card.meta, languages),
  description: localisedOf(card.description, languages),
})

export const emptyNotice = (languages, noticeDate) => ({
  title: emptyLocalised(languages),
  description: emptyLocalised(languages),
  noticeDate,
  pinned: false,
  publish: true,
  mediaId: '',
})

export const noticeDraft = (notice, languages) => ({
  ...notice,
  title: localisedOf(notice.title, languages),
  description: localisedOf(notice.description, languages),
  noticeDate: isoDate(notice.noticeDate),
})

export const emptyTeacher = (group, languages) => ({
  group,
  name: emptyLocalised(languages),
  designation: emptyLocalised(languages),
  subjects: emptyLocalised(languages),
  qualification: emptyLocalised(languages),
  background: emptyLocalised(languages),
  experience: emptyLocalised(languages),
  experienceYears: 0,
  email: '',
  phone: '',
  mediaId: '',
  sort: 0,
  active: true,
})

export const teacherDraft = (teacher, languages) => ({
  ...teacher,
  name: localisedOf(teacher.name, languages),
  designation: localisedOf(teacher.designation, languages),
  subjects: localisedOf(teacher.subjects, languages),
  qualification: localisedOf(teacher.qualification, languages),
  background: localisedOf(teacher.background, languages),
  experience: localisedOf(teacher.experience, languages),
})

export const isoDate = (value) => {
  const date = value ? new Date(value) : null
  if (!date || Number.isNaN(date.getTime())) return ''
  return date.toISOString().slice(0, 10)
}

export const today = () => new Date().toISOString().slice(0, 10)

export const pageDraft = (definition, saved, languages) => ({
  texts: Object.fromEntries(
    languages.map((code) => [code, Object.fromEntries((definition?.texts ?? []).map((key) => [key, saved?.texts?.[code]?.[key] ?? '']))]),
  ),
  images: Object.fromEntries((definition?.images ?? []).map((slot) => [slot, saved?.images?.[slot] ?? ''])),
})

export const isDirty = (a, b) => JSON.stringify(a) !== JSON.stringify(b)
