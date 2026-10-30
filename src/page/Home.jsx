import { useEffect, useLayoutEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Button from '../component/ui/Button'
import ContentSection from '../component/Content/ContentSection'
import HeroSlider from '../component/Hero/HeroSlider'
import NoticeSection from '../component/Content/NoticeSection'
import Reveal from '../component/Animation/Reveal'
import TeacherSection from '../component/Content/TeacherSection'
import { Icon } from '../component/ui/Icon'
import useContent from '../hook/useContent'
import useLanguage from '../hook/useLanguage'
import { prefersReducedMotion } from '../util/motion'
import { applyPath } from '../config/admission'

// Read top-left to bottom-right: the badge opens, the name and promise follow, the buttons arrive last
// and the picture lifts in beside them. Each target is a marker on markup that already exists, so the
// layout is the one the page has always had — and `clearProps` hands it back to CSS when the tween ends,
// which is what keeps a throttled tab or a StrictMode remount from leaving a button sitting 14px low.
const ENTRANCE = [
  { selector: '[data-hero="badge"]', y: 16, duration: 0.5 },
  { selector: '[data-hero="title"]', y: 26, duration: 0.7, at: '-=0.2' },
  { selector: '[data-hero="subtitle"]', y: 18, duration: 0.55, at: '-=0.35' },
  { selector: '[data-hero="blurb"]', duration: 0.6, at: '-=0.3' },
  { selector: '[data-hero="actions"] > *', y: 14, duration: 0.5, stagger: 0.1, at: '-=0.3' },
  { selector: '[data-hero="facts"] > *', y: 10, duration: 0.45, stagger: 0.08, at: '-=0.3' },
  { selector: '[data-hero="media"]', y: 34, scale: 0.97, duration: 0.9, ease: 'power2.out', at: '<0.1' },
]

function Hero() {
  const { t, tNumber } = useLanguage()
  const region = useRef(null)

  useLayoutEffect(() => {
    if (prefersReducedMotion()) return undefined

    const context = gsap.context(() => {
      const timeline = gsap.timeline({ defaults: { ease: 'power3.out' } })

      for (const step of ENTRANCE) {
        timeline.fromTo(
          step.selector,
          { y: step.y ?? 0, opacity: 0, scale: step.scale ?? 1 },
          {
            y: 0,
            opacity: 1,
            scale: 1,
            duration: step.duration,
            stagger: step.stagger ?? 0,
            ease: step.ease,
            clearProps: 'all',
          },
          step.at,
        )
      }
    }, region)

    return () => context.revert()
  }, [])

  return (
    <section ref={region} className="bg-navy text-mist">
      <div className="mx-auto grid w-full max-w-6xl items-center gap-10 px-4 py-14 sm:px-6 lg:grid-cols-2 lg:gap-14 lg:py-20">
        <div className="flex flex-col items-start gap-5">
          <span data-hero="badge" className="badge badge-outline border-gold/70 bg-gold/15 py-3 text-xs font-medium text-gold">
            <Icon name="sparkle" className="me-1 h-3.5 w-3.5" />
            {t('home.badge', { year: tNumber(t('school.academicYear')) })}
          </span>
          <h1 className="text-3xl leading-tight sm:text-4xl lg:text-5xl">
            <span data-hero="title" className="block">
              {t('brand.name')}
            </span>
            <span
              data-hero="subtitle"
              className="mt-2 block text-lg font-normal text-mist/80 sm:text-xl"
            >
              {t('home.subtitle')}
            </span>
          </h1>
          <p data-hero="blurb" className="max-w-xl text-sm leading-relaxed text-mist/75 sm:text-base">
            {t('school.blurb')}
          </p>
          <div data-hero="actions" className="flex flex-wrap gap-3 pt-1">
            <Button to={applyPath} variant="primary" size="lg">
              {t('home.ctaAdmission')}
            </Button>
            <Button to="/about" variant="onNavy" size="lg">
              {t('home.ctaAbout')}
            </Button>
          </div>
          <div data-hero="facts" className="flex flex-wrap items-center gap-x-6 gap-y-2 pt-3 text-xs text-mist/70">
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

        <div data-hero="media" className="relative">
          <HeroSlider />
        </div>
      </div>
    </section>
  )
}

function AdmissionCallToAction() {
  const { t } = useLanguage()

  return (
    <section className="border-t border-base-300 bg-base-200 py-14 sm:py-16">
      <div className="mx-auto flex w-full max-w-6xl flex-col items-start gap-6 rounded-box border border-gold/25 bg-navy px-6 py-10 text-mist sm:flex-row sm:items-center sm:justify-between sm:px-10">
        <div className="flex flex-col gap-2">
          <h2 className="text-xl leading-snug sm:text-2xl">{t('home.ctaTitle')}</h2>
          <p className="max-w-xl text-sm leading-relaxed text-mist/80">{t('home.ctaText')}</p>
        </div>
        <Button to={applyPath} variant="onNavy" size="lg" className="shrink-0">
          {t('home.ctaButton')}
        </Button>
      </div>
    </section>
  )
}

export default function Home() {
  const { t } = useLanguage()
  const { status } = useContent()

  // Saved content lands after the first paint and changes how tall each section is, so the scroll
  // positions ScrollTrigger measured have to be taken again.
  useEffect(() => {
    ScrollTrigger.refresh()
  }, [status])

  return (
    <>
      <Hero />

      <Reveal>
        <ContentSection page="home" slot="stats" eyebrow={t('home.statsEyebrow')} title={t('home.statsTitle')} columns={3} />
      </Reveal>
      <Reveal>
        <ContentSection page="home" slot="about" eyebrow={t('home.aboutEyebrow')} title={t('home.aboutTitle')} columns={3} />
      </Reveal>
      <Reveal>
        <ContentSection page="home" slot="programs" eyebrow={t('home.programsEyebrow')} title={t('home.programsTitle')} columns={3} />
      </Reveal>
      <Reveal>
        <ContentSection page="home" slot="why" eyebrow={t('home.whyEyebrow')} title={t('home.whyTitle')} columns={3} />
      </Reveal>

      <Reveal>
        <TeacherSection
          group="faculty"
          eyebrow={t('home.teachersEyebrow')}
          title={t('home.teachersTitle')}
          label={t('teachers.facultyLabel')}
          columns={4}
          limit={4}
        />
      </Reveal>

      <Reveal>
        <NoticeSection eyebrow={t('home.noticesEyebrow')} title={t('home.noticesTitle')} limit={3} />
      </Reveal>

      <Reveal y={20}>
        <AdmissionCallToAction />
      </Reveal>
    </>
  )
}
