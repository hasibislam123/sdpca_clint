import PageSkeleton from '../component/ui/PageSkeleton'
import useLanguage from '../hook/useLanguage'

export default function About() {
  const { t, tNumber } = useLanguage()

  return (
    <PageSkeleton
      title={t('about.title')}
      description={t('about.description')}
      breadcrumb={[{ label: t('nav.about') }]}
      sections={[
        { title: t('about.historyTitle'), eyebrow: t('about.historyEyebrow', { year: tNumber(t('school.established')) }), columns: 1, label: t('about.historyLabel') },
        { title: t('about.principalTitle'), eyebrow: t('about.principalEyebrow'), columns: 1, label: t('about.principalLabel') },
        { title: t('about.visionTitle'), eyebrow: t('about.visionEyebrow'), columns: 2 },
        { title: t('about.resultsTitle'), eyebrow: t('about.resultsEyebrow'), columns: 3 },
      ]}
    />
  )
}
