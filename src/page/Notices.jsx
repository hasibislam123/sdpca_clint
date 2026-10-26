import PageSkeleton from '../component/ui/PageSkeleton'
import useLanguage from '../hook/useLanguage'

export default function Notices() {
  const { t } = useLanguage()

  return (
    <PageSkeleton
      title={t('notices.title')}
      description={t('notices.description')}
      breadcrumb={[{ label: t('nav.notices') }]}
      sections={[
        { title: t('notices.latestTitle'), eyebrow: t('notices.latestEyebrow'), columns: 3, label: t('notices.latestLabel') },
        { title: t('notices.archiveTitle'), eyebrow: t('notices.archiveEyebrow'), columns: 3, label: t('notices.archiveLabel') },
      ]}
    />
  )
}
