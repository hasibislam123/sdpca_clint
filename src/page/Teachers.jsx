import PrincipalSection from '../component/Content/PrincipalSection'
import TeacherSection from '../component/Content/TeacherSection'
import PageHeader from '../component/ui/PageHeader'
import useLanguage from '../hook/useLanguage'

export default function Teachers() {
  const { t } = useLanguage()

  return (
    <>
      <PageHeader
        title={t('teachers.title')}
        description={t('teachers.description')}
        breadcrumb={[{ label: t('nav.teachers') }]}
      />

      <PrincipalSection />

      <TeacherSection
        group="faculty"
        eyebrow={t('teachers.facultyEyebrow')}
        title={t('teachers.facultyTitle')}
        label={t('teachers.facultyLabel')}
        columns={4}
      />
      <TeacherSection
        group="staff"
        eyebrow={t('teachers.staffEyebrow')}
        title={t('teachers.staffTitle')}
        label={t('teachers.staffLabel')}
        columns={3}
      />
    </>
  )
}
