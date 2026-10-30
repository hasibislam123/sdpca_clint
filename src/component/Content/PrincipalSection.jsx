import { Link } from 'react-router-dom'
import ContentImage from './ContentImage'
import ContentSection from './ContentSection'
import SectionHeading from '../ui/SectionHeading'
import { Icon } from '../ui/Icon'
import useContent from '../../hook/useContent'
import useLanguage from '../../hook/useLanguage'
import { mediaUrl } from '../../config/api'
import { telHref } from '../../config/site'
import { pickLanguageText, splitSubjects } from '../../util/localised'

// The principal is an ordinary teacher record filed under a group of their own. What makes this block
// different is the shape: one profile, photo beside details, on a tinted band — so the head of the
// school never has to share a card grid with the rest of the staff.
function PrincipalProfile({ teacher }) {
  const { t, lang, tNumber } = useLanguage()

  const name = pickLanguageText(teacher.name, lang) || t('admin.untitled')
  const designation = pickLanguageText(teacher.designation, lang)
  const subjects = splitSubjects(pickLanguageText(teacher.subjects, lang))
  const qualification = pickLanguageText(teacher.qualification, lang)

  return (
    <article className="grid gap-6 rounded-box border border-primary/20 bg-base-100 p-4 shadow-sm sm:gap-8 sm:p-6 lg:grid-cols-[minmax(0,17rem)_minmax(0,1fr)] lg:gap-10 lg:p-8">
      <div className="mx-auto w-full max-w-[16rem] lg:mx-0">
        <ContentImage
          src={teacher.mediaId ? mediaUrl(teacher.mediaId) : ''}
          alt={name}
          label={t('teachers.principalLabel')}
          ratio="aspect-[3/4]"
          fit="contain"
          className="border-primary/15 ring-primary/10 ring-4"
        />
      </div>

      <div className="flex flex-col gap-4">
        <div className="flex flex-wrap items-center gap-2">
          <span className="badge border-primary/30 bg-primary/10 py-3 font-medium text-primary">
            <Icon name="sparkle" className="me-1 h-3.5 w-3.5" />
            {t('teachers.principalEyebrow')}
          </span>
          {teacher.experienceYears > 0 && (
            <span className="badge badge-ghost py-3 font-normal">
              {t('teachers.experienceYears', { n: tNumber(String(teacher.experienceYears)) })}
            </span>
          )}
        </div>

        <div className="flex flex-col gap-1">
          <h3 className="text-xl leading-snug font-bold text-base-content sm:text-2xl">{name}</h3>
          {designation && <p className="text-sm leading-snug text-secondary sm:text-base">{designation}</p>}
        </div>

        {subjects.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {subjects.map((subject) => (
              <span key={subject} className="badge badge-ghost badge-sm font-normal">
                {subject}
              </span>
            ))}
          </div>
        )}

        {qualification && (
          <p className="line-clamp-4 text-sm leading-relaxed text-base-content/75 whitespace-pre-line">{qualification}</p>
        )}

        <div className="mt-auto flex flex-wrap items-center gap-x-5 gap-y-2 pt-1">
          <Link
            to={`/teachers/${teacher.id}`}
            className="inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:underline"
          >
            {t('teachers.viewProfile')}
            <Icon name="arrowRight" className="h-4 w-4" />
          </Link>
          {teacher.email && (
            <a
              href={`mailto:${teacher.email}`}
              className="inline-flex items-center gap-1.5 text-sm font-medium text-base-content/70 hover:text-primary hover:underline"
            >
              <Icon name="mail" className="h-4 w-4" />
              <span className="break-all">{teacher.email}</span>
            </a>
          )}
          {teacher.phone && (
            <a
              href={telHref(teacher.phone)}
              className="inline-flex items-center gap-1.5 text-sm font-medium text-base-content/70 hover:text-primary hover:underline"
            >
              <Icon name="phone" className="h-4 w-4" />
              <span className="text-base-content">{teacher.phone}</span>
            </a>
          )}
        </div>
      </div>
    </article>
  )
}

// Until an admin files a profile under Principal, the section shows the same wireframe the other
// sections used before they had any teachers, so the page never opens on an empty box.
export default function PrincipalSection() {
  const { t } = useLanguage()
  const { teachersFor } = useContent()

  const principals = teachersFor('principal')

  if (principals.length === 0) {
    return (
      <ContentSection
        page="teachers"
        slot="principal"
        eyebrow={t('teachers.principalEyebrow')}
        title={t('teachers.principalTitle')}
        label={t('teachers.principalLabel')}
        columns={1}
        imageRatio="aspect-[3/4]"
      />
    )
  }

  return (
    <section className="border-t border-base-300 bg-gradient-to-b from-primary/5 to-base-100 py-14 sm:py-16">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-4 sm:px-6">
        <SectionHeading eyebrow={t('teachers.principalEyebrow')} title={t('teachers.principalTitle')} align="left" />

        {principals.map((teacher) => (
          <PrincipalProfile key={teacher.id} teacher={teacher} />
        ))}
      </div>
    </section>
  )
}
