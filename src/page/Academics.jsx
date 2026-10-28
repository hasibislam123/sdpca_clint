import ContentSection from '../component/Content/ContentSection'
import PageHeader from '../component/ui/PageHeader'
import useLanguage from '../hook/useLanguage'

export default function Academics() {
  const { t } = useLanguage()

  return (
    <>
      <PageHeader
        title={t('academics.title')}
        description={t('academics.description')}
        breadcrumb={[{ label: t('nav.academics') }]}
      />

      <ContentSection
        page="academics"
        slot="classes"
        eyebrow={t('academics.classesEyebrow')}
        title={t('academics.classesTitle')}
        columns={3}
      />
      <ContentSection
        page="academics"
        slot="subjects"
        eyebrow={t('academics.subjectsEyebrow')}
        title={t('academics.subjectsTitle')}
        columns={3}
      />
      <ContentSection
        page="academics"
        slot="exam"
        eyebrow={t('academics.examEyebrow')}
        title={t('academics.examTitle')}
        columns={2}
      />
      <ContentSection
        page="academics"
        slot="calendar"
        eyebrow={t('academics.calendarEyebrow')}
        title={t('academics.calendarTitle')}
        columns={2}
      />
    </>
  )
}
