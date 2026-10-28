import { Link } from 'react-router-dom'
import ContentImage from './ContentImage'
import { Icon } from '../ui/Icon'
import useLanguage from '../../hook/useLanguage'
import { mediaUrl } from '../../config/api'
import { pickLanguageText, splitSubjects } from '../../util/localised'

const SHOWN_SUBJECTS = 2

export default function TeacherCard({ teacher, label }) {
  const { t, lang } = useLanguage()

  const name = pickLanguageText(teacher.name, lang) || t('admin.untitled')
  const designation = pickLanguageText(teacher.designation, lang)
  const subjects = splitSubjects(pickLanguageText(teacher.subjects, lang))
  const shown = subjects.slice(0, SHOWN_SUBJECTS)

  return (
    <Link
      to={`/teachers/${teacher.id}`}
      className="group flex h-full flex-col rounded-box border border-base-300 bg-base-100 p-3 shadow-sm transition duration-200 hover:-translate-y-0.5 hover:border-primary/25 hover:shadow-md sm:p-4"
    >
      <ContentImage
        src={teacher.mediaId ? mediaUrl(teacher.mediaId) : ''}
        alt={name}
        label={label}
        ratio="aspect-[3/4]"
        fit="contain"
        className="border-0"
      />

      <div className="mt-3 flex flex-col gap-0.5">
        <h3 className="text-sm leading-snug font-semibold text-base-content sm:text-base">{name}</h3>
        {designation && <p className="text-xs leading-snug text-secondary">{designation}</p>}
      </div>

      {shown.length > 0 && (
        <div className="mt-2 flex flex-wrap gap-1">
          {shown.map((subject) => (
            <span key={subject} className="badge badge-ghost badge-xs max-w-full justify-start px-2 text-xs font-normal sm:badge-sm">
              <span className="truncate">{subject}</span>
            </span>
          ))}
          {subjects.length > shown.length && (
            <span className="badge badge-ghost badge-xs px-2 text-xs font-normal text-base-content/60 sm:badge-sm">
              +{subjects.length - shown.length}
            </span>
          )}
        </div>
      )}

      <span className="mt-auto inline-flex items-center gap-1.5 pt-3 text-xs font-medium text-primary group-hover:underline">
        {t('teachers.viewProfile')}
        <Icon name="arrowRight" className="h-3.5 w-3.5" />
      </span>
    </Link>
  )
}
