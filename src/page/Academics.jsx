import PageSkeleton from '../component/ui/PageSkeleton'
import useLanguage from '../hook/useLanguage'

export default function Academics() {
  const { t } = useLanguage()

  return (
    <PageSkeleton
      title={t('academics.title')}
      description={t('academics.description')}
      breadcrumb={[{ label: t('nav.academics') }]}
      sections={[
        { title: t('academics.classesTitle'), eyebrow: t('academics.classesEyebrow'), columns: 3 },
        { title: t('academics.subjectsTitle'), eyebrow: t('academics.subjectsEyebrow'), columns: 3 },
        { title: t('academics.examTitle'), eyebrow: t('academics.examEyebrow'), columns: 2 },
        { title: t('academics.calendarTitle'), eyebrow: t('academics.calendarEyebrow'), columns: 2 },
      ]}
    />
  )
}
