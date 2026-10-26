import SectionHeading from './SectionHeading'
import ImagePlaceholder from './ImagePlaceholder'
import useLanguage from '../../hook/useLanguage'

// Wireframe block for a section whose content is built in a later stage.
export default function SectionPlaceholder({ title, eyebrow, label, columns = 3 }) {
  const { t } = useLanguage()

  return (
    <section className="border-t border-base-300 bg-base-100 py-14 sm:py-16">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-4 sm:px-6">
        <SectionHeading eyebrow={eyebrow} title={title} align="left" />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: columns }).map((_, index) => (
            <ImagePlaceholder key={index} label={label ?? t('common.contentSoon')} ratio="aspect-[16/9]" />
          ))}
        </div>
      </div>
    </section>
  )
}
