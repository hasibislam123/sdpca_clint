import Button from '../component/ui/Button'
import ContentImage from '../component/Content/ContentImage'
import ContentSection from '../component/Content/ContentSection'
import NoticeSection from '../component/Content/NoticeSection'
import { Icon } from '../component/ui/Icon'
import useContent from '../hook/useContent'
import useLanguage from '../hook/useLanguage'
import { applyPath } from '../config/admission'

function Hero() {
  const { t, tNumber } = useLanguage()
  const { imageFor } = useContent()
  const hero = imageFor('home', 'hero')

  return (
    <section className="bg-primary text-primary-content">
      <div className="mx-auto grid w-full max-w-6xl items-center gap-10 px-4 py-14 sm:px-6 lg:grid-cols-2 lg:gap-14 lg:py-20">
        <div className="flex flex-col items-start gap-5">
          <span className="badge badge-outline border-secondary bg-secondary/15 py-3 text-xs font-medium text-primary-content">
            <Icon name="sparkle" className="me-1 h-3.5 w-3.5" />
            {t('home.badge', { year: tNumber(t('school.academicYear')) })}
          </span>
          <h1 className="text-3xl leading-tight sm:text-4xl lg:text-5xl">
            {t('brand.name')}
            <span className="mt-2 block text-lg font-normal text-primary-content/80 sm:text-xl">{t('home.subtitle')}</span>
          </h1>
          <p className="max-w-xl text-sm leading-relaxed text-primary-content/75 sm:text-base">{t('school.blurb')}</p>
          <div className="flex flex-wrap gap-3 pt-1">
            <Button to={applyPath} variant="secondary" size="lg">
              {t('home.ctaAdmission')}
            </Button>
            <Button to="/about" variant="light" size="lg">
              {t('home.ctaAbout')}
            </Button>
          </div>
          <div className="flex flex-wrap items-center gap-x-6 gap-y-2 pt-3 text-xs text-primary-content/70">
            <span className="flex items-center gap-2">
              <Icon name="users" className="h-4 w-4" />
              {t('home.established', { year: tNumber(t('school.established')) })}
            </span>
            <span className="flex items-center gap-2">
              <Icon name="mapPin" className="h-4 w-4" />
              {t('home.location', { district: t('school.district'), country: t('school.country') })}
            </span>
          </div>
        </div>

        <div className="relative">
          <ContentImage
            src={hero}
            label={t('home.heroImage')}
            ratio="aspect-[4/3]"
            className="bg-base-100 shadow-xl"
          />
        </div>
      </div>
    </section>
  )
}

function AdmissionCallToAction() {
  const { t } = useLanguage()

  return (
    <section className="border-t border-base-300 bg-base-200 py-14 sm:py-16">
      <div className="mx-auto flex w-full max-w-6xl flex-col items-start gap-6 rounded-box bg-secondary px-6 py-10 text-secondary-content sm:flex-row sm:items-center sm:justify-between sm:px-10">
        <div className="flex flex-col gap-2">
          <h2 className="text-xl leading-snug sm:text-2xl">{t('home.ctaTitle')}</h2>
          <p className="max-w-xl text-sm leading-relaxed text-secondary-content/85">{t('home.ctaText')}</p>
        </div>
        <Button to={applyPath} variant="light" size="lg" className="shrink-0">
          {t('home.ctaButton')}
        </Button>
      </div>
    </section>
  )
}

export default function Home() {
  const { t } = useLanguage()

  return (
    <>
      <Hero />

      <ContentSection page="home" slot="stats" eyebrow={t('home.statsEyebrow')} title={t('home.statsTitle')} columns={3} />
      <ContentSection page="home" slot="about" eyebrow={t('home.aboutEyebrow')} title={t('home.aboutTitle')} columns={3} />
      <ContentSection page="home" slot="programs" eyebrow={t('home.programsEyebrow')} title={t('home.programsTitle')} columns={3} />
      <ContentSection page="home" slot="why" eyebrow={t('home.whyEyebrow')} title={t('home.whyTitle')} columns={3} />

      <ContentSection
        page="teachers"
        slot="faculty"
        eyebrow={t('home.teachersEyebrow')}
        title={t('home.teachersTitle')}
        label={t('teachers.facultyLabel')}
        columns={4}
        limit={4}
      />

      <NoticeSection eyebrow={t('home.noticesEyebrow')} title={t('home.noticesTitle')} limit={3} />

      <AdmissionCallToAction />
    </>
  )
}
