import useLanguage from '../../hook/useLanguage'

export default function ImagePlaceholder({ label, ratio = 'aspect-[4/3]', className = '' }) {
  const { t } = useLanguage()
  const text = label ?? t('common.imageSoon')

  return (
    <div
      role="img"
      aria-label={text}
      className={`flex w-full items-center justify-center overflow-hidden rounded-box border border-dashed border-base-300 bg-base-200 ${ratio} ${className}`}
    >
      <div className="flex flex-col items-center gap-2 text-base-content/35">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-8 w-8">
          <rect x="3" y="4" width="18" height="16" rx="2" />
          <path d="M3 15l4.5-4.5 3.5 3.5 3-3L21 15" strokeLinecap="round" strokeLinejoin="round" />
          <circle cx="9" cy="9" r="1.4" />
        </svg>
        <span className="text-xs font-medium">{text}</span>
      </div>
    </div>
  )
}
