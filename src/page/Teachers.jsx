import PageSkeleton from '../component/ui/PageSkeleton'
import useLanguage from '../hook/useLanguage'

export default function Teachers() {
  const { t } = useLanguage()

  return (
    <PageSkeleton
      title={t('teachers.title')}
      description={t('teachers.description')}
      breadcrumb={[{ label: t('nav.teachers') }]}
      sections={[
        { title: t('teachers.facultyTitle'), eyebrow: t('teachers.facultyEyebrow'), columns: 4, label: t('teachers.facultyLabel') },
        { title: t('teachers.staffTitle'), eyebrow: t('teachers.staffEyebrow'), columns: 3, label: t('teachers.staffLabel') },
      ]}
    />
  )
}
