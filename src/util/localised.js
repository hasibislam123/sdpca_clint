// Saved content carries both languages. Missing Bangla falls back to English rather than showing a
// blank card, which is what an admin mid-translation leaves behind.
export function pickLanguageText(value, lang, fallback = '') {
  if (!value || typeof value !== 'object') return fallback

  const preferred = value[lang]
  if (typeof preferred === 'string' && preferred !== '') return preferred

  const english = value.en
  if (typeof english === 'string' && english !== '') return english

  return fallback
}

// Subjects are stored as one text field so an admin writes them the way they read them; the cards and
// the profile page both split the separators out of it.
export const splitSubjects = (text) =>
  String(text ?? '')
    .split(/[,،;；]/)
    .map((part) => part.trim())
    .filter(Boolean)

export const formatNoticeDate = (date, lang) => {
  const value = date instanceof Date ? date : new Date(date)
  if (Number.isNaN(value.getTime())) return ''
  return new Intl.DateTimeFormat(lang === 'bn' ? 'bn-BD-u-nu-latn' : 'en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(value)
}
