import ImagePlaceholder from '../ui/ImagePlaceholder'

// `cover` fills the frame and crops whatever hangs over it; `contain` keeps the whole picture inside
// the frame. Both are written out here rather than composed, so Tailwind's scanner emits each utility.
const FIT = { cover: 'object-cover', contain: 'object-contain' }

// The empty state is the existing ImagePlaceholder with the same ratio classes, so a section looks
// exactly as it does today until an admin uploads a picture into it.
export default function ContentImage({
  src,
  alt,
  label,
  ratio = 'aspect-[4/3]',
  fit = 'cover',
  className = '',
}) {
  if (!src) return <ImagePlaceholder label={label} ratio={ratio} className={className} />

  return (
    <div
      className={`w-full overflow-hidden rounded-box border border-base-300 bg-base-200 ${ratio} ${className}`}
    >
      <img src={src} alt={alt ?? ''} loading="lazy" decoding="async" className={`h-full w-full ${FIT[fit] ?? FIT.cover}`} />
    </div>
  )
}
