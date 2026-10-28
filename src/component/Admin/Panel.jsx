export default function Panel({ title, description, action, children, className = '' }) {
  return (
    <section className={`flex flex-col gap-5 rounded-box border border-base-300 bg-base-100 p-5 shadow-sm sm:p-6 ${className}`}>
      {(title || description || action) && (
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="flex flex-col gap-1">
            {title && <h2 className="text-lg leading-snug font-semibold text-base-content">{title}</h2>}
            {description && <p className="max-w-2xl text-sm leading-relaxed text-base-content/60">{description}</p>}
          </div>
          {action}
        </div>
      )}
      {children}
    </section>
  )
}
