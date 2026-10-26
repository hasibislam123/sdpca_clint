import PageSkeleton from '../component/ui/PageSkeleton'
import useLanguage from '../hook/useLanguage'

export default function Contact() {
  const { t } = useLanguage()

  return (
    <PageSkeleton
      title={t('contact.title')}
      description={t('contact.description')}
      breadcrumb={[{ label: t('nav.contact') }]}
      sections={[
        { title: t('contact.channelsTitle'), eyebrow: t('contact.channelsEyebrow'), columns: 3 },
        { title: t('contact.mapTitle'), eyebrow: t('contact.mapEyebrow'), columns: 1, label: t('contact.mapLabel') },
        { title: t('contact.formTitle'), eyebrow: t('contact.formEyebrow'), columns: 1, label: t('contact.formLabel') },
      ]}
    />
  )
}
