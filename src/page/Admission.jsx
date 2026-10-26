import PageSkeleton from '../component/ui/PageSkeleton'
import Button from '../component/ui/Button'
import SectionHeading from '../component/ui/SectionHeading'
import InfoCard from '../component/ui/InfoCard'
import useLanguage from '../hook/useLanguage'
import { applyPath } from '../config/admission'

const steps = [
  { icon: 'book', titleKey: 'admission.step1Title', textKey: 'admission.step1Text' },
  { icon: 'checkCircle', titleKey: 'admission.step2Title', textKey: 'admission.step2Text' },
  { icon: 'shield', titleKey: 'admission.step3Title', textKey: 'admission.step3Text' },
  { icon: 'users', titleKey: 'admission.step4Title', textKey: 'admission.step4Text' },
]

export default function Admission() {
  const { t, tNumber } = useLanguage()

  return (
    <>
      <PageSkeleton
        title={t('admission.title')}
        description={t('admission.description', { year: tNumber(t('school.academicYear')) })}
        breadcrumb={[{ label: t('nav.admission') }]}
      />

      <section className="border-t border-base-300 bg-base-200 py-12 sm:py-14">
        <div className="mx-auto flex w-full max-w-6xl flex-col items-center gap-5 px-4 sm:px-6">
          <SectionHeading
            eyebrow={t('admission.formEyebrow')}
            title={t('admission.formTitle')}
            description={t('admission.loginHint')}
          />
          <Button to={applyPath}>{t('admission.startApplication')}</Button>
        </div>
      </section>

      <section className="border-t border-base-300 bg-base-100 py-14 sm:py-16">
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-4 sm:px-6">
          <SectionHeading
            eyebrow={t('admission.processEyebrow')}
            title={t('admission.processTitle')}
            description={t('admission.processIntro')}
          />
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {steps.map((step, index) => (
              <InfoCard
                key={step.titleKey}
                icon={step.icon}
                meta={t('admission.stepLabel', { n: tNumber(`0${index + 1}`) })}
                title={t(step.titleKey)}
                description={t(step.textKey)}
              />
            ))}
          </div>
          <div className="flex justify-center pt-2">
            <Button to="/contact" variant="outline">
              {t('admission.askButton')}
            </Button>
          </div>
        </div>
      </section>
    </>
  )
}
