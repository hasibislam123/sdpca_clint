import NoticeSection from '../component/Content/NoticeSection'
import PageHeader from '../component/ui/PageHeader'
import useLanguage from '../hook/useLanguage'

const LATEST = 6

export default function Notices() {
  const { t } = useLanguage()

  return (
    <>
      <PageHeader
        title={t('notices.title')}
        description={t('notices.description')}
        breadcrumb={[{ label: t('nav.notices') }]}
      />

      <NoticeSection
        eyebrow={t('notices.latestEyebrow')}
        title={t('notices.latestTitle')}
        label={t('notices.latestLabel')}
        limit={LATEST}
      />
      <NoticeSection
        eyebrow={t('notices.archiveEyebrow')}
        title={t('notices.archiveTitle')}
        label={t('notices.archiveLabel')}
        skip={LATEST}
      />
    </>
  )
}
