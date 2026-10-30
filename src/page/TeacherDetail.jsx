import { Link, useParams } from 'react-router-dom'
import PageHeader from '../component/ui/PageHeader'
import ContentImage from '../component/Content/ContentImage'
import EmptyState from '../component/ui/EmptyState'
import LoadingState from '../component/ui/LoadingState'
import Button from '../component/ui/Button'
import { Icon } from '../component/ui/Icon'
import useContent from '../hook/useContent'
import useLanguage from '../hook/useLanguage'
import { mediaUrl } from '../config/api'
import { telHref } from '../config/site'
import { pickLanguageText, splitSubjects } from '../util/localised'

const GROUP = {
  principal: { eyebrow: 'teachers.principalEyebrow', photoLabel: 'teachers.principalLabel' },
  faculty: { eyebrow: 'teachers.facultyEyebrow', photoLabel: 'teachers.facultyLabel' },
  staff: { eyebrow: 'teachers.staffEyebrow', photoLabel: 'teachers.staffLabel' },
}

function Field({ label, text }) {
  if (!text) return null

  return (
    <div className="flex flex-col gap-2 border-t border-base-300 pt-5">
      <h2 className="text-xs font-semibold tracking-wide text-base-content/50 uppercase">{label}</h2>
      <p className="text-sm leading-relaxed text-base-content/75 whitespace-pre-line">{text}</p>
    </div>
  )
}

export default function TeacherDetail() {
  const { t, lang, tNumber } = useLanguage()
  const { teacherById, loading } = useContent()
  const { id } = useParams()

  const teacher = teacherById(id)

  if (!teacher) {
    return (
      <section className="border-t border-base-300 bg-base-100 py-14 sm:py-16">
        <div className="mx-auto flex w-full max-w-5xl flex-col gap-8 px-4 sm:px-6">
          {loading ? (
            <LoadingState />
          ) : (
            <EmptyState
              icon="users"
              title={t('teachers.notFoundTitle')}
              description={t('teachers.notFoundBody')}
              action={
                <Button to="/teachers" size="sm" variant="light">
                  {t('teachers.backToTeachers')}
                </Button>
              }
            />
          )}
        </div>
      </section>
    )
  }

  const group = GROUP[teacher.group] ?? GROUP.faculty
  const name = pickLanguageText(teacher.name, lang) || t('admin.untitled')
  const designation = pickLanguageText(teacher.designation, lang)
  const subjects = splitSubjects(pickLanguageText(teacher.subjects, lang))

  return (
    <>
      <PageHeader
        title={name}
        description={designation || undefined}
        breadcrumb={[{ label: t('nav.teachers'), to: '/teachers' }, { label: name }]}
      />

      <section className="border-t border-base-300 bg-base-100 py-12 sm:py-16">
        <div className="mx-auto grid w-full max-w-5xl gap-8 px-4 sm:px-6 lg:grid-cols-[minmax(0,20rem)_minmax(0,1fr)] lg:gap-12">
          <div>
            <ContentImage
              src={teacher.mediaId ? mediaUrl(teacher.mediaId) : ''}
              alt={name}
              label={t(group.photoLabel)}
              ratio="aspect-[3/4]"
              fit="contain"
              className="border-0"
            />
          </div>

          <div className="flex flex-col gap-5">
            <div className="flex flex-wrap items-center gap-2">
              <span className="badge badge-outline border-secondary/40 bg-secondary/5 py-3 font-medium text-secondary">
                {t(group.eyebrow)}
              </span>
              {teacher.experienceYears > 0 && (
                <span className="badge badge-ghost py-3 font-normal">
                  {t('teachers.experienceYears', { n: tNumber(String(teacher.experienceYears)) })}
                </span>
              )}
            </div>

            {subjects.length > 0 && (
              <div className="flex flex-col gap-2">
                <h2 className="text-xs font-semibold tracking-wide text-base-content/50 uppercase">
                  {t('teachers.subjectsTitle')}
                </h2>
                <div className="flex flex-wrap gap-1.5">
                  {subjects.map((subject) => (
                    <span key={subject} className="badge badge-ghost badge-sm font-normal">
                      {subject}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {(teacher.email || teacher.phone) && (
              <div className="flex flex-col gap-2">
                <h2 className="text-xs font-semibold tracking-wide text-base-content/50 uppercase">
                  {t('teachers.contactTitle')}
                </h2>
                <div className="flex flex-wrap gap-x-5 gap-y-2">
                  {teacher.email && (
                    <a
                      href={`mailto:${teacher.email}`}
                      className="inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:underline"
                    >
                      <Icon name="mail" className="h-4 w-4" />
                      <span className="break-all">{teacher.email}</span>
                    </a>
                  )}
                  {teacher.phone && (
                    <a
                      href={telHref(teacher.phone)}
                      className="inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:underline"
                    >
                      <Icon name="phone" className="h-4 w-4" />
                      {teacher.phone}
                    </a>
                  )}
                </div>
              </div>
            )}

            <Field label={t('teachers.qualLabel')} text={pickLanguageText(teacher.qualification, lang)} />
            <Field label={t('teachers.backgroundLabel')} text={pickLanguageText(teacher.background, lang)} />
            <Field label={t('teachers.experienceLabel')} text={pickLanguageText(teacher.experience, lang)} />

            <Link to="/teachers" className="inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:underline">
              <Icon name="arrowRight" className="h-4 w-4 rotate-180" />
              {t('teachers.backToTeachers')}
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}
