import { useLayoutEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { prefersReducedMotion } from '../../util/motion'

gsap.registerPlugin(ScrollTrigger)

// A wrapper that exists only to be lifted into view once. The children keep their own markup, so the
// section underneath is byte-for-byte the one that renders today; nothing is hidden in a way a browser
// without JavaScript, or a visitor who asked for less motion, would notice.
export default function Reveal({ children, y = 28, duration = 0.75, delay = 0, className = '' }) {
  const node = useRef(null)

  useLayoutEffect(() => {
    if (!node.current || prefersReducedMotion()) return undefined

    const context = gsap.context(() => {
      // fromTo rather than from: the end state is written down instead of inferred from whatever inline
      // style a previous run left behind, and clearProps returns the element to plain CSS afterwards.
      gsap.fromTo(
        node.current,
        { y, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration,
          delay,
          ease: 'power3.out',
          clearProps: 'all',
          scrollTrigger: { trigger: node.current, start: 'top 88%', once: true },
        },
      )
    }, node)

    return () => context.revert()
  }, [y, duration, delay])

  return (
    <div ref={node} className={className}>
      {children}
    </div>
  )
}
