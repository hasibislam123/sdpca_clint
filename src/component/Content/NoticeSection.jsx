import ContentImage from './ContentImage'
import SectionHeading from '../ui/SectionHeading'
import SectionPlaceholder from '../ui/SectionPlaceholder'
import useContent from '../../hook/useContent'
import useLanguage from '../../hook/useLanguage'
import { mediaUrl } from '../../config/api'
import { formatNoticeDate, pickLanguageText } from '../../util/localised'

const GRID = 'grid gap-4 sm:grid-cols-2 lg:grid-cols-3'

// Notices are dated records rather than page wording, so they come from their own collection and
// keep the same card grid the rest of the site uses.
export default function NoticeSection({ eyebrow, title, description, label, columns = 3, limit = 0, skip = 0 }) {
  const { t, lang, tNumber } = useLanguage()
  const { notices } = useContent()

  const list = limit > 0 ? notices.slice(skip, skip + limit) : notices.slice(skip)

  if (list.length === 0) {
    return <SectionPlaceholder eyebrow={eyebrow} title={title} label={label} columns={columns} />
  }

  return (
    <section className="border-t border-base-300 bg-base-100 py-14 sm:py-16">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-4 sm:px-6">
        <SectionHeading eyebrow={eyebrow} title={title} description={description} align="left" />

        <div className={GRID}>
          {list.map((notice) => (
            <article
              key={notice.id}
              className="flex flex-col gap-3 rounded-box border border-base-300 bg-base-100 p-6 shadow-sm transition duration-200 hover:-translate-y-0.5 hover:border-primary/25 hover:shadow-md"
            >
              {notice.mediaId && (
                <ContentImage
                  src={mediaUrl(notice.mediaId)}
                  alt={pickLanguageText(notice.title, lang)}
                  ratio="aspect-[16/9]"
                  className="rounded-none border-0"
                />
              )}

              <div className="flex flex-wrap items-center gap-2">
                <span className="badge badge-outline border-secondary/40 bg-secondary/5 text-xs font-medium text-secondary">
                  {tNumber(formatNoticeDate(notice.noticeDate, lang))}
                </span>
                {notice.pinned && (
                  <span className="badge badge-primary text-xs font-medium">{t('notices.pinned')}</span>
                )}
              </div>

              <h3 className="text-base font-semibold text-base-content">{pickLanguageText(notice.title, lang)}</h3>
              <p className="whitespace-pre-line text-sm leading-relaxed text-base-content/65">
                {pickLanguageText(notice.description, lang)}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
