// Every animation asks this before it moves anything. A visitor who has asked their device for less
// motion gets the finished layout instead of the journey to it, and nothing on the page depends on an
// animation having run to become readable.
export const prefersReducedMotion = () =>
  typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches === true
