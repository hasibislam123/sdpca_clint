export default function SectionHeading({ eyebrow, title, description, align = 'center', className = '' }) {
  const alignment = align === 'center' ? 'items-center text-center mx-auto' : 'items-start text-left'

  return (
    <div className={`flex max-w-2xl flex-col gap-3 ${alignment} ${className}`}>
      {eyebrow && (
        <span className="badge badge-outline border-secondary/40 bg-secondary/5 px-3 py-3 font-medium text-secondary">
          {eyebrow}
        </span>
      )}
      {title && <h2 className="text-2xl leading-snug text-base-content sm:text-3xl">{title}</h2>}
      {/* One gold rule per section is the accent the palette asks for; it inherits the container's
          alignment, so it sits left under a left heading and centred under a centred one. */}
      {title && <span aria-hidden="true" className="h-1 w-12 rounded-full bg-gold" />}
      {description && <p className="text-sm leading-relaxed text-base-content/70 sm:text-base">{description}</p>}
    </div>
  )
}
