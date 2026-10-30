// The photographs that open the home page. The first slide is the one the browser must paint before the
// page feels loaded, so the lightest frames lead and the large PNG banner sits last. Replace a file in
// public/images/hero with your own of the same name, or change this list — the caption for each slide is
// `home.slides.<id>` in the translation file, so a new slide needs one new key in each language.
export const heroSlides = [
  { id: 'campus', src: '/images/hero/campus-buildings.jpeg' },
  { id: 'playground', src: '/images/hero/playground.jpeg' },
  { id: 'event', src: '/images/hero/ekushe-event.jpeg' },
  // An 8:3 banner inside a 4:3 frame is cropped to the middle, which would cut away the name boards on
  // both ends, so this one is pinned to the gate instead.
  { id: 'banner', src: '/images/hero/entrance-banner.png', position: 'left center' },
]
