import ContentSection from '../component/Content/ContentSection'
import PageHeader from '../component/ui/PageHeader'
import useLanguage from '../hook/useLanguage'

export default function About() {
  const { t, tNumber } = useLanguage()

  return (
    <>
      <PageHeader title={t('about.title')} description={t('about.description')} breadcrumb={[{ label: t('nav.about') }]} />

      <ContentSection
        page="about"
        slot="history"
        eyebrow={t('about.historyEyebrow', { year: tNumber(t('school.established')) })}
        title={t('about.historyTitle')}
        label={t('about.historyLabel')}
        columns={1}
      />
      <ContentSection
        page="about"
        slot="principal"
        eyebrow={t('about.principalEyebrow')}
        title={t('about.principalTitle')}
        label={t('about.principalLabel')}
        columns={1}
      />
      <ContentSection
        page="about"
        slot="vision"
        eyebrow={t('about.visionEyebrow')}
        title={t('about.visionTitle')}
        columns={2}
      />
      <ContentSection
        page="about"
        slot="results"
        eyebrow={t('about.resultsEyebrow')}
        title={t('about.resultsTitle')}
        columns={3}
      />
    </>
  )
}
