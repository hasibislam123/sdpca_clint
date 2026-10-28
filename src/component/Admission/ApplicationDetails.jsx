import useLanguage from '../../hook/useLanguage'
import { formatNoticeDate } from '../../util/localised'

// Soft variants only: a solid badge is a filled background, and a browser printing without backgrounds
// would hand the school a white rectangle where the decision was.
const statusClass = {
  submitted: 'badge-soft badge-primary',
  under_review: 'badge-soft badge-info',
  approved: 'badge-soft badge-success',
  declined: 'badge-soft badge-error',
}

export function StatusBadge({ status }) {
  const { t } = useLanguage()
  return (
    <span className={`badge w-fit ${statusClass[status] ?? 'badge-soft'}`}>{t(`admissionStatus.${status}`)}</span>
  )
}

// The four blocks the guardian filled in, in the same order and with the same labels. Both the
// confirmation sheet and the admin review read a stored application through this, so the two views
// cannot drift apart into showing different answers for the same file.
const sections = (t, lang) => [
  {
    key: 'student',
    eyebrow: t('admissionForm.studentEyebrow'),
    title: t('admissionForm.studentTitle'),
    rows: [
      ['studentName', t('admissionForm.studentName')],
      ['className', t('admissionForm.className'), (value) => t(`options.class.${value}`)],
      ['gender', t('admissionForm.gender'), (value) => t(`options.gender.${value}`)],
      ['dateOfBirth', t('admissionForm.dateOfBirth'), (value) => formatNoticeDate(value, lang)],
      ['birthRegistrationNumber', t('admissionForm.birthRegistration')],
      ['institutionName', t('admissionForm.institution')],
    ],
  },
  {
    key: 'guardian',
    eyebrow: t('admissionForm.guardianEyebrow'),
    title: t('admissionForm.guardianTitle'),
    rows: [
      ['guardianName', t('admissionForm.guardianName')],
      ['relation', t('admissionForm.relation'), (value) => t(`options.relation.${value}`)],
      ['mobile', t('admissionForm.mobile')],
      ['email', t('admissionForm.email')],
    ],
  },
  {
    key: 'address',
    eyebrow: t('admissionForm.addressEyebrow'),
    title: t('admissionForm.addressTitle'),
    rows: [
      ['presentAddress', t('admissionForm.presentAddress')],
      ['upazila', t('admissionForm.upazila')],
      ['district', t('admissionForm.district')],
      ['postalCode', t('admissionForm.postalCode')],
    ],
  },
  {
    key: 'extra',
    eyebrow: t('admissionForm.extraEyebrow'),
    title: t('admissionForm.extraTitle'),
    rows: [['medical', t('admissionForm.medical')]],
  },
]

function Row({ label, value }) {
  return (
    <div className="flex flex-col gap-0.5 border-b border-base-300 py-2.5 last:border-0 sm:flex-row sm:items-baseline sm:gap-4">
      <dt className="shrink-0 text-xs font-medium uppercase tracking-wide text-base-content/50 sm:w-52">{label}</dt>
      <dd className="min-w-0 whitespace-pre-line break-words text-sm text-base-content">{value || '—'}</dd>
    </div>
  )
}

function DetailGroup({ eyebrow, title, children }) {
  return (
    <section className="flex flex-col gap-1 rounded-box border border-base-300 bg-base-100 p-4 sm:p-5">
      <h3 className="text-xs font-medium uppercase tracking-wide text-secondary">{eyebrow}</h3>
      <p className="mb-1 text-base font-semibold text-base-content sm:text-lg">{title}</p>
      <dl className="flex flex-col">{children}</dl>
    </section>
  )
}

export default function ApplicationDetails({ application }) {
  const { t, lang } = useLanguage()

  return (
    <div className="flex flex-col gap-3">
      {sections(t, lang).map((section) => (
        <DetailGroup key={section.key} eyebrow={section.eyebrow} title={section.title}>
          {section.rows.map(([field, label, format]) => (
            <Row key={field} label={label} value={format ? format(application[field]) : application[field]} />
          ))}
        </DetailGroup>
      ))}
    </div>
  )
}
