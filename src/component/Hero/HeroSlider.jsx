import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react'
import { gsap } from 'gsap'
import { Icon } from '../ui/Icon'
import useContent from '../../hook/useContent'
import useLanguage from '../../hook/useLanguage'
import { heroSlides } from '../../config/heroSlides'
import { prefersReducedMotion } from '../../util/motion'

const DWELL = 6000

const CONTROL =
  'btn btn-circle btn-sm absolute z-10 border-0 bg-base-100/85 text-primary shadow-sm backdrop-blur transition hover:bg-base-100'

// The hero picture is a stack, not a row: every slide sits in the same frame and GSAP cross-fades
// between them, so the panel keeps the exact size and rounding the section had with one image.
// An image the admin uploaded in /admin/pages leads the stack, because that is their own choice of
// campus photo and it should not be buried behind the built-in ones.
export default function HeroSlider() {
  const { t, tNumber } = useLanguage()
  const { imageFor } = useContent()

  const uploaded = imageFor('home', 'hero')
  const motion = !prefersReducedMotion()

  const slides = useMemo(() => {
    const builtIn = heroSlides.map((slide) => ({ ...slide, caption: t(`home.slides.${slide.id}`) }))
    return uploaded ? [{ id: 'uploaded', src: uploaded, caption: '' }, ...builtIn] : builtIn
  }, [uploaded, t])

  const [index, setIndex] = useState(0)
  const [paused, setPaused] = useState(false)
  const [hovered, setHovered] = useState(false)
  const [offscreen, setOffscreen] = useState(false)
  // The heaviest frame is loaded a beat after the first paint, so it never competes with the opening
  // slide for bandwidth on a phone connection.
  const [armed, setArmed] = useState(false)

  const frame = useRef(null)
  const current = Math.min(index, slides.length - 1)
  const caption = slides[current]?.caption || ''

  const go = useCallback((next) => setIndex(((next % slides.length) + slides.length) % slides.length), [slides.length])

  useEffect(() => {
    const raf = requestAnimationFrame(() => setArmed(true))
    return () => cancelAnimationFrame(raf)
  }, [])

  useEffect(() => {
    const onVisibility = () => setOffscreen(document.hidden)
    document.addEventListener('visibilitychange', onVisibility)
    return () => document.removeEventListener('visibilitychange', onVisibility)
  }, [])

  useLayoutEffect(() => {
    const nodes = frame.current ? Array.from(frame.current.querySelectorAll('[data-slide]')) : []
    const active = nodes[current]
    if (!active) return undefined

    const others = nodes.filter((node) => node !== active)

    if (!motion) {
      gsap.set(active, { opacity: 1, scale: 1 })
      gsap.set(others, { opacity: 0 })
      return () => gsap.killTweensOf(nodes)
    }

    gsap.to(active, { opacity: 1, duration: 0.85, ease: 'power2.out', overwrite: 'auto' })
    // A slow drift on the incoming frame is what makes the change read as a transition rather than a cut.
    gsap.fromTo(active, { scale: 1.045 }, { scale: 1, duration: (DWELL * 1.2) / 1000, ease: 'none', overwrite: 'auto' })
    gsap.to(others, { opacity: 0, duration: 0.7, ease: 'power2.inOut', overwrite: 'auto' })

    return () => gsap.killTweensOf(nodes)
  }, [current, motion, slides.length])

  useEffect(() => {
    if (paused || hovered || offscreen || !motion || slides.length < 2) return undefined
    const timer = setInterval(() => go(current + 1), DWELL)
    return () => clearInterval(timer)
  }, [paused, hovered, offscreen, motion, current, slides.length, go])

  const handleKeyDown = (event) => {
    if (event.key === 'ArrowRight') {
      event.preventDefault()
      go(current + 1)
    } else if (event.key === 'ArrowLeft') {
      event.preventDefault()
      go(current - 1)
    }
  }

  const counter = (n) => t('home.slideIndicator', { n: tNumber(String(n)), total: tNumber(String(slides.length)) })

  return (
    <div
      ref={frame}
      className="relative"
      role="group"
      aria-roledescription="carousel"
      aria-label={t('home.sliderLabel')}
      onKeyDown={handleKeyDown}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onFocus={() => setHovered(true)}
      onBlur={() => setHovered(false)}
    >
      <div className="relative aspect-[4/3] overflow-hidden rounded-box border border-base-300 bg-base-200 shadow-xl">
        {slides.map((slide, position) => (
          <div key={slide.id} data-slide className="absolute inset-0 opacity-0" aria-hidden={position !== current}>
            {(armed || position === current) && (
              <img
                src={slide.src}
                alt={slide.caption || t('brand.name')}
                loading={position === 0 ? 'eager' : 'lazy'}
                decoding="async"
                className="h-full w-full object-cover"
                style={slide.position ? { objectPosition: slide.position } : undefined}
              />
            )}
          </div>
        ))}

        {(caption || slides.length > 1) && (
          <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-3 bg-gradient-to-t from-navy/90 via-navy/35 to-transparent px-3 pt-10 pb-3 sm:px-4 sm:pb-4">
            {caption ? (
              <p className="text-xs leading-snug font-medium text-mist sm:text-sm">{caption}</p>
            ) : (
              <span />
            )}

            {slides.length > 1 && (
              <div className="flex shrink-0 items-center gap-1.5 pb-1">
                {slides.map((slide, position) => (
                  <button
                    key={slide.id}
                    type="button"
                    onClick={() => go(position)}
                    aria-label={counter(position + 1)}
                    aria-current={position === current}
                    className={`h-2.5 rounded-full transition-all duration-300 ${
                      position === current ? 'w-6 bg-mist' : 'w-2.5 bg-mist/45 hover:bg-mist/75'
                    }`}
                  />
                ))}
              </div>
            )}
          </div>
        )}

        {slides.length > 1 && (
          <>
            <button type="button" className={`${CONTROL} top-1/2 start-2 -translate-y-1/2`} onClick={() => go(current - 1)} aria-label={t('home.slidePrevious')}>
              <Icon name="arrowRight" className="h-4 w-4 rotate-180" />
            </button>
            <button type="button" className={`${CONTROL} top-1/2 end-2 -translate-y-1/2`} onClick={() => go(current + 1)} aria-label={t('home.slideNext')}>
              <Icon name="arrowRight" className="h-4 w-4" />
            </button>
          </>
        )}
      </div>

      {motion && slides.length > 1 && (
        <button
          type="button"
          onClick={() => setPaused((value) => !value)}
          className="btn btn-circle btn-xs absolute top-2 end-2 border-0 bg-base-100/85 text-primary shadow-sm backdrop-blur transition hover:bg-base-100"
          aria-label={paused ? t('home.slidePlay') : t('home.slidePause')}
        >
          <Icon name={paused ? 'play' : 'pause'} className="h-3.5 w-3.5" />
        </button>
      )}

      <p className="sr-only" aria-live="polite">
        {counter(current + 1)}
      </p>
    </div>
  )
}
