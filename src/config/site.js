// Routes, contact values and structure only. Every display string lives in
// src/i18n/translations.js and is referenced here by key.

export const contact = {
  phone: '+880 1712-345678',
  phoneAlt: '+880 2-9887665',
  email: 'info@shyampur.edu.bd',
  mapEmbedUrl: '',
  social: {
    facebook: '',
    youtube: '',
  },
}

export const telHref = (phone) => `tel:${phone.replace(/\s/g, '')}`

export const navLinks = [
  { to: '/', key: 'nav.home' },
  { to: '/about', key: 'nav.about' },
  { to: '/academics', key: 'nav.academics' },
  { to: '/teachers', key: 'nav.teachers' },
  { to: '/notices', key: 'nav.notices' },
  { to: '/contact', key: 'nav.contact' },
]

export const footerGroups = [
  {
    titleKey: 'footer.groupInstitution',
    items: [
      { to: '/about', key: 'footer.linkAbout' },
      { to: '/teachers', key: 'footer.linkTeachers' },
      { to: '/contact', key: 'footer.linkContact' },
    ],
  },
  {
    titleKey: 'footer.groupAcademic',
    items: [
      { to: '/academics', key: 'footer.linkClasses' },
      { to: '/academics', key: 'footer.linkExamRoutine' },
      { to: '/academics', key: 'footer.linkCalendar' },
    ],
  },
  {
    titleKey: 'footer.groupServices',
    items: [
      { to: '/admission', key: 'footer.linkAdmission' },
      { to: '/notices', key: 'footer.linkNotices' },
      { to: '/contact', key: 'footer.linkContact' },
    ],
  },
]

export const legalLinks = [
  { to: '/privacy', key: 'footer.privacy' },
  { to: '/terms', key: 'footer.terms' },
]
