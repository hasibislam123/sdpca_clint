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
      {description && <p className="text-sm leading-relaxed text-base-content/70 sm:text-base">{description}</p>}
    </div>
  )
}
